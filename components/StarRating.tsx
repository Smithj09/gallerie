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
  return (
    <div className="flex gap-1">
      {[...Array(maxRating)].map((_, i) => {
        const value = i + 1;
        const filled = value <= rating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={e => {
              e.stopPropagation();
              onRate?.(value);
            }}
            className={`${interactive ? 'cursor-pointer' : ''} ${
              filled ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
