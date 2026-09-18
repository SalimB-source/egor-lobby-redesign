import type { SVGProps } from "react";

export interface RewardIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * Gift Cards: Sleek digital credit card outline with a tech chip and geometric slice.
 */
export function GiftCardIcon({
  size = 22,
  className = "",
  ...props
}: RewardIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Sleek digital credit card outline */}
      <rect x="2" y="5" width="20" height="14" rx="2" />
      {/* Magnetic / tech band */}
      <line x1="2" y1="10" x2="22" y2="10" />
      {/* EMV Microchip */}
      <rect x="5" y="13" width="4" height="3.5" rx="0.5" />
      <line x1="7" y1="13" x2="7" y2="16.5" />
      {/* Geometric slice / digital circuit accents */}
      <line x1="14" y1="13.5" x2="19" y2="13.5" />
      <line x1="16" y1="16" x2="19" y2="16" />
    </svg>
  );
}

/**
 * In-Game Coins: Sharp, geometric 3D crystal / diamond gemstone.
 */
export function InGameCoinIcon({
  size = 22,
  className = "",
  ...props
}: RewardIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Outer 3D crystal / gemstone perimeter */}
      <path d="M6 3.5h12l4 5.5-10 11.5-10-11.5L6 3.5z" />
      {/* Girdle facet line */}
      <path d="M2 9h20" />
      {/* 3D central kite & pavilion facet lines */}
      <path d="M12 3.5L7.5 9 12 20.5 16.5 9 12 3.5z" />
      {/* Upper facet connectors */}
      <path d="M6 3.5l1.5 5.5" />
      <path d="M18 3.5l-1.5 5.5" />
    </svg>
  );
}

/**
 * Game Keys: Futuristic gaming key merged with a controller outline.
 */
export function GameKeyIcon({
  size = 22,
  className = "",
  ...props
}: RewardIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Futuristic gamepad controller bow on top */}
      <rect x="3" y="3.5" width="18" height="9" rx="3" />
      {/* Controller D-Pad cross */}
      <line x1="6.5" y1="8" x2="9.5" y2="8" />
      <line x1="8" y1="6.5" x2="8" y2="9.5" />
      {/* Controller action buttons */}
      <circle cx="15" cy="7" r="0.75" fill="currentColor" />
      <circle cx="17" cy="9" r="0.75" fill="currentColor" />
      {/* Key blade shaft descending from center */}
      <path d="M10.5 12.5v7.5a1.5 1.5 0 0 0 1.5 1.5h0a1.5 1.5 0 0 0 1.5-1.5V12.5" />
      {/* Futuristic key bit teeth */}
      <path d="M13.5 15h2.5v1.5h-2.5" />
      <path d="M13.5 18h2v1.5h-2" />
    </svg>
  );
}

/**
 * Event Passes: Modern VIP badge/pass hanging from a subtle lanyard loop.
 */
export function EventPassIcon({
  size = 22,
  className = "",
  ...props
}: RewardIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Subtle lanyard strap */}
      <path d="M7 2.5L12 7l5-4.5" />
      {/* Lanyard clip */}
      <rect x="10" y="7" width="4" height="2" rx="0.5" />
      {/* Modern VIP badge / pass body */}
      <rect x="4.5" y="9" width="15" height="13" rx="2" />
      {/* Lanyard punch-hole slot */}
      <line x1="10.5" y1="11.5" x2="13.5" y2="11.5" />
      {/* VIP Avatar / badge circle */}
      <circle cx="8.5" cy="15.5" r="1.5" />
      {/* VIP pass metadata lines */}
      <line x1="12" y1="14.5" x2="16.5" y2="14.5" />
      <line x1="12" y1="16.5" x2="15" y2="16.5" />
      {/* Bottom accent line */}
      <line x1="7.5" y1="19.5" x2="16.5" y2="19.5" />
    </svg>
  );
}

/**
 * Season Rewards: Modern, sharp angular esports trophy.
 */
export function SeasonRewardIcon({
  size = 22,
  className = "",
  ...props
}: RewardIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Angular esports trophy cup body */}
      <path d="M5 3.5h14l-2 7-5 4-5-4-2-7z" />
      {/* Center sharp angular facet spine */}
      <line x1="12" y1="3.5" x2="12" y2="14.5" />
      {/* Angular faceted lines */}
      <path d="M7 10.5L12 14.5l5-4" />
      {/* Sharp esports geometric handles */}
      <path d="M5 4.5H2l1.5 4.5 3.5 1.5" />
      <path d="M19 4.5h3l-1.5 4.5-3.5 1.5" />
      {/* Trophy stem */}
      <line x1="12" y1="14.5" x2="12" y2="18" />
      {/* Tiered angular esports base pedestal */}
      <path d="M8 18h8" />
      <path d="M5.5 21.5h13" />
      <line x1="8" y1="18" x2="6.5" y2="21.5" />
      <line x1="16" y1="18" x2="17.5" y2="21.5" />
    </svg>
  );
}

/**
 * Top-Ups: Digital wallet outline paired with a sharp, clean arrow pointing upward.
 */
export function TopUpIcon({
  size = 22,
  className = "",
  ...props
}: RewardIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Digital wallet outline */}
      <rect x="2" y="7.5" width="15" height="13.5" rx="2" />
      {/* Top card slot / insert inside wallet */}
      <path d="M5 7.5V5.5a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14 5.5v2" />
      {/* Wallet flap & clasp */}
      <path d="M11 12h5a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1h-5v-4.5z" />
      <circle cx="14.5" cy="14.25" r="0.6" fill="currentColor" />
      {/* Sharp clean arrow pointing upward (top-up) */}
      <line x1="20" y1="10" x2="20" y2="2.5" />
      <path d="M16.5 6L20 2.5 23.5 6" />
    </svg>
  );
}
