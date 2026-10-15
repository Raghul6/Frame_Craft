import { ArrowRight } from "lucide-react";
import { IMAGE_SIZES, PRODUCTS } from "../../constants/home";
import { HOME_SECTIONS } from "../../constants/navigation";
import { revealOrder } from "../../utils/motion";
import { ICON_SIZE } from "../../constants/ui";

const ProductsSection = () => (
  <section id={HOME_SECTIONS.products} className="container py-2xl most-loved">
    <div className="section-header" data-reveal="1">
      <div>
        <span className="hero-subtitle">— Most Loved</span>
        <h2 className="section-title">The frames people come back for</h2>
        <p className="section-intro">
          Classic proportions, honest materials, and a finish that gets better
          with time.
        </p>
      </div>
      <button className="btn btn-secondary btn-compact">
        Shop all frames <ArrowRight size={ICON_SIZE.md} />
      </button>
    </div>

    <div className="product-grid">
      {PRODUCTS.map((item, i) => (
        <div
          className="product-card"
          key={item.title}
          data-reveal={revealOrder(i)}
        >
          <div className="product-image-wrap">
            {item.badge && <span className="badge">{item.badge}</span>}
            <img
              src={item.img}
              alt={item.title}
              className="product-image"
              loading="lazy"
              decoding="async"
              {...IMAGE_SIZES.product}
            />
          </div>
          <div className="product-info">
            <h3>{item.title}</h3>
            <span className="price">{item.price}</span>
          </div>
          <span className="product-desc">{item.desc}</span>
          <button type="button" className="btn btn-primary add-to-cart">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  </section>
);

export default ProductsSection;
