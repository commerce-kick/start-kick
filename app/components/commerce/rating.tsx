import { Star } from "lucide-react";

export default function Rating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
    </div>
  );
}
