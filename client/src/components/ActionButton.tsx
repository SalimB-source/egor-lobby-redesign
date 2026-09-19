import { ArrowRight } from "lucide-react";

/**
 * The site's primary chamfered CTA button, shared by every page so the hero,
 * section headers and catalog pages all push the exact same affordance.
 */
export function ActionButton({
  children,
  onClick,
  variant = "primary",
  icon = true,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "dark";
  icon?: boolean;
}) {
  return (
    <button
      className={`action-button action-button--${variant}`}
      onClick={onClick}
    >
      {children}
      {icon && <ArrowRight size={15} />}
    </button>
  );
}
