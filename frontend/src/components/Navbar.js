import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navClass = ({ isActive }) =>
  `nav-link ${isActive ? "nav-link--active" : ""}`;

/** page: 'default' | 'books' | 'favourites' — controls search vs favorites filter when logged in */
export default function Navbar({
  page = "default",
  searchValue = "",
  onSearchChange,
  onSearchSubmit,
  favSearchValue = "",
  onFavSearchChange,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthed = !!user?.loggedIn;
  const onLoginPage = location.pathname === "/login";

  const goBooksOrLogin = (e) => {
    if (!isAuthed) {
      e.preventDefault();
      navigate("/login");
    }
  };

  const goFavOrLogin = (e) => {
    if (!isAuthed) {
      e.preventDefault();
      navigate("/login");
    }
  };

  const showBooksSearch = isAuthed && page !== "favourites";
  const showFavFilter = isAuthed && page === "favourites";

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-logo">
          Book Library
        </Link>

        <nav className="site-nav" aria-label="Main">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <NavLink
            to="/favourites"
            className={navClass}
            onClick={goFavOrLogin}
          >
            Favorites
          </NavLink>
          <NavLink to="/books" className={navClass} onClick={goBooksOrLogin}>
            Books
          </NavLink>
        </nav>

        <div className="site-header__actions">
          {showBooksSearch && (
            <form
              className="nav-search"
              onSubmit={(e) => {
                e.preventDefault();
                onSearchSubmit?.();
              }}
              role="search"
            >
              <input
                type="search"
                placeholder="Search books..."
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                aria-label="Search books"
              />
              <button type="submit" className="btn btn-search">
                Search
              </button>
            </form>
          )}

          {showFavFilter && (
            <div className="nav-search nav-search--compact">
              <input
                type="search"
                placeholder="Filter favorites..."
                value={favSearchValue}
                onChange={(e) => onFavSearchChange?.(e.target.value)}
                aria-label="Filter favorites"
              />
            </div>
          )}

          {isAuthed ? (
            <div className="nav-user">
              <span className="nav-user__name" title={user.email}>
                Hi, {user.name}
              </span>
              <button type="button" className="btn btn-logout" onClick={logout}>
                Log out
              </button>
            </div>
          ) : (
            !onLoginPage && (
              <button
                type="button"
                className="btn btn-login-header"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
