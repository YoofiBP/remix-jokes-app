import {db} from "~/utils/db.server";
import {json, useLoaderData} from "remix";

export const loader = async () => {
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

export function newFunction() {
    console.log('Hello world+')
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