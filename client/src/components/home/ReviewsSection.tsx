import { IMAGE_SIZES, REVIEW_SUMMARY, REVIEWS } from "../../constants/home";
import { HOME_SECTIONS } from "../../constants/navigation";
import { revealOrder } from "../../utils/motion";

const ReviewsSection = () => (
  <section id={HOME_SECTIONS.reviews} className="reviews-section py-2xl">
    <div className="container">
      <div className="section-header" data-reveal="1">
        <div>
          <span className="hero-subtitle">— On your walls</span>
          <h2 className="section-title">Frames with stories already inside</h2>
          <p className="section-intro">
            Notes from customers who made a little more room for the moments
            that matter.
          </p>
        </div>
        <div className="rating-summary">
          <div className="rating-score">{REVIEW_SUMMARY.score}</div>
          <div className="rating-count">{REVIEW_SUMMARY.count}</div>
        </div>
      </div>

      <div className="reviews-grid">
        {REVIEWS.map((review, i) => (
          <div
            key={review.name}
            className="review-card"
            data-reveal={revealOrder(i)}
          >
            <div className="stars">
              ★★★★★ <span className="verified-text">Verified purchase</span>
            </div>
            <p className="review-quote">{review.quote}</p>
            <div className="reviewer">
              <img
                src={review.avatar}
                alt={review.name}
                loading="lazy"
                decoding="async"
                {...IMAGE_SIZES.avatar}
              />
              <div className="reviewer-info">
                <h4>{review.name}</h4>
                <p>{review.product}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ReviewsSection;
