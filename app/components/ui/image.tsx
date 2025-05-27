/* 100 v0 code jajajajaj */

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
  placeholder?: "blur" | "skeleton" | "none";
  blurDataURL?: string;
  lazy?: boolean;
  aspectRatio?: "square" | "video" | "portrait" | "landscape" | number;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
  showLoadingState?: boolean;
  priority?: boolean;
}

export default function Image({
  src,
  alt = "Image",
  width,
  height,
  className,
  fallback = "/placeholder.svg?height=400&width=400",
  placeholder = "skeleton",
  blurDataURL,
  lazy = true,
  aspectRatio,
  objectFit = "cover",
  onLoad,
  onError,
  showLoadingState = true,
  priority = false,
  quality,
  ...props
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority, isInView]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Calculate aspect ratio styles
  const getAspectRatioStyles = () => {
    if (!aspectRatio) return {};

    const ratios = {
      square: "1 / 1",
      video: "16 / 9",
      portrait: "3 / 4",
      landscape: "4 / 3",
    };

    const ratio =
      typeof aspectRatio === "number" ? `${aspectRatio}` : ratios[aspectRatio];

    return {
      aspectRatio: ratio,
    };
  };

  // Generate srcset for responsive images
  const generateSrcSet = (baseSrc: string) => {
    if (baseSrc.includes("placeholder.svg")) {
      return undefined;
    }

    // This is a simplified version - in a real app, you'd have different image sizes
    const sizes = [480, 768, 1024, 1280, 1920];
    return sizes
      .map((size) => {
        // Assuming your image service supports size parameters
        const url = new URL(baseSrc, window.location.origin);
        url.searchParams.set("w", size.toString());
        if (quality) url.searchParams.set("q", quality.toString());
        return `${url.toString()} ${size}w`;
      })
      .join(", ");
  };

  const imageSrc = hasError ? fallback : src;
  const shouldShowImage = isInView && !isLoading && !hasError;
  const shouldShowFallback = isInView && hasError;
  const shouldShowPlaceholder = !isInView || (isLoading && showLoadingState);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "100%",
        ...getAspectRatioStyles(),
      }}
    >
      {/* Blur placeholder */}
      {placeholder === "blur" && blurDataURL && shouldShowPlaceholder && (
        <img
          src={blurDataURL || "/placeholder.svg"}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-sm filter"
          aria-hidden="true"
        />
      )}

      {/* Skeleton placeholder */}
      {placeholder === "skeleton" && shouldShowPlaceholder && (
        <Skeleton className="absolute inset-0 h-full w-full" />
      )}

      {/* Loading shimmer effect */}
      {shouldShowPlaceholder && placeholder !== "none" && (
        <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}

      {/* Main image */}
      {isInView && (
        <img
          ref={imgRef}
          src={imageSrc || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          srcSet={generateSrcSet(imageSrc)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading={lazy && !priority ? "lazy" : "eager"}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            shouldShowImage ? "opacity-100" : "opacity-0",
            "absolute inset-0 h-full w-full",
            objectFit === "cover" && "object-cover",
            objectFit === "contain" && "object-contain",
            objectFit === "fill" && "object-fill",
            objectFit === "none" && "object-none",
            objectFit === "scale-down" && "object-scale-down",
          )}
          {...props}
        />
      )}

      {/* Error state */}
      {shouldShowFallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Loading indicator for priority images */}
      {priority && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
}

// Additional utility component for image galleries
export function ImageGallery({
  images,
  className,
  itemClassName,
  ...props
}: {
  images: Array<{ src: string; alt?: string }>;
  className?: string;
  itemClassName?: string;
} & Omit<ImageProps, "src" | "alt">) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      {images.map((image, index) => (
        <Image
          key={index}
          src={image.src || "/placeholder.svg"}
          alt={image.alt}
          className={itemClassName}
          {...props}
        />
      ))}
    </div>
  );
}

// Utility component for avatar images
export function Avatar({
  src,
  alt,
  size = 40,
  className,
  fallbackText,
  ...props
}: {
  src?: string;
  alt?: string;
  size?: number;
  fallbackText?: string;
  className?: string;
} & Omit<ImageProps, "width" | "height" | "aspectRatio">) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-full bg-gray-100",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt || "Avatar"}
          width={size}
          height={size}
          aspectRatio="square"
          className="rounded-full"
          fallback={`/placeholder.svg?height=${size}&width=${size}`}
          {...props}
        />
      ) : (
        <span className="text-sm font-medium text-gray-500">
          {fallbackText || alt?.charAt(0)?.toUpperCase() || "?"}
        </span>
      )}
    </div>
  );
}
