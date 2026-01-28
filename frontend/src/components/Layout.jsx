import { Outlet, NavLink } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="app">
      <header className="app-header">
        <span className="app-logo">HRMS Lite</span>
        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Dashboard
          </NavLink>
          <NavLink to="/employees" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Employees
          </NavLink>
          <NavLink to="/attendance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Attendance
          </NavLink>
        </nav>
      </header>
      <main><Outlet /></main>
    </div>
  )
}
