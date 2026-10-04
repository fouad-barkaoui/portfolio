import mark from '@/assets/brand/fb-mark.json';

/**
 * The FB monogram: joined F and B on an acid-lime tile, framed by
 * scan-target corner ticks that close in on hover (see .logo in index.css).
 */
export function Logo({ size = 34, className }: { size?: number; className?: string }): JSX.Element {
  return (
    <svg
      className={className ? `logo ${className}` : 'logo'}
      viewBox={`0 0 ${mark.viewBox} ${mark.viewBox}`}
      width={size}
      height={size}
      aria-hidden
      focusable="false"
    >
      <rect className="logo-tile" width={mark.viewBox} height={mark.viewBox} rx={mark.radius} />
      <path className="logo-ticks" d={mark.ticks} />
      <path className="logo-letters" d={mark.letters} />
    </svg>
  );
}
