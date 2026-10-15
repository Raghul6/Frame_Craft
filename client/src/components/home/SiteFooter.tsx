import { ArrowRight } from "lucide-react";
import {
  FOOTER_COLUMNS,
  FOOTER_LEGAL,
  FOOTER_SOCIAL,
  WORKSHOP,
} from "../../constants/home";
import { BRAND_NAME, ICON_SIZE, LOGO } from "../../constants/ui";

const SiteFooter = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-newsletter" data-reveal="1">
        <div className="footer-newsletter-text">
          <span className="footer-eyebrow">From the framing table</span>
          <h2 className="footer-newsletter-title">
            Ideas for living with the art and photographs you love.
          </h2>
          <p className="footer-muted">
            Join for room stories, framing advice, and first access to new
            finishes. Plus, 10% off your first frame.
          </p>
        </div>
        <div className="footer-newsletter-form">
          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Your email address"
              aria-label="Email address"
            />
            <button type="submit" aria-label="Subscribe">
              <ArrowRight size={ICON_SIZE.xl} />
            </button>
          </form>
          <p className="footer-fineprint">
            By subscribing, you agree to our privacy policy. Unsubscribe any
            time.
          </p>
        </div>
      </div>

      <div className="footer-grid" data-reveal="2">
        <div className="footer-col">
          <div className="footer-logo-wrap">
            <img
              src={LOGO.src}
              srcSet={LOGO.srcSet}
              width={LOGO.width}
              height={LOGO.height}
              alt={`${BRAND_NAME} Logo`}
              className="footer-logo"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="footer-tagline">
            Frames made slowly, for memories worth keeping close.
          </p>
          <div className="footer-social">
            {FOOTER_SOCIAL.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title} className="footer-col">
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((link) => (
                <li key={link}>{link}</li>
              ))}
            </ul>
          </div>
        ))}

        <div className="footer-col">
          <h4>Visit the workshop</h4>
          <p className="footer-address">
            {WORKSHOP.addressLines[0]}
            <br />
            {WORKSHOP.addressLines[1]}
          </p>
          <p className="footer-hours">
            {WORKSHOP.hoursLines[0]}
            <br />
            {WORKSHOP.hoursLines[1]}
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© 2026 {BRAND_NAME}. Made with care in Portland.</div>
        <div className="footer-legal">
          {FOOTER_LEGAL.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div>Carbon-neutral shipping on every order</div>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
