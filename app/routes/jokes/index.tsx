import {db} from "~/utils/db.server";
import {json, LoaderFunction, redirect, useLoaderData} from "remix";
import {getSession} from "~/sessions";

export const loader: LoaderFunction = async ({request}) => {
    const session = await getSession(request.headers.get('Cookie'))
    if (!session.has('userID')) return redirect('/login')
    const count = await db.joke.count();
    const randomNumber = Math.floor(Math.random() * count);
    const [joke] = await db.joke.findMany({
        take: 1,
        skip: randomNumber
    });

    return json({
        joke
    });
}


export default function Index() {
    const data = useLoaderData();
    return (
        <>
            <div>
                <p>Here is a random joke</p>
                {data.joke.content}
            </div>
            <div>
                By: {data.joke.name}
            </div>
        </>
    )
}