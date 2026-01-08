import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CarouselContext = React.createContext(null);

function useCarousel() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error("useCarousel must be used within Carousel");
  return ctx;
}

const Carousel = React.forwardRef((props, ref) => {
  const { orientation = "horizontal", className, children, ...rest } = props;
  const [carouselRef, api] = useEmblaCarousel({ axis: orientation === "horizontal" ? "x" : "y" });

  return (
    <CarouselContext.Provider value={{ carouselRef, api, orientation }}>
      <div ref={ref} className={cn("relative", className)} {...rest}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
});
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef((props, ref) => {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div ref={ref} className={cn("flex", orientation === "vertical" && "flex-col")} {...props} />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

export { Carousel, CarouselContent };
