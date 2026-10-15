import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { PasswordInputProps } from "../../types/components";
import { ICON_SIZE } from "../../constants/ui";

const PasswordInput = (props: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-input">
      <input {...props} type={visible ? "text" : "password"} />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={ICON_SIZE.md} /> : <Eye size={ICON_SIZE.md} />}
      </button>
    </div>
  );
};

export default PasswordInput;
