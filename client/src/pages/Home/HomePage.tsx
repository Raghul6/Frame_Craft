import { lazy, Suspense } from "react";
import HeroSection from "../../components/home/HeroSection";
import ValueProps from "../../components/home/ValueProps";
import "./HomePage.css";

// Below-the-fold sections are a separate chunk: the hero paints without waiting for them.
const BelowTheFold = lazy(() => import("../../components/home/BelowTheFold"));

const HomePage = () => (
  <>
    <HeroSection />
    <ValueProps />
    <Suspense fallback={<div className="below-fold-placeholder" />}>
      <BelowTheFold />
    </Suspense>
  </>
);

export default HomePage;
