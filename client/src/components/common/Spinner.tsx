import type { SpinnerProps } from "../../types/components";

const Spinner = ({ full }: SpinnerProps) => {
  const spinner = (
    <span className="spinner" role="status" aria-label="Loading" />
  );
  return full ? <div className="spinner-full">{spinner}</div> : spinner;
};

export default Spinner;
