import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";

function pickDescription(raw) {
  if (!raw) return null;
  if (typeof raw === "string") return raw;
  if (typeof raw === "object" && raw.value) return raw.value;
  return null;
}

function formatAuthors(authorNames) {
  return (authorNames || []).length ? `By ${authorNames.join(", ")}` : "";
}

function buildFallbackText(book) {
  const firstSentence = book.first_sentence?.[0];
  const authorsLine = formatAuthors(book.author_name);
  const fsLine =
    firstSentence ||
    "No work key was returned for this search result. Try opening another edition from search.";

  return [book.title, authorsLine, fsLine].filter(Boolean).join("\n\n");
}

function buildErrorText(book) {
  return [
    book.title || "This book",
    (book.author_name || []).join(", ") || "Unknown author",
    "Could not load the full description. Use the back button and try another book.",
  ].join("\n\n");
}

function buildWorkText(book, d) {
  const desc = pickDescription(d.description);
  const parts = [];

  if (book.title) parts.push(book.title);
  if ((book.author_name || []).length)
    parts.push("By " + (book.author_name || []).join(", "));

  if (d.first_publish_date || book.first_publish_year) {
    parts.push("First published: " + (d.first_publish_date || book.first_publish_year));
  }

  if (desc) parts.push(desc);
  else if (d.subtitle) parts.push(d.subtitle);

  if (d.excerpts?.length) {
    const ex = d.excerpts[0];
    const excerptText =
      typeof ex === "string" ? ex : ex?.excerpt || ex?.text || "";
    if (excerptText) parts.push("\n\n— Excerpt —\n\n" + excerptText);
  }

  if (Array.isArray(d.subjects) && d.subjects.length > 0) {
    parts.push("\n\nSubjects: " + d.subjects.slice(0, 30).join(", "));
  }

  if (Array.isArray(d.subject_places) && d.subject_places.length > 0) {
    parts.push("\n\nPlaces: " + d.subject_places.slice(0, 15).join(", "));
  }

  if (Array.isArray(d.subject_people) && d.subject_people.length > 0) {
    parts.push("\n\nPeople: " + d.subject_people.slice(0, 15).join(", "));
  }

  // If Open Library returned almost nothing, show a friendly message
  if (parts.length <= 2 && !desc) {
    parts.push(
      "Open Library did not include a long description for this work. Try another edition or search for a similar title."
    );
  }

  return parts.join("\n\n");
}

export default function Read() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const book = state?.book;
  const [navSearch, setNavSearch] = useState("");
  const [emptyNav, setEmptyNav] = useState("");
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!book) return;
    setErr(null);
    setText("");
    setLoading(true);

    let cancelled = false;
    const url = book.key ? `https://openlibrary.org${book.key}.json` : "";

    async function load() {
      // Search results sometimes don't include a work key
      if (!book.key) {
        setLoading(false);
        setText(buildFallbackText(book));
        return;
      }

      try {
        const [workRes, wikiRes] = await Promise.allSettled([
          axios.get(url),
          axios.get(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
              book.title || ""
            )}`
          ),
        ]);
        if (cancelled) return;

        let fullText = "";
        if (workRes.status === "fulfilled") {
          fullText += buildWorkText(book, workRes.value.data);
        }

        if (
          wikiRes.status === "fulfilled" &&
          wikiRes.value?.data?.extract &&
          typeof wikiRes.value.data.extract === "string"
        ) {
          fullText += "\n\nAbout this topic:\n\n" + wikiRes.value.data.extract;
        }

        if (!fullText.trim()) {
          fullText = buildErrorText(book);
        }
        setText(fullText);
      } catch {
        if (cancelled) return;
        setErr("Could not load reading content.");
        setText(buildErrorText(book));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [book]);

  if (!book) {
    return (
      <div className="page page-read">
        <Navbar
          page="books"
          searchValue={emptyNav}
          onSearchChange={setEmptyNav}
          onSearchSubmit={() =>
            navigate(
              emptyNav.trim()
                ? `/books?q=${encodeURIComponent(emptyNav.trim())}`
                : "/books"
            )
          }
        />
        <main className="read-main read-main--empty">
          <h1>No book selected</h1>
          <button type="button" className="btn btn-read" onClick={() => navigate("/books")}>
            Browse books
          </button>
        </main>
      </div>
    );
  }

  const coverSrc = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : "https://via.placeholder.com/200x300/e8ecf4/64748b?text=Cover";

  const runSearch = () => {
    const q = navSearch.trim();
    navigate(q ? `/books?q=${encodeURIComponent(q)}` : "/books");
  };

  return (
    <div className="page page-read">
      <Navbar
        page="books"
        searchValue={navSearch}
        onSearchChange={setNavSearch}
        onSearchSubmit={runSearch}
      />
      <main className="read-main">
        <div className="read-layout">
          <aside className="read-aside">
            <img src={coverSrc} alt="" className="read-cover" />
            <h1 className="read-title">{book.title}</h1>
            <p className="read-author">
              {(book.author_name || []).join(", ") || "Unknown author"}
            </p>
            <div className="read-actions">
              <Link to="/books" className="btn btn-read btn-read--outline">
                ← Back to books
              </Link>
            </div>
          </aside>
          <article className="read-article">
            {loading && <p className="read-loading">Loading content…</p>}
            {err && <p className="books-error">{err}</p>}
            <div className="read-prose">{text}</div>
          </article>
        </div>
      </main>
    </div>
  );
}
