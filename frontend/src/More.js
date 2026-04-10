import Navbar from "./components/Navbar";

export default function More() {
  return (
    <div className="page page-more">
      <Navbar page="default" />
      <main className="page-main more-content">
        <h1>More</h1>
        <section className="more-section">
          <h2>About Book Library</h2>
          <p>
            Book Library helps you discover books from the Open Library catalog,
            save favorites, and read descriptions and excerpts in one calm,
            responsive experience.
          </p>
        </section>
        <section className="more-section">
          <h2>Tips</h2>
          <ul>
            <li>Use search and filters on the Books page to narrow results.</li>
            <li>Sort by title or year to browse differently.</li>
            <li>Favorites are stored in your browser for quick access.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
