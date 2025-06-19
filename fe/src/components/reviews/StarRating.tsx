// src/components/StarRating.tsx
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
    initialRating?: number;
    onChange?: (rating: number) => void;
    readOnly?: boolean;
    starSize?: number;
    className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
    initialRating = 0,
    onChange,
    readOnly = false,
    starSize = 24,
    className = ''
}) => {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);

    React.useEffect(() => {
        setRating(initialRating);
    }, [initialRating]);

    const handleClick = (index: number) => {
        if (!readOnly && onChange) {
            setRating(index);
            onChange(index);
        }
    };

    return (
        <div className={`flex ${className}`}>
            {[...Array(5)].map((_, index) => {
                const currentRating = index + 1;
                return (
                    <label key={index} className="cursor-pointer">
                        <input
                            type="radio"
                            name="rating"
                            value={currentRating}
                            onClick={() => handleClick(currentRating)}
                            className="hidden"
                            disabled={readOnly}
                        />
                        <FaStar
                            className={`transition-colors duration-200 ${
                                (hover || rating) >= currentRating ? 'text-yellow-400' : 'text-gray-300'
                            } ${readOnly ? '' : 'hover:text-yellow-500'}`}
                            size={starSize}
                            onMouseEnter={() => !readOnly && setHover(currentRating)}
                            onMouseLeave={() => !readOnly && setHover(0)}
                        />
                    </label>
                );
            })}
        </div>
    );
};

export default StarRating;