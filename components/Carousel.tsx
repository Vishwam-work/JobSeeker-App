"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  buttonText?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Find your dream job now",
    subtitle: "Explore 5 lakh+ opportunities across top companies",
    image: "/images/banner1.png",
    buttonText: "Start Searching",
  },
  {
    id: 2,
    title: "Top startups are hiring",
    subtitle: "Get matched with companies that value your skills",
    image: "/images/banner2.png",
    buttonText: "View Openings",
  },
  {
    id: 3,
    title: "Grow your career faster",
    subtitle: "Join companies that invest in your growth and success",
    image: "/images/banner3.png",
    buttonText: "Join Now",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden rounded-2xl shadow-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={slides[current].image}
            alt={slides[current].title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white px-6">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold mb-3"
            >
              {slides[current].title}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-2xl max-w-2xl mb-6"
            >
              {slides[current].subtitle}
            </motion.p>
            {slides[current].buttonText && (
              <motion.button
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-full text-lg font-semibold transition-all"
              >
                {slides[current].buttonText}
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              current === idx ? "bg-white w-6" : "bg-white/50"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
