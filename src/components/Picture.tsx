/** Renders a vite-imagetools picture with AVIF/WebP sources and a sized fallback. */
export function Picture({
  pic,
  alt,
  sizes,
  className,
  imgClassName,
  eager = false,
}: {
  pic: ImagetoolsPicture;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}): JSX.Element {
  const order = ['avif', 'webp'];
  const entries = Object.entries(pic.sources).sort(([a], [b]) => order.indexOf(a) - order.indexOf(b));
  return (
    <picture className={className}>
      {entries.map(([format, srcset]) => (
        <source key={format} type={`image/${format}`} srcSet={srcset} sizes={sizes} />
      ))}
      <img
        src={pic.img.src}
        width={pic.img.w}
        height={pic.img.h}
        alt={alt}
        className={imgClassName}
        loading={eager ? 'eager' : 'lazy'}
        decoding={eager ? 'sync' : 'async'}
        {...(eager ? { fetchpriority: 'high' } : {})}
      />
    </picture>
  );
}
