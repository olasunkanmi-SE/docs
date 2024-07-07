import { Form, NavLink, useSubmit } from "@remix-run/react";
import { ContactRecord } from "~/data";

interface ISideBar {
  contacts: ContactRecord[];
  q: string | null;
  searching: boolean | undefined;
}

export const SideBar = ({ contacts, q, searching }: ISideBar) => {
  const submit = useSubmit();
  return (
    <div id="sidebar">
      <h1>Fiatinnovations</h1>
      <div>
        <Form
          id="search-form"
          onChange={(event) => {
            const isFirstSearch = q === null;
            submit(event.currentTarget, {
              replace: !isFirstSearch,
            });
          }}
          role="search"
        >
          <input
            id="q"
            aria-label="Search contacts"
            className={searching ? "loading" : ""}
            defaultValue={q || ""}
            placeholder="Search"
            type="search"
            name="q"
          />
          <div id="search-spinner" aria-hidden hidden={!searching} />
        </Form>
        <Form method="post">
          <button type="submit">New</button>
        </Form>
      </div>
      <nav>
        {contacts.length ? (
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id}>
                <NavLink
                  className={({ isActive, isPending }) => (isActive ? "active" : isPending ? "pending" : "")}
                  to={`contacts/${contact.id}`}
                >
                  {contact.first || contact.last ? (
                    <>
                      {contact.first} {contact.last}
                    </>
                  ) : (
                    <i>No Name</i>
                  )}{" "}
                  {contact.favorite ? <span>★</span> : null}
                </NavLink>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            <i>No contacts</i>
          </p>
        )}
      </nav>
    </div>
  );
};
