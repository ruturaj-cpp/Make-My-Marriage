import { Link, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/">
          Make My Marriage
        </Link>
        <span className="header-note">Wedding planning, together</span>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="site-footer">A thoughtful start to your celebration.</footer>
    </div>
  );
}
