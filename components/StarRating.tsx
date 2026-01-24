import React from 'react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRate?: (rating: number) => void;
  interactive?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  onRate,
  interactive = false
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  return (
    <div className="flex gap-1.5">
      {[...Array(maxRating)].map((_, i) => {
        const value = i + 1;
        const displayRating = hoverRating !== null ? hoverRating : rating;
        const filled = value <= displayRating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHoverRating(value)}
            onMouseLeave={() => setHoverRating(null)}
            onClick={e => {
              e.stopPropagation();
              onRate?.(value);
            }}
            className={`transition-all ${
              interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'
            } ${filled ? 'text-yellow-500 drop-shadow-lg' : 'text-slate-300'}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
