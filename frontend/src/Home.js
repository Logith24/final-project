import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";

const carouselImages = [
  {
    src: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80",
    alt: "Library shelves with warm light",
  },
  {
    src: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80",
    alt: "Open book pages",
  },
  {
    src: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&q=80",
    alt: "Reading by the window",
  },
];

const homeBookImages = [
  {
    src: "https://covers.openlibrary.org/b/id/10521270-L.jpg",
    title: "The Great Gatsby",
  },
  {
    src: "https://covers.openlibrary.org/b/id/10958304-L.jpg",
    title: "Sherlock Holmes",
  },
  {
    src: "https://covers.openlibrary.org/b/id/11153223-L.jpg",
    title: "Pride and Prejudice",
  },
  {
    src: "https://covers.openlibrary.org/b/id/11124517-L.jpg",
    title: "Moby Dick",
  },
  {
    src: "https://covers.openlibrary.org/b/id/10909258-L.jpg",
    title: "Treasure Island",
  },
  {
    src: "https://covers.openlibrary.org/b/id/12617931-L.jpg",
    title: "Alice in Wonderland",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    pauseOnHover: true,
    arrows: true,
    adaptiveHeight: true,
  };

  return (
    <div className="page page-home">
      <Navbar
        page="default"
        searchValue={search}
        onSearchChange={setSearch}
        onSearchSubmit={() => {
          if (user?.loggedIn) {
            const q = search.trim();
            navigate(q ? `/books?q=${encodeURIComponent(q)}` : "/books");
          }
        }}
      />

      <main className="home-main">
        <section className="home-hero">
          <h1 className="home-hero__title">Welcome to Book Library</h1>
          <p className="home-hero__subtitle">
            Discover stories, save favorites, and read with a beautiful
            library experience.
          </p>
          {!user?.loggedIn && (
            <button
              type="button"
              className="btn btn-login-hero"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </section>

        <section className="home-carousel-wrap" aria-label="Featured visuals">
          <Slider {...sliderSettings} className="home-carousel">
            {carouselImages.map((img, i) => (
              <div key={i} className="home-carousel__slide">
                <img src={img.src} alt={img.alt} loading={i === 0 ? "eager" : "lazy"} />
              </div>
            ))}
          </Slider>
        </section>

        <section className="more-section">
          <h2>Why use Book Library?</h2>
          <ul>
            <li>Search books from free APIs.</li>
            <li>Save your favorite books quickly.</li>
            <li>Read book details and summaries in one place.</li>
          </ul>
        </section>

        <section className="home-highlights">
          <article className="home-highlight-card">
            <h3>Large Book Collection</h3>
            <p>Browse many books from free online library sources.</p>
          </article>
          <article className="home-highlight-card">
            <h3>Quick Favourites</h3>
            <p>Save useful books instantly and open them anytime later.</p>
          </article>
          <article className="home-highlight-card">
            <h3>Smooth Reading View</h3>
            <p>Get detailed content and related summary in one page.</p>
          </article>
        </section>

        <section className="home-book-gallery">
          <h2>Popular Book Covers</h2>
          <div className="home-book-grid">
            {homeBookImages.map((book, index) => (
              <article className="home-book-card" key={book.title + index}>
                <img
                  src={book.src}
                  alt={book.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/180x260/e8ecf4/1e3a8a?text=Book+Cover";
                  }}
                />
                <p>{book.title}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="home-footer" style={{textAlign:"center"}}>
        <div className="home-footer__grid">
          <section>
            <h3>About Our Project</h3>
            <p>
              Book Library is a college project built to help students discover
              books, save favourites, and read useful content in one place.
            </p>
          </section>
          <section>
            <h3>Contact Us</h3>
            <p>Email: support@booklibrary.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Address: College Tech Block</p>
          </section>
        </div>
        <p className="home-footer__copy" style={{textAlign:"center"}}>© 2026 Book Library Project</p>
      </footer>
    </div>
  );
}
