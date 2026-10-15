import { ArrowRight } from "lucide-react";
import { HALF_WIDTH_IMAGE_SIZES, HERO } from "../../constants/home";

const HeroSection = () => (
  <section className="hero">
    <div className="hero-content">
      <span className="hero-subtitle">{HERO.eyebrow}</span>
      <h1>{HERO.title}</h1>
      <p className="hero-description">{HERO.description}</p>
      <div className="hero-buttons">
        <button className="btn btn-primary">
          Shop Best Sellers <ArrowRight size={16} />
        </button>
        <button className="btn btn-secondary">
          Build a Custom Frame <ArrowRight size={16} />
        </button>
      </div>
      <div className="hero-features">
        {HERO.features.map((feature, i) => (
          <span key={feature} className="hero-feature">
            {i > 0 && <span aria-hidden>•</span>}
            {feature}
          </span>
        ))}
      </div>
    </div>
    <div className="hero-media">
      <img
        src={HERO.image}
        srcSet={HERO.srcSet}
        sizes={HALF_WIDTH_IMAGE_SIZES}
        alt={HERO.imageAlt}
        className="hero-image"
        fetchPriority="high"
      />
      <div className="hero-caption">
        <span className="hero-caption-label">{HERO.captionLabel}</span>
        <span className="hero-caption-title">{HERO.captionTitle}</span>
      </div>
    </div>
  </section>
);

export default HeroSection;
