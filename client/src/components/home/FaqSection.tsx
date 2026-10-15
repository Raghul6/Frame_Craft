import { FAQS, WORKSHOP } from "../../constants/home";
import { revealOrder } from "../../utils/motion";

const FaqSection = () => (
  <section className="container py-2xl">
    <div className="faq-container">
      <div className="faq-header" data-reveal="1">
        <span className="hero-subtitle">— A few helpful details</span>
        <h2 className="faq-title">Questions, answered</h2>
        <p className="faq-intro">
          Everything you need to know before your photographs become part of the
          room.
        </p>
        <div className="faq-help">
          <span className="faq-help-text">
            Still deciding? Our framers are here.{" "}
          </span>
          <a href={WORKSHOP.phoneHref} className="faq-help-link">
            Chat with a framing expert
          </a>
        </div>
      </div>
      <div>
        {FAQS.map((faq, i) => (
          <div
            key={faq.question}
            className="faq-item"
            data-reveal={revealOrder(i)}
          >
            <div className="faq-question">
              {faq.question}{" "}
              <span className={faq.answer ? "" : "faq-toggle-closed"}>
                {faq.answer ? "−" : "+"}
              </span>
            </div>
            {faq.answer && <div className="faq-answer">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FaqSection;
