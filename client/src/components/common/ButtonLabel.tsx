import { Loader2 } from "lucide-react";
import type { ButtonLabelProps } from "../../types/components";
import { ICON_SIZE } from "../../constants/ui";

/** Button text that swaps to a spinning icon + "…ing" text while the action runs. */
const ButtonLabel = ({ loading, label, loadingLabel }: ButtonLabelProps) =>
  loading ? (
    <>
      <Loader2 size={ICON_SIZE.sm} className="spin" aria-hidden />
      {loadingLabel}
    </>
  ) : (
    <>{label}</>
  );

export default ButtonLabel;
