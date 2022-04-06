import loginStyle from '~/styles/login.css';
import {useSearchParams, Link} from '@remix-run/react';
import {ActionFunction, json, redirect, useActionData} from "remix";
import {createUserSession, login, register} from "~/utils/session.server";
import {commitSession, getSession} from "~/sessions";

export const links = () => [
    {
        href: loginStyle,
        rel: 'stylesheet'
    }
]

const buildErrorResponse = (error: { [key: string]: string }) => {
    return {
        ...error,
        status: 400
    }
}

export const action: ActionFunction = async ({request}) => {
    const session = await getSession(request.headers.get('Cookie'));
    const formData = await request.formData();
    const loginType = formData.get('loginType')
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();

    if (typeof username !== 'string' || typeof password != 'string' || !username || !password) {
        return json(buildErrorResponse({
            error: 'Invalid credentials'
        }))
    }


    if (loginType === 'register') {
        const registrationSuccessful = await register(username, password);
        if (!registrationSuccessful) {
            return json({
                error: 'User already exists'
            })
        }


    } else if (loginType === 'login') {

        const user = await login(username, password)
        if (!user) {
            return json(buildErrorResponse({
                error: 'Invalid credentials'
            }))
        }

        return createUserSession(user.id, '/jokes');
    }
    return redirect('/jokes', {
        headers: {
            'Set-Cookie': await commitSession(session)
        }
    })
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