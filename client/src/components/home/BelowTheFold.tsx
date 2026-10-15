import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";
import CategorySection from "./CategorySection";
import FaqSection from "./FaqSection";
import FrameYourOwnSection from "./FrameYourOwnSection";
import GiftSection from "./GiftSection";
import InspirationSection from "./InspirationSection";
import ProductsSection from "./ProductsSection";
import ReviewsSection from "./ReviewsSection";
import SiteFooter from "./SiteFooter";

/**
 * Everything under the hero, loaded as its own chunk so the first paint only needs
 * the hero. Once it renders, honour a `#section` in the URL (e.g. "/#gallery"
 * from the navbar), since that element didn't exist when the page first loaded.
 */
const BelowTheFold = () => {
  const { hash } = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  useRevealOnScroll(containerRef);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!hash || !container) return;
    // content-visibility uses estimated heights for sections not drawn yet, which
    // would make the jump land in the wrong place — lay out exactly, then scroll.
    container.classList.add("exact-layout");
    document
      .getElementById(decodeURIComponent(hash.slice(1)))
      ?.scrollIntoView();
  }, [hash]);

  return (
    <div className="below-fold" ref={containerRef}>
      <CategorySection />
      <ProductsSection />
      <FrameYourOwnSection />
      <InspirationSection />
      <ReviewsSection />
      <GiftSection />
      <FaqSection />
      <SiteFooter />
    </div>
  );
};

export default BelowTheFold;
