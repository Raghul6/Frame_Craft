import { Check, X } from "lucide-react";
import { useMemo } from "react";
import { PASSWORD_RULES, STRENGTH_BARS } from "../../constants/auth";
import type { PasswordStrengthMeterProps } from "../../types/components";
import { getPasswordStrength } from "../../utils/passwordStrength";

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const { level, label } = useMemo(
    () => getPasswordStrength(password),
    [password],
  );

  return (
    <div className="strength" aria-live="polite">
      <div className="strength-bars" data-level={level}>
        {STRENGTH_BARS.map((i) => (
          <span key={i} className={i <= level ? "filled" : ""} />
        ))}
      </div>
      {label && (
        <span className={`strength-label level-${level}`}>{label}</span>
      )}

      <ul className="strength-rules">
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <li key={rule.id} className={ok ? "ok" : ""}>
              {ok ? <Check size={12} /> : <X size={12} />} {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordStrengthMeter;
