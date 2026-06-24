'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  company: string;
  position: string;
  review_en: string;
  review_ar: string;
  avatar: string;
}

interface TestimonialsProps {
  testimonials: TestimonialItem[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const t = useTranslations('Testimonials');
  const locale = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const touchStartX = useRef<number | null>(null);

  const resetAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      handleNext();
    }, 6000);
  };

  useEffect(() => {
    if (testimonials.length > 1) {
      resetAutoplay();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeIndex, testimonials]);

  if (testimonials.length === 0) return null;

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const swipeThreshold = 50;

    if (Math.abs(diffX) > swipeThreshold) {
      if (diffX > 0) {
        // Swipe left -> next in LTR, prev in RTL
        locale === 'ar' ? handlePrev() : handleNext();
      } else {
        // Swipe right -> prev in LTR, next in RTL
        locale === 'ar' ? handleNext() : handlePrev();
      }
    }
    touchStartX.current = null;
  };

  // Slider animation definitions
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.4, ease: 'easeIn' }
    })
  };

  return (
    <section className="relative w-full py-24 bg-neutral-950/40 border-y border-neutral-900 overflow-hidden" id="testimonials">
      <div className="max-w-4xl w-full mx-auto px-6 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-teal-400 uppercase block mb-3">
            {t('subtitle')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-100">
            {t('title')}
          </h2>
        </div>

        {/* Carousel Window */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative min-h-[320px] flex items-center justify-center"
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="glass-card rounded-3xl p-8 md:p-12 w-full text-start relative"
            >
              <Quote className="absolute top-6 end-6 w-12 h-12 text-teal-500/10 pointer-events-none" />

              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-start">
                {/* Avatar Image */}
                <div className="w-16 h-16 rounded-full overflow-hidden border border-neutral-800 bg-neutral-900 flex-shrink-0">
                  <img
                    src={testimonials[activeIndex].avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={testimonials[activeIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-neutral-300 text-base sm:text-lg leading-relaxed italic mb-6">
                    "{locale === 'ar' ? testimonials[activeIndex].review_ar : testimonials[activeIndex].review_en}"
                  </p>

                  <h3 className="font-bold text-neutral-100 text-lg">
                    {testimonials[activeIndex].name}
                  </h3>
                  <p className="text-xs text-teal-400 uppercase tracking-widest font-semibold mt-1">
                    {testimonials[activeIndex].position} @ {testimonials[activeIndex].company}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons and indicators */}
        <div className="flex items-center justify-between mt-8">
          {/* Slider Pagination Indicators */}
          <div className="flex gap-1.5">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > activeIndex ? 1 : -1);
                  setActiveIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? 'w-8 bg-teal-500' : 'w-2 bg-neutral-800 hover:bg-neutral-700'
                }`}
              />
            ))}
          </div>

          {/* Prev/Next arrows (flipped layout in RTL naturally due to flex direction LTR/RTL wrapper) */}
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-750 text-neutral-450 hover:text-neutral-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-750 text-neutral-450 hover:text-neutral-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
