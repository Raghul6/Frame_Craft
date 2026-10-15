import { ArrowRight } from "lucide-react";
import {
  GIFT,
  HALF_WIDTH_IMAGE_SIZES,
  IMAGE_SIZES,
} from "../../constants/home";

const GiftSection = () => (
  <section className="split-section split-bg-taupe">
    <div className="split-media">
      <img
        src={GIFT.image}
        srcSet={GIFT.srcSet}
        sizes={HALF_WIDTH_IMAGE_SIZES}
        alt={GIFT.imageAlt}
        loading="lazy"
        decoding="async"
        {...IMAGE_SIZES.wide}
      />
    </div>
    <div className="split-content gift-content" data-reveal="1">
      <span className="hero-subtitle gift-eyebrow">
        — A gift that keeps the moment
      </span>
      <h2 className="split-title split-title-lg">
        Personal, lasting, and already wrapped.
      </h2>
      <p className="gift-intro">
        Choose a photograph now, or let them decide with a digital gift card.
        Every frame includes a handwritten note and complimentary signature
        wrapping through December 18.
      </p>
      <div className="split-buttons">
        <button className="btn btn-primary btn-ink">
          Create a Gift Frame <ArrowRight size={16} />
        </button>
        <button className="btn btn-secondary btn-ink-outline">
          Send a Gift Card <ArrowRight size={16} />
        </button>
      </div>
      <p className="gift-note">
        Order by Dec 18 for complimentary U.S. holiday delivery.
      </p>
    </div>
  </section>
);

export default GiftSection;
