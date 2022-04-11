import {json, LoaderFunction, useCatch, useLoaderData, useParams} from "remix";
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
    if (!joke) throw new Response('Joke not found', {
        status: 404
    })
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

export function CatchBoundary() {
    const caught = useCatch();
    const params = useParams();
    if (caught.status === 404) {
        return (
            <div className="error-container">
                Huh? What the heck is "{params.joke}"?
            </div>
        );
    }
    throw new Error(`Unhandled error: ${caught.status}`)
}

export function ErrorBoundary() {
    const {joke} = useParams();
    return (
        <div className="error-container">{`There was an error loading joke by the id ${joke}. Sorry.`}</div>

    )
}