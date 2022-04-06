import loginStyle from '~/styles/login.css';
import {useSearchParams, Link} from '@remix-run/react';
import {ActionFunction, json, redirect, useActionData} from "remix";
import {db} from "~/utils/db.server";
import invariant from "tiny-invariant";
import bcrypt from 'bcryptjs';

export const links = () => [
    {
        href: loginStyle,
        rel: 'stylesheet'
    }
]

export const action: ActionFunction = async ({request}) => {
    const formData = await request.formData();
    const loginType = formData.get('loginType')
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();


    if (loginType === 'register') {
        const user = await db.user.findUnique({
            where: {
                username
            }
        })
        if (user) {
            return json({
                error: 'User already exists'
            })
        }

        invariant(typeof username === 'string' && typeof password === 'string');
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await db.user.create({
            data: {
                username,
                passwordHash
            }
        })
        console.log(newUser)
        return redirect('/jokes')
    }
}

export default function LoginPage() {
    const [searchParams] = useSearchParams();
    const errors = useActionData();
    return (
        <div className="container">
            <div className="content" data-light="">
                <h1>Login</h1>
                <form method="post">
                    <input
                        type="hidden"
                        name="redirectTo"
                        value={
                            searchParams.get("redirectTo") ?? undefined
                        }
                    />
                    <fieldset>
                        <legend className="sr-only">
                            Login or Register?
                        </legend>
                        <label>
                            <input
                                type="radio"
                                name="loginType"
                                value="login"
                                defaultChecked
                            />{" "}
                            Login
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="loginType"
                                value="register"
                            />{" "}
                            Register
                        </label>
                    </fieldset>
                    <div>
                        <label htmlFor="username-input">Username</label>
                        <input
                            type="text"
                            id="username-input"
                            name="username"
                        />
                    </div>
                    <div>
                        <label htmlFor="password-input">Password</label>
                        <input
                            id="password-input"
                            name="password"
                            type="password"
                        />
                    </div>
                    <button type="submit" className="button">
                        Submit
                    </button>
                    {errors && <p>{errors.error}</p>}
                </form>
            </div>
            <div className="links">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/jokes">Jokes</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}