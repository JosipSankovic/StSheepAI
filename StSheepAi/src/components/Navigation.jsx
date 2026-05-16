const navItems = [
  { id: 'reviews', label: 'Review Intelligence' },
  { id: 'photo-guide', label: 'AI Photo Guide' },
  { id: 'beaches', label: 'Beach Monitor' },
]

function Navigation({ activePage, onChangePage }) {
  return (
    <nav className="app-nav" aria-label="Main app sections">
      {navItems.map((item) => (
        <button
          key={item.id}
          type="button"
          className="nav-button"
          aria-current={activePage === item.id ? 'page' : undefined}
          onClick={() => onChangePage(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}

export default Navigation
