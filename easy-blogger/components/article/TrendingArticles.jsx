// components/article/TrendingArticles.jsx
"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import ArticleCard from './ArticleCard';
import { useTrendingArticles } from '../../hooks/feeds/useTrendingArticles';
import { useSavedList } from '../../hooks/feeds/useSavedArticles';

// Number of cards visible at once
const CARDS_PER_VIEW = 2;

export default function TrendingArticles() {

  const { trending, isTrendingLoading } = useTrendingArticles();
  const { savedList } = useSavedList();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (isTrendingLoading && trending.length === 0) {
    return (
      <div className="flex w-full items-center justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-[#1ABC9C]" />
      </div>
    );
  }

  const canPrev = currentIndex > 0;
  // Stop when the last CARDS_PER_VIEW cards are showing
  const canNext = currentIndex < trending.length - CARDS_PER_VIEW;

  return (
    <div className="relative px-6">
      {/* Prev button */}
      {canPrev && (
        <button
          onClick={() => setCurrentIndex((i) => i - 1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1abc9c] hover:scale-110 transition-all"
          aria-label="Previous article"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Next button */}
      {canNext && (
        <button
          onClick={() => setCurrentIndex((i) => i + 1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1abc9c] hover:scale-110 transition-all"
          aria-label="Next article"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Slider track — gap-5 = 20px, so each card is calc(50% - 10px) */}
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex gap-5 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(calc(-${currentIndex} * (50% + 10px)))` }}
        >
          {trending.map((article) => (
            // Note: Added 'h-fit' to ensure the white border hugs the card tightly
            <div
              key={article.id}
              className="min-w-[calc(50%-10px)] max-w-[calc(50%-10px)] flex-shrink-0 px-4 border-2 rounded-2xl border-[#e5e7eb] bg-white h-fit"
            >
              <ArticleCard
                article={article}
                savedArticles={savedList}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      {trending.length > CARDS_PER_VIEW && (
        <div className="flex justify-center gap-2 mt-3">
          {trending.slice(0, trending.length - CARDS_PER_VIEW + 1).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to position ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentIndex ? 'bg-[#1abc9c]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
