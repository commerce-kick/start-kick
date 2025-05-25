
export default function Image({
  width,
  height,
  src,
  alt,
  className,
}: {
  src: string;
  alt?: string;
  height?: number;
  width?: number;
  className?: string;
}) {
  return (
    <img
      alt={alt || "Image"}
      height={height || 500}
      src={src} // use normal <img> attributes as props
      width={width || 500}
      className={className}
    />
  );
}
