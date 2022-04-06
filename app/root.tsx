import {Links, LiveReload, Outlet} from "remix";
import globalStyles from '~/styles/global.css';
import globalLargeStyles from '~/styles/global-large.css';
import globalMediumStyles from '~/styles/global-medium.css';


export const links = () => [
    {
        href: globalStyles,
        rel: 'stylesheet'
    },
    {
        href: globalLargeStyles,
        rel: 'stylesheet',
        media: 'print, (min-width:640px)'
    },
    {
        href: globalMediumStyles,
        rel: 'stylesheet',
        media: 'screen and (min-width: 1024px)'
    }
]

export default function App() {
    return (
        <html lang={'en'}>
        <head>
            <meta charSet="utf-8"/>
            <title>Remix is great!</title>
            <Links/>
        </head>
        <body>
        <Outlet/>
        <LiveReload/>
        </body>
        </html>
    )
}