import { Component as ComponentType } from "@/integrations/salesforce/types/page";

import { Region } from "@/components/commerce/experience/region";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface CarouselProps {
  component: ComponentType;
}

export function Carousel({ component }: CarouselProps) {
  const { regions, data } = component as any;
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!regions?.length) {
    return null;
  }

  const slidesRegion = regions.find((region) => region.id === "slides");
  const slides = slidesRegion?.components || [];

  const {
    xsCarouselSlidesToDisplay = 1,
    smCarouselSlidesToDisplay = 2,
    mdCarouselSlidesToDisplay = 3,
    xsCarouselControls = true,
    smCarouselControls = true,
    xsCarouselIndicators = false,
    smCarouselIndicators = false,
    mdCarouselIndicators = false,
    textHeadline,
  } = data || {};

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {textHeadline && (
        <h2 className="mb-6 text-center text-2xl font-bold">{textHeadline}</h2>
      )}

      <div className="relative">
        {/* Carousel Container */}
        <div className="overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * (100 / xsCarouselSlidesToDisplay)}%)`,
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={cn(
                  "flex-shrink-0 px-2",
                  `w-full sm:w-1/${smCarouselSlidesToDisplay} md:w-1/${mdCarouselSlidesToDisplay}`,
                )}
                style={{
                  width: `${100 / xsCarouselSlidesToDisplay}%`,
                }}
              >
                <Region
                  region={{ id: `slide-${index}`, components: [slide] }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        {(xsCarouselControls || smCarouselControls) && slides.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-2 -translate-y-1/2 transform bg-white/80 hover:bg-white"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-2 -translate-y-1/2 transform bg-white/80 hover:bg-white"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Indicators */}
        {(xsCarouselIndicators ||
          smCarouselIndicators ||
          mdCarouselIndicators) &&
          slides.length > 1 && (
            <div className="mt-4 flex justify-center space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    currentSlide === index ? "bg-primary" : "bg-gray-300",
                  )}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
