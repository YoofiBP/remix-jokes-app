import {ActionFunction, json, LoaderFunction, redirect, useActionData, useCatch} from "remix";
import {db} from "~/utils/db.server";
import React from "react";
import {getUser, requireUserID} from "~/utils/session.server";
import {Link} from "@remix-run/react";

export const loader: LoaderFunction = async ({request}) => {
    const userID = await getUser(request);
    if (!userID) {
        throw new Response('Unauthenticated', {
            status: 401
        })
    }
    return json({})
}

export const action: ActionFunction = async ({request}) => {
    const userID = await requireUserID(request)
    const formData = await request.formData();

    const name = formData.get('name')?.toString();
    const content = formData.get('content')?.toString();

    if (!name || !content) {
        return json({
            error: 'Name and Content must be provided'
        })
    }

    if (name.length < 4) {
        return json({
                error: 'Name too short'
            },
            {
                status: 400
            })
    }

    if (content.length < 10) {
        return json({
            error: 'Content too short'
        }, {
            status: 400
        })
    }

    const newJoke = await db.joke.create({
        data: {
            name,
            content,
            jokesterId: userID
        }
    })

    return redirect(`/jokes/${newJoke.id}`);
}

export default function NewJoke() {
    const errors = useActionData();

    return (
        <form method={'post'}>
            <div>
                <label htmlFor={'name'}>
                    Name: {" "}
                    <input name={'name'} id={'name'}/>
                </label>
            </div>
            <div>
                <label htmlFor={'content'}>
                    Content: {" "}
                    <textarea name={'content'} id={'content'}/>
                </label>
            </div>
            <div>
                <input type={'submit'} value={'Add'}/>
            </div>
            {errors && <p>{errors.error}</p>}
        </form>
    )
}

export function CatchBoundary() {
    const caught = useCatch();
    if (caught.status === 401) {
        return (
            <div className="error-container">
                <p>You must be logged in to create a joke.</p>
                <Link to="/login">Login</Link>
            </div>
        );
    }

    throw new Error(`Unhandled exception ${caught.status}`)
}

export function ErrorBoundary() {
    return (
        <div className="error-container">
            Something unexpected went wrong. Sorry about that.
        </div>
    );
}