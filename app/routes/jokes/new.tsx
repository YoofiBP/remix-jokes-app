import {ActionFunction, json, redirect, useActionData} from "remix";
import {db} from "~/utils/db.server";
import React, {ReactEventHandler} from "react";

export const action: ActionFunction = async ({request}) => {
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
            content
        }
    })

    return redirect(`/jokes/${newJoke.id}`);
}

export default function NewJoke() {
    const errors = useActionData();

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        console.log(event.target.value)
    }

    return (
        <form method={'post'}>
            <div>
                <label htmlFor={'name'}>
                    Name: {" "}
                    <input name={'name'} id={'name'} onChange={handleChange}/>
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