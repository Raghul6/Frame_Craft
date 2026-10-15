import { ArrowRight } from "lucide-react";
import {
  FRAME_YOUR_OWN,
  HALF_WIDTH_IMAGE_SIZES,
  IMAGE_SIZES,
} from "../../constants/home";
import { HOME_SECTIONS } from "../../constants/navigation";
import { revealOrder } from "../../utils/motion";
import { ICON_SIZE } from "../../constants/ui";

const FrameYourOwnSection = () => (
  <section
    id={HOME_SECTIONS.howItWorks}
    className="split-section split-bg-sand"
  >
    <div className="split-media">
      <img
        src={FRAME_YOUR_OWN.image}
        srcSet={FRAME_YOUR_OWN.srcSet}
        sizes={HALF_WIDTH_IMAGE_SIZES}
        alt={FRAME_YOUR_OWN.imageAlt}
        loading="lazy"
        decoding="async"
        {...IMAGE_SIZES.wide}
      />
    </div>
    <div className="split-content" data-reveal="1">
      <span className="hero-subtitle">— Frame your own</span>
      <h2 className="split-title">From camera roll to wall in minutes</h2>
      <p className="split-intro">
        Our preview tool makes the choices simple. We print, frame, and finish
        every detail by hand.
      </p>

      <div>
        {FRAME_YOUR_OWN.steps.map((step, i) => (
          <div
            key={step.title}
            className="step-item"
            data-reveal={revealOrder(i + 1)}
          >
            <div className="step-number">{i + 1}</div>
            <div className="step-text">
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary split-cta">
        Start Framing <ArrowRight size={ICON_SIZE.md} />
      </button>
    </div>
  </section>
);

export default FrameYourOwnSection;
