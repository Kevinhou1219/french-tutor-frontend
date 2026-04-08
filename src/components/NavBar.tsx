import { NavLink } from 'react-router-dom'
import styles from './NavBar.module.css'
import { sounds } from '../sounds'

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <NavLink
          to="/"
          end
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          onClick={() => sounds.click.play()}
        >
          🌱 My Garden
        </NavLink>
        <NavLink
          to="/seed-shop"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          onClick={() => sounds.click.play()}
        >
          🌿 My Seed Shop
        </NavLink>
        <NavLink
          to="/medals"
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          onClick={() => sounds.click.play()}
        >
          🏅 My Trophy Shelf
        </NavLink>
      </div>
    </nav>
  )
}
