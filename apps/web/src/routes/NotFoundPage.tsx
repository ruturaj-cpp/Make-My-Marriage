import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="welcome-card" aria-labelledby="not-found-title">
      <p className="eyebrow">404 · Page not found</p>
      <h1 id="not-found-title">This page is not here yet.</h1>
      <p className="welcome-copy">The address may be incorrect, or this page may be added later.</p>
      <Link className="text-link" to="/">
        Return to the home page
      </Link>
    </section>
  );
}
