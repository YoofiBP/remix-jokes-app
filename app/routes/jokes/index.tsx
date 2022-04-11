import {db} from "~/utils/db.server";
import {json, LoaderFunction, useCatch, useLoaderData} from "remix";

export const loader: LoaderFunction = async () => {
    const count = await db.joke.count();
    const randomNumber = Math.floor(Math.random() * count);
    const [joke] = await db.joke.findMany({
        take: 1,
        skip: randomNumber
    });

    if (!joke) throw new Response('Random joke not found', {
        status: 404
    })

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

export function CatchBoundary() {
    const caught = useCatch();
    if (caught.status === 404) {
        return (
            <div className="error-container">
                There are no jokes to display.
            </div>
        );
    }
    throw new Error(`Unhandled exception ${caught.status}`)
}

export function ErrorBoundary() {
    return (
        <div className="error-container">
            I did a whoopsies.
        </div>
    );
}