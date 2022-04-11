import {db} from "~/utils/db.server";
import bcrypt from 'bcryptjs';
import {commitSession, destroySession, getSession} from "~/sessions";
import {redirect} from "remix";

export const login = async (username: string, password: string) => {
    const user = await db.user.findUnique({
        where: {
            username
        }
    })

    if (!user) return null;

    if (!await bcrypt.compare(password, user.passwordHash)) return null;

    return user;
}

export const logout = async (request: Request) => {
    const session = await getUserSession(request);

    return redirect('/login', {
        headers: {
            'Set-Cookie': await destroySession(session)
        }
    })
}

export const register = async (username: string, password: string) => {
    const userExists = await db.user.findUnique({
        where: {
            username
        }
    })

    if (userExists) return null;

    const passwordHash = await bcrypt.hash(password, 10);
    try {
        return await db.user.create({
            data: {
                username,
                passwordHash
            }
        })
    } catch (e) {
        return null;
    }
}

export const createUserSession = async (userID: string, redirectRoute: string) => {
    const session = await getSession();
    session.set('userID', userID);
    return redirect(redirectRoute, {
        headers: {
            'Set-Cookie': await commitSession(session)
        }
    })
}

const getUserSession = async (request: Request) => {
    return await getSession(request.headers.get('Cookie'))
}

const getUserID = async (request: Request) => {
    const session = await getUserSession(request);
    const userID = session.get('userID')
    if (!userID || typeof userID !== 'string') return null;
    return userID;
}

export const requireUserID = async (request: Request, redirectTo: string = new URL(request.url).pathname) => {
    const userID = await getUserID(request);
    if (!userID) {
        const searchParams = new URLSearchParams([
            ["redirectTo", redirectTo]
        ])
        throw redirect(`/login?${searchParams}`)
    }
    return userID;
}

export const getUser = async (request: Request) => {
    const userID = await getUserID(request);

    if (typeof userID !== 'string') return null;

    try {
        return await db.user.findUnique({
            where: {
                id: userID
            },
            select: {id: true, username: true}
        })

    } catch (e) {
        throw logout(request)
    }

}

