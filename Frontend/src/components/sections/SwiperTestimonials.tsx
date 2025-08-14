"use client";

import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function SwiperTestimonials() {
  const testimonials = [
    {
      name: "Adebayo Johnson",
      role: "Podcast Host & Content Creator",
      content:
        "ToriType revolutionized my workflow. It perfectly captures my Lagos accent and even understands when I switch to Pidgin mid-conversation. The accuracy is incredible!",
      avatar: "adebayo",
      rating: 5,
      gradient: "from-[#0db2f3] to-blue-500",
    },
    {
      name: "Fatima Ibrahim",
      role: "Journalist, Premium Times",
      content:
        "As a journalist covering diverse communities, I need transcription that understands context. ToriType's cultural intelligence is unmatched—it gets the nuances that others miss.",
      avatar: "fatima",
      rating: 5,
      gradient: "from-blue-500 to-[#0db2f3]",
    },
    {
      name: "Chinedu Okafor",
      role: "YouTube Creator, 2M+ subscribers",
      content:
        "From interviews to vlogs, ToriType handles everything. The real-time transcription during live streams is a game-changer. My audience loves the instant captions!",
      avatar: "chinedu",
      rating: 5,
      gradient: "from-[#0db2f3] to-blue-600",
    },
    {
      name: "Amina Hassan",
      role: "Radio Host, Arewa FM",
      content:
        "Finally, an AI that understands Hausa-English code-switching! ToriType has transformed how I prepare show notes and transcripts. It's like having a multilingual assistant.",
      avatar: "amina",
      rating: 5,
      gradient: "from-blue-600 to-[#0db2f3]",
    },
    {
      name: "Kemi Adeleke",
      role: "Documentary Filmmaker",
      content:
        "Interviewing elders in rural communities, their stories are precious. ToriType captures every word, every pause, every emotion. It's preserving our heritage digitally.",
      avatar: "kemi",
      rating: 5,
      gradient: "from-[#0db2f3] to-blue-500",
    },
    {
      name: "Ibrahim Musa",
      role: "University Lecturer",
      content:
        "For academic research on Nigerian linguistics, ToriType is invaluable. It handles complex phonetic variations and regional dialects better than any other tool I've used.",
      avatar: "ibrahim",
      rating: 5,
      gradient: "from-blue-500 to-[#0db2f3]",
    },
    {
      name: "Blessing Okoro",
      role: "Corporate Trainer",
      content:
        "Training sessions with mixed Nigerian audiences require precision. ToriType captures every accent perfectly, making my training materials accessible to everyone.",
      avatar: "blessing",
      rating: 5,
      gradient: "from-[#0db2f3] to-blue-600",
    },
    {
      name: "Samuel Adebisi",
      role: "Tech Entrepreneur",
      content:
        "Building products for the Nigerian market means understanding local nuances. ToriType's API integration has been seamless and the accuracy is consistently above 98%.",
      avatar: "samuel",
      rating: 5,
      gradient: "from-blue-600 to-[#0db2f3]",
    },
  ];

  return (
    <>
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{
            nextEl: ".testimonial-next",
            prevEl: ".testimonial-prev",
          }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 28,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
          }}
          className="testimonials-swiper pb-16"
        >
          {testimonials.map((testimonial, i) => (
            <SwiperSlide key={i}>
              <div className="group h-full p-8 bg-white dark:bg-gray-800/50 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 hover:border-[#0db2f3]/30 transition-all duration-500 hover:scale-[1.02] backdrop-blur-sm">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="w-5 h-5 fill-[#0db2f3] text-[#0db2f3] group-hover:scale-110 transition-transform duration-300"
                      style={{ animationDelay: `${starIndex * 0.1}s` }}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed text-base group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Avatar & User Info */}
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={`https://tapback.co/api/avatar/${testimonial.avatar}.webp`}
                      alt={`${testimonial.name} avatar`}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full object-cover shadow-lg border-3 border-[#0db2f3]/30 group-hover:border-[#0db2f3]/60 transition-all duration-300"
                      unoptimized
                      onError={(e) => {
                        // Fallback to gradient avatar if image fails to load
                        const target = e.currentTarget as HTMLImageElement;
                        const fallback =
                          target.nextElementSibling as HTMLElement | null;
                        target.style.display = "none";
                        if (fallback) {
                          fallback.style.display = "flex";
                        }
                      }}
                    />
                    {/* Fallback gradient avatar */}
                    <div
                      className={`absolute inset-0 w-14 h-14 rounded-full bg-gradient-to-r ${testimonial.gradient} items-center justify-center text-white font-bold text-base border-3 border-[#0db2f3]/30 group-hover:border-[#0db2f3]/60 shadow-lg`}
                      style={{ display: "none" }}
                    >
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-base group-hover:text-[#0db2f3] transition-colors duration-300">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#0db2f3]/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows */}
        <button className="testimonial-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-20 w-14 h-14 rounded-full bg-white dark:bg-gray-800 border-2 border-[#0db2f3]/30 shadow-xl flex items-center justify-center hover:bg-[#0db2f3] hover:border-[#0db2f3] hover:scale-110 transition-all duration-300 group">
          <ChevronLeft className="w-6 h-6 text-[#0db2f3] group-hover:text-white transition-colors duration-300" />
        </button>

        <button className="testimonial-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-20 w-14 h-14 rounded-full bg-white dark:bg-gray-800 border-2 border-[#0db2f3]/30 shadow-xl flex items-center justify-center hover:bg-[#0db2f3] hover:border-[#0db2f3] hover:scale-110 transition-all duration-300 group">
          <ChevronRight className="w-6 h-6 text-[#0db2f3] group-hover:text-white transition-colors duration-300" />
        </button>
      </div>

      {/* Custom Pagination Styles */}
      <style jsx global>{`
        .testimonials-swiper .swiper-pagination {
          bottom: 0 !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: auto !important;
        }

        .testimonials-swiper .swiper-pagination-bullet {
          width: 12px !important;
          height: 12px !important;
          background: rgba(13, 178, 243, 0.3) !important;
          opacity: 1 !important;
          margin: 0 6px !important;
          transition: all 0.3s ease !important;
        }

        .testimonials-swiper .swiper-pagination-bullet-active {
          background: #0db2f3 !important;
          transform: scale(1.3) !important;
          width: 32px !important;
          border-radius: 12px !important;
        }

        .testimonials-swiper .swiper-pagination-bullet:hover {
          background: rgba(13, 178, 243, 0.6) !important;
          transform: scale(1.1) !important;
        }
      `}</style>
    </>
  );
}
