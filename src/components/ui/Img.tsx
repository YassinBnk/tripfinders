import { cn } from "@/lib/cn";

interface ImgProps {
  /** Path without size suffix, e.g. `/images/crafts/tissage`. */
  src: string;
  alt: string;
  /** Rendered width hint, drives which file the browser downloads. */
  sizes?: string;
  className?: string;
  priority?: boolean;
}

/** Responsive WebP image (800 / 1600 px). Lazy by default; `priority` for the LCP image only. */
export function Img({ src, alt, sizes = "(min-width: 1024px) 50vw, 100vw", className, priority }: ImgProps) {
  return (
    <img
      src={`${src}-800.webp`}
      srcSet={`${src}-800.webp 800w, ${src}-1600.webp 1600w`}
      sizes={sizes}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
