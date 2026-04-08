import { NavLink } from 'react-router-dom'
import styles from './NavBar.module.css'

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <NavLink
          to="/"
          end
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          🌱 My Garden
        </NavLink>
        <NavLink
          to="/medals"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          🏅 Medals
        </NavLink>
      </div>
    </nav>
  )
}
