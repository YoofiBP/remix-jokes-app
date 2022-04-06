import {json, LoaderFunction, useLoaderData} from "remix";
import invariant from "tiny-invariant";
import {db} from "~/utils/db.server";
import {Joke} from "@prisma/client";

type LoaderData = {
    joke: Joke
}

export const loader: LoaderFunction = async ({params}) => {
    const id = params.joke;
    invariant(id, 'No joke Id specified');
    const joke = await db.joke.findUnique({
        where: {
            id
        },
        select: {content: true, name: true}
    })
    if (!joke) throw new Error('Joke not found')
    return json({joke})
}

export default function JokeById() {
    const data = useLoaderData<LoaderData>();

    return (
        <div>
            <p>Here's your hilarious joke:</p>
            <p>
                {data.joke.content}
            </p>
            <p>By: {data.joke.name}</p>
        </div>
    )
}