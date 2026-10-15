export interface ValueProp {
  num: string;
  title: string;
  desc: string;
}

export interface CategoryItem {
  title: string;
  desc: string;
  image: string;
  alt: string;
}

export interface ProductItem {
  img: string;
  title: string;
  price: string;
  desc: string;
  badge?: string;
}

export interface StepItem {
  title: string;
  text: string;
}

export interface InspirationItem {
  image: string;
  /** Responsive `srcset`; only the large photo has one. */
  srcSet?: string;
  /** Intrinsic size (real photo proportions) to reserve space before it loads. */
  width?: number;
  height?: number;
  alt: string;
  title: string;
  text: string;
}

export interface ReviewItem {
  quote: string;
  name: string;
  product: string;
  avatar: string;
}

export interface FaqItem {
  question: string;
  answer?: string;
}

export interface FooterColumn {
  title: string;
  links: string[];
}

export interface StoreNavLink {
  label: string;
  href: string;
}
