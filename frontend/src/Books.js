import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "./components/Navbar";

const FAV_KEY = "fav";
const API_LIMIT = 48;
const DEFAULT_BROWSE_QUERY = "popular";
const PLACEHOLDER_COVER =
  "https://via.placeholder.com/180x270/e8ecf4/64748b?text=No+cover";

const FILTER_OPTIONS = [
  "kids",
  "fiction",
  "comics",
  "thriller",
  "adventure",
];

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

function getCoverSrc(book) {
  if (book.cover_i) {
    return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
  }
  return PLACEHOLDER_COVER;
}

/**
 * Open Library search docs often omit `subject`, so we must NOT filter client-side
 * by subject. Instead, turn the category into part of the API search query.
 */
function buildApiQuery(qParam, subjectFilter) {
  const typed = (qParam || "").trim();
  const cat = (subjectFilter || "").trim().toLowerCase();

  if (typed && cat) {
    return `${typed} ${cat}`;
  }
  if (typed) {
    return typed;
  }
  if (cat) {
    return cat === "fiction" ? "fiction" : `${cat} books`;
  }
  return DEFAULT_BROWSE_QUERY;
}

export default function Books() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get("q") || "";

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [navSearch, setNavSearch] = useState(qParam || "");
  const [subjectFilter, setSubjectFilter] = useState("");

  const [, setFavVersion] = useState(0);
  const favorites = getFavorites();
  const favIds = new Set(favorites.map(bookId));

  const apiQuery = buildApiQuery(qParam, subjectFilter);

  useEffect(() => {
    setNavSearch(qParam || "");
  }, [qParam]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(
            apiQuery
          )}&limit=${API_LIMIT}`
        );
        if (cancelled) return;
        setBooks(res.data.docs || []);
      } catch {
        if (cancelled) return;
        setError("Could not load books. Try again.");
        setBooks([]);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [apiQuery]);

  const addToFav = (book) => {
    const id = bookId(book);
    if (favIds.has(id)) {
      window.alert("This book is already in favourites.");
      return;
    }

    saveFavorites([...favorites, book]);
    setFavVersion((v) => v + 1);
    window.alert("Book added to favourites.");
  };

  const isFav = (book) => favIds.has(bookId(book));

  const runNavSearch = () => {
    const q = navSearch.trim();
    if (q) setSearchParams({ q });
    else setSearchParams({});
  };

  return (
    <div className="page page-books">
      <Navbar
        page="books"
        searchValue={navSearch}
        onSearchChange={setNavSearch}
        onSearchSubmit={runNavSearch}
      />

      <main className="books-main">
        <div className="books-toolbar">
          <div className="books-toolbar__filters">
            <label className="toolbar-label">
              Filter by subject
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                <option value="">All books</option>
                {FILTER_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="books-toolbar__meta">
            {loading ? "Loading…" : `${books.length} books shown`}
          </p>
        </div>

        {error && <p className="books-error">{error}</p>}

        <div className="book-grid">
          {loading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="book-card book-card--skeleton" />
            ))}

          {!loading &&
            books.map((book, i) => (
              <article className="book-card" key={bookId(book) + i}>
                <div className="book-card__cover">
                  <img
                    src={getCoverSrc(book)}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = PLACEHOLDER_COVER;
                    }}
                  />
                </div>

                <div className="book-card__body">
                  <h2 className="book-card__title">{book.title}</h2>
                  <p className="book-card__author">
                    {(book.author_name || []).slice(0, 2).join(", ") ||
                      "Unknown author"}
                  </p>

                  {book.first_publish_year && (
                    <p className="book-card__year">{book.first_publish_year}</p>
                  )}

                  <div className="book-card__actions">
                    <button
                      type="button"
                      className="btn btn-fav"
                      disabled={isFav(book)}
                      onClick={() => addToFav(book)}
                    >
                      {isFav(book) ? "In favorites" : "Add to favorites"}
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

        {!loading && books.length === 0 && !error && (
          <p className="books-empty">No books found. Try another search or filter.</p>
        )}
      </main>
    </div>
  );
}
