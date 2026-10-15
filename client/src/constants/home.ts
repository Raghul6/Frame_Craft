import type {
  CategoryItem,
  FaqItem,
  FooterColumn,
  InspirationItem,
  ProductItem,
  ReviewItem,
  StepItem,
  ValueProp,
} from "../types/home";

const unsplash = (id: string, width: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

/** Widths offered to the browser for full/half-width photos; it picks the smallest sharp one. */
const RESPONSIVE_WIDTHS = [480, 800, 1200, 1600] as const;

const unsplashSrcSet = (id: string) =>
  RESPONSIVE_WIDTHS.map((w) => `${unsplash(id, w)} ${w}w`).join(", ");

/** Photos that span half the page on desktop and the full width on phones/tablets. */
export const HALF_WIDTH_IMAGE_SIZES = "(max-width: 900px) 100vw, 50vw";
/** The large inspiration photo spans about two thirds of the 1200px container. */
export const WIDE_CARD_IMAGE_SIZES = "(max-width: 900px) 100vw, 800px";

export const HERO = {
  eyebrow: "— The Heirloom Edit",
  title: "A beautiful frame changes the way you see a memory.",
  description:
    "Thoughtfully made hardwood frames, archival mats, and gallery-quality printing—crafted one at a time for the photographs you never want to put away.",
  features: ["FSC® hardwood", "Archival quality", "Ready to hang"],
  image: unsplash("photo-1600210492486-724fe5c67fb0", 1200),
  srcSet: unsplashSrcSet("photo-1600210492486-724fe5c67fb0"),
  imageAlt: "Living room with framed art",
  captionLabel: "Shown in room",
  captionTitle: "The Hawthorne, Walnut",
} as const;

export const VALUE_PROPS: readonly ValueProp[] = [
  { num: "01", title: "Made to order", desc: "Finished by hand in 5-7 days" },
  {
    num: "02",
    title: "Framing made simple",
    desc: "Upload, crop, and preview online",
  },
  {
    num: "03",
    title: "Protected for decades",
    desc: "UV acrylic and acid-free materials",
  },
  {
    num: "04",
    title: "Happiness, guaranteed",
    desc: "30-day returns on standard sizes",
  },
];

export const CATEGORIES: readonly CategoryItem[] = [
  {
    title: "Natural wood",
    desc: "Oak, walnut & maple · from $68",
    image: unsplash("photo-1513519245088-0e12902e5a38", 600),
    alt: "Natural wood frame",
  },
  {
    title: "Slim metal",
    desc: "Brass, pewter & black · from $74",
    image: unsplash("photo-1544816155-12df9643f363", 600),
    alt: "Slim metal frame",
  },
  {
    title: "Gallery sets",
    desc: "Curated sets of 3-9 · from $198",
    image: unsplash("photo-1582582494705-f8ce0b0c24f0", 600),
    alt: "Gallery sets",
  },
];

export const PRODUCTS: readonly ProductItem[] = [
  {
    img: unsplash("photo-1579783902614-a3fb3927b6a5", 400),
    title: "The Alder",
    price: "$78",
    desc: "8 x 10 in · Archival mat included",
    badge: "Best Seller",
  },
  {
    img: unsplash("photo-1544816155-12df9643f363", 400),
    title: "The Rowan",
    price: "$72",
    desc: "8 x 10 in · Archival mat included",
  },
  {
    img: unsplash("photo-1582582494705-f8ce0b0c24f0", 400),
    title: "The Mercer",
    price: "$86",
    desc: "8 x 10 in · Archival mat included",
    badge: "New",
  },
  {
    img: unsplash("photo-1513519245088-0e12902e5a38", 400),
    title: "The Juniper",
    price: "$76",
    desc: "8 x 10 in · Archival mat included",
  },
];

export const FRAME_YOUR_OWN = {
  image: unsplash("photo-1541480601022-2308c0f02487", 800),
  srcSet: unsplashSrcSet("photo-1541480601022-2308c0f02487"),
  imageAlt: "Crafting frame",
  steps: [
    {
      title: "Choose your photograph",
      text: "Upload from your phone, Instagram, or computer. We check every file for print quality.",
    },
    {
      title: "Make it yours",
      text: "Select the frame, mat, size, and crop. See a true-to-scale preview before you order.",
    },
    {
      title: "We craft and deliver",
      text: "Your frame arrives assembled, protected, and ready to hang—with hardware included.",
    },
  ] satisfies StepItem[],
} as const;

export const INSPIRATION_MAIN: InspirationItem = {
  image: unsplash("photo-1600210492486-724fe5c67fb0", 800),
  srcSet: unsplashSrcSet("photo-1600210492486-724fe5c67fb0"),
  alt: "Living room",
  title: "The collected living room",
  text: "A balanced gallery wall in mixed oak and walnut",
};

export const INSPIRATION_SIDE: readonly InspirationItem[] = [
  {
    image: unsplash("photo-1544457070-4cd773b4d71e", 400),
    // Real photo proportions — the card height follows the image, so a wrong guess shifts the page.
    width: 400,
    height: 368,
    alt: "Bedside",
    title: "Above the bedside",
    text: "A quiet pair in maple",
  },
  {
    image: unsplash("photo-1618219908412-a29a1bb7b86e", 400),
    width: 400,
    height: 711,
    alt: "Small wall",
    title: "Small wall, big story",
    text: "Four everyday moments in brass",
  },
];

export const REVIEW_SUMMARY = {
  score: "4.9 / 5",
  count: "Based on 1,284 verified reviews",
} as const;

export const REVIEWS: readonly ReviewItem[] = [
  {
    quote:
      '"The walnut is even more beautiful in person. It made a phone photo of my parents feel like a family heirloom."',
    name: "Maya R.",
    product: "The Alder - Walnut",
    avatar: unsplash("photo-1438761681033-6461ffad8d80", 100),
  },
  {
    quote:
      '"The online preview was exact, the hanging guide was brilliant, and the whole set was up before dinner."',
    name: "Thomas L.",
    product: "Five-frame gallery set - Oak",
    avatar: unsplash("photo-1500648767791-00dcc994a43e", 100),
  },
  {
    quote:
      '"I send one for every wedding now. Personal, beautifully wrapped, and somehow it always arrives right on time."',
    name: "Nina S.",
    product: "Gift frame - Maple",
    avatar: unsplash("photo-1544005313-94ddf0286df2", 100),
  },
];

export const GIFT = {
  image: unsplash("photo-1511285560929-80b456fea0bc", 800),
  srcSet: unsplashSrcSet("photo-1511285560929-80b456fea0bc"),
  imageAlt: "Gift wrapping",
} as const;

export const FAQS: readonly FaqItem[] = [
  {
    question: "How do I know my photo will print well?",
    answer:
      "Upload it to our builder and we'll check resolution, crop, and color before production. If anything looks off, a real person from our print team will email you first.",
  },
  { question: "What comes with my frame?" },
  { question: "Can I frame original artwork?" },
  { question: "How long will my order take?" },
  { question: "Do you make custom sizes?" },
  { question: "What is your return policy?" },
];

export const FOOTER_SOCIAL = ["IG", "TW", "FB"] as const;

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    title: "Shop",
    links: [
      "All frames",
      "Gallery wall sets",
      "Custom framing",
      "Gift cards",
      "Wood sample card",
    ],
  },
  {
    title: "Learn",
    links: [
      "How it works",
      "Materials & care",
      "Hanging guides",
      "The journal",
      "FAQ",
    ],
  },
  {
    title: "About",
    links: [
      "Our workshop",
      "Sustainability",
      "Trade program",
      "Careers",
      "Contact",
    ],
  },
];

export const WORKSHOP = {
  addressLines: ["1824 N. Williams Ave.", "Portland, OR 97227"],
  hoursLines: ["Tue-Sat · 10am-5pm", "(503) 555-0148"],
  phoneHref: "tel:+15035550148",
} as const;

export const FOOTER_LEGAL = ["Privacy", "Terms", "Accessibility"] as const;

/** Intrinsic image sizes (match the Unsplash `w` and the CSS aspect ratios) — stops layout shift. */
export const IMAGE_SIZES = {
  category: { width: 600, height: 750 },
  product: { width: 400, height: 533 },
  avatar: { width: 40, height: 40 },
  wide: { width: 800, height: 600 },
} as const;
