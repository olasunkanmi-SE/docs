import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect } from "react";

import type { LinksFunction } from "@remix-run/node";

import appStylesHref from "./app.css?url";

import styles from "./style.css?url";

import { NavBar } from "./components/navbar";
import { SideBar } from "./components/sidebar";
import { createEmptyContact, getContacts } from "./data";
import { ErrorBoundary } from "./components/Error/Errorboundary";
import { ErrorFallBackComponent } from "./components/Error/ErrorFallBackComponent";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts, q });
};

export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
};

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css",
  },
  { rel: "stylesheet", href: appStylesHref },
  { rel: "stylesheet", href: styles },
];

function MyApp() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q ?? "";
    }
  }, [q]);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <NavBar></NavBar>
      <body>
        <div>
          {" "}
          <SideBar q={q} contacts={contacts} searching={searching} />
        </div>

        <div className={navigation.state === "loading" && !searching ? "loading" : ""} id="detail">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ErrorBoundary fallBackComponent={ErrorFallBackComponent()}>
      <MyApp />
    </ErrorBoundary>
  );
}
