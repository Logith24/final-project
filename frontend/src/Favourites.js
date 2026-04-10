import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";

const FAV_KEY = "fav";

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem(FAV_KEY, JSON.stringify(list));
}

function bookId(book) {
  return book.key || `${book.title}-${(book.author_name || []).join(",")}`;
}

export default function Favourites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [favSearch, setFavSearch] = useState("");

  // Filter favorites by title/author (simple + readable)
  const q = favSearch.trim().toLowerCase();
  const filtered = !q
    ? favorites
    : favorites.filter((b) => {
        const title = (b.title || "").toLowerCase();
        const authors = (b.author_name || []).join(" ").toLowerCase();
        return title.includes(q) || authors.includes(q);
      });

  const remove = (book) => {
    const id = bookId(book);
    const next = favorites.filter((x) => bookId(x) !== id);
    saveFavorites(next);
    setFavorites(next);
  };

  return (
    <div className="page page-favourites">
      <Navbar
        page="favourites"
        favSearchValue={favSearch}
        onFavSearchChange={setFavSearch}
      />

      <main className="books-main">
        <h1 className="page-heading">Favorites</h1>
        <p className="page-lead">
          {favorites.length} saved {favorites.length === 1 ? "book" : "books"}
          {favSearch.trim() ? ` · ${filtered.length} match filter` : ""}
        </p>

        <div className="book-grid">
          {filtered.map((book, i) => (
            <article className="book-card" key={bookId(book) + String(i)}>
              <div className="book-card__cover">
                <img
                  src={
                    book.cover_i
                      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                      : "https://via.placeholder.com/180x270/e8ecf4/64748b?text=No+cover"
                  }
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/180x270/e8ecf4/64748b?text=No+cover";
                  }}
                />
              </div>
              <div className="book-card__body">
                <h2 className="book-card__title">{book.title}</h2>
                <p className="book-card__author">
                  {(book.author_name || []).slice(0, 2).join(", ") ||
                    "Unknown author"}
                </p>
                <div className="book-card__actions book-card__actions--stack">
                  <button
                    type="button"
                    className="btn btn-fav btn-fav--danger"
                    onClick={() => remove(book)}
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    className="btn btn-read"
                    onClick={() => navigate("/read", { state: { book } })}
                  >
                    Read book
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {favorites.length === 0 && (
          <p className="books-empty">
            No favorites yet. Add books from the Books page.
          </p>
        )}
        {favorites.length > 0 && filtered.length === 0 && (
          <p className="books-empty">No favorites match your filter.</p>
        )}
      </main>
    </div>
  );
}
