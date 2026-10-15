import { ArrowUpRight } from "lucide-react";
import {
  IMAGE_SIZES,
  INSPIRATION_MAIN,
  INSPIRATION_SIDE,
  WIDE_CARD_IMAGE_SIZES,
} from "../../constants/home";
import { HOME_SECTIONS } from "../../constants/navigation";
import { revealOrder } from "../../utils/motion";

const InspirationSection = () => (
  <section id={HOME_SECTIONS.gallery} className="container py-2xl">
    <div className="section-header" data-reveal="1">
      <div>
        <span className="hero-subtitle">— In real rooms</span>
        <h2 className="section-title">A little inspiration for every wall</h2>
        <p className="section-intro">
          Collected homes, quiet corners, and considered groupings from our
          framing community.
        </p>
      </div>
      <a href={`#${HOME_SECTIONS.reviews}`} className="text-link">
        Visit the journal
      </a>
    </div>

    <div className="inspiration-grid">
      <div className="inspiration-card" data-reveal="1">
        <img
          src={INSPIRATION_MAIN.image}
          srcSet={INSPIRATION_MAIN.srcSet}
          sizes={WIDE_CARD_IMAGE_SIZES}
          alt={INSPIRATION_MAIN.alt}
          loading="lazy"
          decoding="async"
          {...IMAGE_SIZES.wide}
        />
        <div className="inspiration-content">
          <div>
            <h3>{INSPIRATION_MAIN.title}</h3>
            <p>{INSPIRATION_MAIN.text}</p>
          </div>
          <button
            className="icon-btn icon-btn-dark"
            aria-label={`Open ${INSPIRATION_MAIN.title}`}
          >
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
      <div className="inspiration-side">
        {INSPIRATION_SIDE.map((item, i) => (
          <div
            key={item.title}
            className="inspiration-card"
            data-reveal={revealOrder(i + 1)}
          >
            <img
              src={item.image}
              alt={item.alt}
              loading="lazy"
              decoding="async"
              width={item.width}
              height={item.height}
            />
            <div className="inspiration-content">
              <div>
                <h3 className="inspiration-title-sm">{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <button
                className="icon-btn icon-btn-dark icon-btn-sm"
                aria-label={`Open ${item.title}`}
              >
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default InspirationSection;
