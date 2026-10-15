import Skeleton from "../common/Skeleton";

/** Placeholder for a detail page (title + two info panels + a table) while it loads. */
const DetailSkeleton = () => (
  <div role="status" aria-label="Loading">
    <div className="admin-page-header">
      <div className="skeleton-stack">
        <Skeleton shape="title" />
        <Skeleton shape="line-short" />
      </div>
    </div>
    <div className="detail-grid">
      {[0, 1].map((panel) => (
        <section key={panel} className="admin-panel skeleton-stack">
          <Skeleton shape="line-short" />
          <Skeleton shape="line" />
          <Skeleton shape="line" />
          <Skeleton shape="line-short" />
        </section>
      ))}
    </div>
    <section className="admin-panel skeleton-stack">
      <Skeleton shape="line-short" />
      <Skeleton shape="block" />
    </section>
  </div>
);

export default DetailSkeleton;
