import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function TestimonialsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      name: "Adebayo Johnson",
      role: "Podcast Host & Content Creator",
      content: "ToriType revolutionized my workflow. It perfectly captures my Lagos accent and even understands when I switch to Pidgin mid-conversation. The accuracy is incredible!",
      avatar: "adebayo",
      rating: 5,
      gradient: "from-[#0db2f3] to-blue-500"
    },
    {
      name: "Fatima Ibrahim",
      role: "Journalist, Premium Times",
      content: "As a journalist covering diverse communities, I need transcription that understands context. ToriType's cultural intelligence is unmatched—it gets the nuances that others miss.",
      avatar: "fatima",
      rating: 5,
      gradient: "from-blue-500 to-[#0db2f3]"
    },
    {
      name: "Chinedu Okafor",
      role: "YouTube Creator, 2M+ subscribers",
      content: "From interviews to vlogs, ToriType handles everything. The real-time transcription during live streams is a game-changer. My audience loves the instant captions!",
      avatar: "chinedu",
      rating: 5,
      gradient: "from-[#0db2f3] to-blue-600"
    },
    {
      name: "Amina Hassan",
      role: "Radio Host, Arewa FM",
      content: "Finally, an AI that understands Hausa-English code-switching! ToriType has transformed how I prepare show notes and transcripts. It&apos;s like having a multilingual assistant.",
      avatar: "amina",
      rating: 5,
      gradient: "from-blue-600 to-[#0db2f3]"
    },
    {
      name: "Kemi Adeleke",
      role: "Documentary Filmmaker",
      content: "Interviewing elders in rural communities, their stories are precious. ToriType captures every word, every pause, every emotion. It&apos;s preserving our heritage digitally.",
      avatar: "kemi",
      rating: 5,
      gradient: "from-[#0db2f3] to-blue-500"
    },
    {
      name: "Ibrahim Musa",
      role: "University Lecturer",
      content: "For academic research on Nigerian linguistics, ToriType is invaluable. It handles complex phonetic variations and regional dialects better than any other tool I've used.",
      avatar: "ibrahim",
      rating: 5,
      gradient: "from-blue-500 to-[#0db2f3]"
    },
    {
      name: "Blessing Okoro",
      role: "Corporate Trainer",
      content: "Training sessions with mixed Nigerian audiences require precision. ToriType captures every accent perfectly, making my training materials accessible to everyone.",
      avatar: "blessing",
      rating: 5,
      gradient: "from-[#0db2f3] to-blue-600"
    },
    {
      name: "Samuel Adebisi",
      role: "Tech Entrepreneur",
      content: "Building products for the Nigerian market means understanding local nuances. ToriType's API integration has been seamless and the accuracy is consistently above 98%.",
      avatar: "samuel",
      rating: 5,
      gradient: "from-blue-600 to-[#0db2f3]"
    },
  ];

  return (
    <section 
      ref={containerRef}
      id="testimonials" 
      className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-[#0e0f16] via-[#0e0f16]/95 to-[#0e0f16] dark:from-[#0e0f16] dark:via-[#0e0f16]/95 dark:to-[#0e0f16] light:from-white light:via-gray-50 light:to-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0db2f3]/5 via-transparent to-blue-500/5"></div>
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-[#0db2f3]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headingRef} className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white dark:text-white light:text-gray-900 mb-4 md:mb-6">
            Trusted by creators
            <span className="block bg-gradient-to-r from-[#0db2f3] to-blue-500 bg-clip-text text-transparent">
              across Nigeria
            </span>
          </h2>
        </div>

        <div ref={swiperRef} className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{
              nextEl: ".testimonial-next",
              prevEl: ".testimonial-prev",
            }}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet !bg-gray-400/30",
              bulletActiveClass: "swiper-pagination-bullet-active !bg-[#0db2f3]",
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
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
            className="testimonials-swiper"
          >
            {testimonials.map((testimonial, i) => (
              <SwiperSlide key={i}>
                <div className="group h-full p-6 md:p-8 bg-white/5 dark:bg-white/5 light:bg-white/80 rounded-2xl border border-[#0db2f3]/20 backdrop-blur-sm hover:bg-white/10 hover:border-[#0db2f3]/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-[#0db2f3]/20">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 md:w-5 md:h-5 fill-[#0db2f3] text-[#0db2f3] group-hover:scale-110 transition-transform duration-300"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <p className="text-sm md:text-base text-gray-300 dark:text-gray-300 light:text-gray-600 mb-6 leading-relaxed group-hover:text-gray-200 dark:group-hover:text-gray-200 light:group-hover:text-gray-700 transition-colors duration-300">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="relative w-10 h-10 md:w-12 md:h-12 group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={`https://tapback.co/api/avatar/${testimonial.avatar}.webp`}
                        alt={`${testimonial.name} avatar`}
                        width={48}
                        height={48}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-lg border-2 border-[#0db2f3]/30 group-hover:border-[#0db2f3]/60 transition-all duration-300"
                        unoptimized
                        onError={(e) => {
                          // Fallback to gradient avatar if image fails to load
                          const target = e.currentTarget as HTMLImageElement;
                          const fallback = target.nextElementSibling as HTMLElement | null;
                          target.style.display = "none";
                          if (fallback) {
                            fallback.style.display = "flex";
                          }
                        }}
                      />
                      <div
                        className={`absolute inset-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r ${testimonial.gradient} items-center justify-center text-white font-bold text-sm md:text-lg border-2 border-[#0db2f3]/30 group-hover:border-[#0db2f3]/60 transition-all duration-300`}
                        style={{ display: "none" }}
                      >
                        {testimonial.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-white dark:text-white light:text-gray-900 text-sm md:text-base group-hover:text-[#0db2f3] transition-colors duration-300">
                        {testimonial.name}
                      </div>
                      <div className="text-xs md:text-sm text-gray-300 dark:text-gray-300 light:text-gray-600 group-hover:text-gray-200 dark:group-hover:text-gray-200 light:group-hover:text-gray-700 transition-colors duration-300">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0db2f3]/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="testimonial-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 dark:bg-white/10 light:bg-white/80 border border-[#0db2f3]/30 shadow-lg flex items-center justify-center hover:bg-[#0db2f3]/20 hover:border-[#0db2f3]/50 transition-all duration-300 backdrop-blur-sm">
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-[#0db2f3]" />
          </button>
          <button className="testimonial-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 dark:bg-white/10 light:bg-white/80 border border-[#0db2f3]/30 shadow-lg flex items-center justify-center hover:bg-[#0db2f3]/20 hover:border-[#0db2f3]/50 transition-all duration-300 backdrop-blur-sm">
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-[#0db2f3]" />
          </button>
        </div>
      </div>
    </section>
  );
}
