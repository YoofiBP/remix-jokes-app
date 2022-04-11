import {Links, LiveReload, Outlet, useCatch} from "remix";
import globalStyles from '~/styles/global.css';
import globalLargeStyles from '~/styles/global-large.css';
import globalMediumStyles from '~/styles/global-medium.css';
import React from "react";


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

function Document({children, title = "Remix so great its funny"}: {
    children: React.ReactNode;
    title?: string;
}) {
    return (
        <html lang={'en'}>
        <head>
            <meta charSet="utf-8"/>
            <title>Remix is great{title}</title>
            <Links/>
        </head>
        <body>
        {children}
        <LiveReload/>
        </body>
        </html>
    )
}

export default function App() {
    return (
        <Document>
            <Outlet/>
        </Document>
    )
}

export function ErrorBoundary({error}: { error: Error }) {
    return (
        <Document title={'Uh-oh'}>
            <div className="error-container">
                <h1>App Error</h1>
                <pre>{error.message}</pre>
            </div>
        </Document>
    )
}

export function CatchBoundary() {
    const caught = useCatch();
    return (<Document
        title={`${caught.status} ${caught.statusText}`}
    >
        <div className="error-container">
            <h1>
                {caught.status} {caught.statusText}
            </h1>
        </div>
    </Document>);
}