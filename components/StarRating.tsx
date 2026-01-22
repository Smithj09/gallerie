
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
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        
        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => onRate && onRate(starValue)}
            className={`${interactive ? 'cursor-pointer transform hover:scale-110 transition-transform' : 'cursor-default'} ${
              isFilled ? 'text-[#FFC600]' : 'text-slate-300'
            }`}
          >
            <i className={`fa-solid fa-star ${isFilled ? '' : 'fa-regular'}`}></i>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
