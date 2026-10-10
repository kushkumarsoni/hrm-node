import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { menu } from '../config/menu';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const items = menu.filter((m) => m.roles.includes(user.role));

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">HRM Panel</div>
        <nav>
          {items.map((m) => (
            <NavLink key={m.path} to={m.path} end={m.path === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              {m.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="main">
        <header className="topbar">
          <div>
            <strong>{user.name}</strong> <span className="muted">({user.role})</span>
          </div>
          <button className="btn btn-light" onClick={logout}>Logout</button>
        </header>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  );
}
