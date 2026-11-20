import { Link, useRouteError } from "react-router-dom";

// Shown only if a page fails to load. Plain and friendly, with a way home.
export default function ErrorPage() {
  console.error(useRouteError());
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-3xl font-heading">Sorry, something went wrong</h1>
      <p>Please try again, or go back to the home page.</p>
      <Link to="/" className="underline">Go to the home page</Link>
    </div>
  );
}
