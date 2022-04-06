import indexStyle from '~/styles/index.css';
import {Link} from "@remix-run/react";

export const links = () => [
    {
        href: indexStyle,
        rel: 'stylesheet'
    }
]

export default function IndexRoute() {
    return (
        <div className="container">
            <div className="content">
                <h1>
                    Remix <span>Jokes!</span>
                </h1>
                <nav>
                    <ul>
                        <li>
                            <Link to={'/jokes'}>
                                Read Jokes
                            </Link>
                        </li>
                    </ul>
                </nav>

            </div>
        </div>

    )
}