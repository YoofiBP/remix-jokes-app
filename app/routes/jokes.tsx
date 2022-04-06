import {Outlet} from "react-router-dom";
import jokesStyles from '~/styles/jokes.css'
import {Link} from "@remix-run/react";
import {json, LoaderFunction, useLoaderData} from "remix";
import {db} from "~/utils/db.server";
import {z} from "zod";

const JokeData = z.object({
    name: z.string(),
    id: z.string(),
})

export type JokePayload = {
    jokeListItems: z.infer<typeof JokeData>[]
}

export const loader: LoaderFunction = async () => {
    const jokes = await db.joke.findMany({
        take: 5,
        select: {name: true, id: true},
        orderBy: {createdAt: "desc"}
    });
    return json({
        jokeListItems: jokes
    });
}

export const links = () => [
    {
        href: jokesStyles,
        rel: 'stylesheet'
    }
]

export default function JokesRoute() {
    const data = useLoaderData<JokePayload>();

    JokeData.parse(data.jokeListItems[0])
    return (
        <div className="jokes-layout">
            <header className="jokes-header">
                <div className="container">
                    <h1 className="home-link">
                        <Link
                            to="/"
                            title="Remix Jokes"
                            aria-label="Remix Jokes"
                        >
                            <span className="logo">🤪</span>
                            <span className="logo-medium">J🤪KES</span>
                        </Link>
                    </h1>
                </div>
            </header>
            <main className="jokes-main">
                <div className="container">
                    <div className="jokes-list">
                        <Link to=".">Get a random joke</Link>
                        <p>Here are a few more jokes to check out:</p>
                        <ul>
                            {data.jokeListItems.map(joke => <li key={joke.id}>
                                <Link to={joke.id}>{joke.name}</Link>
                            </li>)}

                        </ul>
                        <Link to="new" className="button">
                            Add your own
                        </Link>
                    </div>
                    <div className="jokes-outlet">
                        <Outlet/>
                    </div>
                </div>
            </main>
        </div>
    )
}