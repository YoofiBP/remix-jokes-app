import {createCookieSessionStorage} from "remix";

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
    throw new Error('Session secret not set')
}

const {getSession, commitSession, destroySession} = createCookieSessionStorage({
    cookie: {
        name: '__session',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        secrets: [sessionSecret],
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        expires: new Date(Date.now() + 60_000),
    }
})

export {getSession, commitSession, destroySession}