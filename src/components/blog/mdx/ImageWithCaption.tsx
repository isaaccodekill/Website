import Image from "next/image";

interface ImageWithCaptionProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function ImageWithCaption({
  src,
  alt,
  caption,
  width = 800,
  height = 450,
  priority = false,
}: ImageWithCaptionProps) {
  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-md border border-border">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center font-mono text-xs text-text-tertiary italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
