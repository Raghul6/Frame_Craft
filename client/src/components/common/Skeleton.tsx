import type { SkeletonProps } from "../../types/components";

/** A shimmering placeholder shown in place of content that is still loading. */
const Skeleton = ({ shape }: SkeletonProps) => (
  <span className={`skeleton skeleton-${shape}`} aria-hidden />
);

export default Skeleton;
