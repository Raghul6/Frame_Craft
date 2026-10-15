import { ArrowUpRight } from "lucide-react";
import { CATEGORIES, IMAGE_SIZES } from "../../constants/home";
import { HOME_SECTIONS } from "../../constants/navigation";
import { revealOrder } from "../../utils/motion";

const CategorySection = () => (
  <section id={HOME_SECTIONS.shop} className="container py-2xl">
    <div className="section-header" data-reveal="1">
      <div>
        <span className="hero-subtitle">— Find Your Frame</span>
        <h2 className="section-title">Made to belong in your home</h2>
        <p className="section-intro section-intro-narrow">
          From quiet oak to slender brass, every profile is designed to let the
          photograph speak first.
        </p>
      </div>
      <a href={`#${HOME_SECTIONS.products}`} className="text-link">
        Explore all frames
      </a>
    </div>

    <div className="category-grid">
      {CATEGORIES.map((c, i) => (
        <div
          key={c.title}
          className="category-card"
          data-reveal={revealOrder(i)}
        >
          <img
            src={c.image}
            alt={c.alt}
            className="category-image"
            loading="lazy"
            decoding="async"
            {...IMAGE_SIZES.category}
          />
          <div className="category-info">
            <div>
              <h3 className="category-title">{c.title}</h3>
              <span className="category-desc">{c.desc}</span>
            </div>
            <button className="icon-btn" aria-label={`Shop ${c.title}`}>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default CategorySection;
