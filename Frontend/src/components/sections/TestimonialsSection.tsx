import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Adebayo Johnson",
      role: "Podcast Host & Content Creator",
      content: "ToriType revolutionized my workflow. It perfectly captures my Lagos accent and even understands when I switch to Pidgin mid-conversation. The accuracy is incredible!",
      avatar: "adebayo",
      rating: 5,
      gradient: "from-purple-500 to-blue-500"
    },
    {
      name: "Fatima Ibrahim",
      role: "Journalist, Premium Times",
      content: "As a journalist covering diverse communities, I need transcription that understands context. ToriType's cultural intelligence is unmatched—it gets the nuances that others miss.",
      avatar: "fatima",
      rating: 5,
      gradient: "from-blue-500 to-emerald-500"
    },
    {
      name: "Chinedu Okafor",
      role: "YouTube Creator, 2M+ subscribers",
      content: "From interviews to vlogs, ToriType handles everything. The real-time transcription during live streams is a game-changer. My audience loves the instant captions!",
      avatar: "chinedu",
      rating: 5,
      gradient: "from-emerald-500 to-purple-500"
    },
    {
      name: "Amina Hassan",
      role: "Radio Host, Arewa FM",
      content: "Finally, an AI that understands Hausa-English code-switching! ToriType has transformed how I prepare show notes and transcripts. It&apos;s like having a multilingual assistant.",
      avatar: "amina",
      rating: 5,
      gradient: "from-pink-500 to-purple-500"
    },
    {
      name: "Kemi Adeleke",
      role: "Documentary Filmmaker",
      content: "Interviewing elders in rural communities, their stories are precious. ToriType captures every word, every pause, every emotion. It&apos;s preserving our heritage digitally.",
      avatar: "kemi",
      rating: 5,
      gradient: "from-orange-500 to-pink-500"
    },
    {
      name: "Ibrahim Musa",
      role: "University Lecturer",
      content: "For academic research on Nigerian linguistics, ToriType is invaluable. It handles complex phonetic variations and regional dialects better than any other tool I've used.",
      avatar: "ibrahim",
      rating: 5,
      gradient: "from-teal-500 to-blue-500"
    },
    {
      name: "Blessing Okoro",
      role: "Corporate Trainer",
      content: "Training sessions with mixed Nigerian audiences require precision. ToriType captures every accent perfectly, making my training materials accessible to everyone.",
      avatar: "blessing",
      rating: 5,
      gradient: "from-green-500 to-teal-500"
    },
    {
      name: "Samuel Adebisi",
      role: "Tech Entrepreneur",
      content: "Building products for the Nigerian market means understanding local nuances. ToriType's API integration has been seamless and the accuracy is consistently above 98%.",
      avatar: "samuel",
      rating: 5,
      gradient: "from-indigo-500 to-purple-500"
    },
  ];

  return (
    <section id="testimonials" className="py-12 md:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Trusted by creators
            <span className="block text-purple-600 dark:text-purple-400">
              across Nigeria
            </span>
          </h2>
        </div>

        <div className="relative">
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
              bulletClass: "swiper-pagination-bullet !bg-muted-foreground/30",
              bulletActiveClass: "swiper-pagination-bullet-active !bg-primary",
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
                <div className="h-full p-6 md:p-8 bg-background/50 rounded-2xl border border-border/30 backdrop-blur-sm">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="relative w-10 h-10 md:w-12 md:h-12">
                      <Image
                        src={`https://tapback.co/api/avatar/${testimonial.avatar}.webp`}
                        alt={`${testimonial.name} avatar`}
                        width={48}
                        height={48}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-lg"
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
                        className={`absolute inset-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r ${testimonial.gradient} items-center justify-center text-white font-bold text-sm md:text-lg`}
                        style={{ display: "none" }}
                      >
                        {testimonial.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm md:text-base">
                        {testimonial.name}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="testimonial-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center">
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-foreground" />
          </button>
          <button className="testimonial-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center">
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
}
