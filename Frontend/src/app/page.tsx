"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useGsap } from "../hooks/useGsap";
import ScrollReveal from "../components/ScrollReveal";
import { Mic, Zap, Globe, Users, Star, ArrowRight, Play, Headphones, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function LandingPage() {
  const { gsap, ScrollTrigger } = useGsap();

  // Parallax and hero animations
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current || !gsap || !ScrollTrigger) return;
    
    const ctx = gsap.context(() => {
      // Floating animation for cards
      gsap.to(".float-card", {
        y: -10,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.2
      });

      // Glow effect animation
      gsap.to(".hero-glow", {
        scale: 1.1,
        opacity: 0.8,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });

      // Simple reveal animations without locomotive dependencies
      gsap.from(".reveal", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".reveal",
          start: "top 80%",
        }
      });
    }, heroRef);
    
    return () => ctx.revert();
  }, [gsap, ScrollTrigger]);

  return (
    <div className="min-h-screen text-foreground bg-background transition-colors duration-500">
      
      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="pt-20 lg:pt-32 pb-16 lg:pb-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Content */}
            <div className="text-center lg:text-left">
              <ScrollReveal y={30} delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
                  This is not just
                  <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    technology —
                  </span>
                  it&apos;s evolution.
                </h1>
              </ScrollReveal>
              
              <ScrollReveal y={30} delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                  <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-semibold text-white shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-xl">
                    <Play className="w-5 h-5" />
                    Start for free
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-8 py-4 font-semibold text-foreground backdrop-blur-sm hover:bg-card transition-all duration-200">
                    Watch demo
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </ScrollReveal>

              {/* Feature tags */}
              <ScrollReveal y={20} delay={0.4}>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-sm">
                  {[
                    { icon: Mic, text: "Real-time" },
                    { icon: Globe, text: "Nigerian accents" },
                    { icon: Zap, text: "99% accuracy" },
                  ].map((tag, i) => (
                    <div key={i} className="inline-flex items-center gap-2 px-4 py-2 text-muted-foreground">
                      <tag.icon className="w-4 h-4" />
                      {tag.text}
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* Right: Hero visual */}
            <div className="relative text-center">
              {/* Main Visual - No Container */}
              <div className="relative mb-12">
                <div className="absolute -inset-8 bg-gradient-to-tr from-purple-600/20 via-blue-600/20 to-emerald-600/20 blur-3xl parallax-down hero-glow" />
                <div className="relative float-card">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur-2xl opacity-30 animate-pulse"></div>
                      <Image 
                        src="/visual.png" 
                        alt="ToriType AI Voice Recognition Interface"
                        width={320}
                        height={320}
                        className="w-80 h-80 object-contain relative z-10 drop-shadow-2xl"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Details - Under the Image */}
              <div className="space-y-6">
                <ScrollReveal y={20} delay={0.5}>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-4 mb-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-ping opacity-20"></div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-lg">Real-time Processing</h4>
                        <p className="text-sm text-muted-foreground">Instant transcription</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal y={20} delay={0.6}>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-4 mb-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full animate-ping opacity-20"></div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-lg">Nigerian Accents</h4>
                        <p className="text-sm text-muted-foreground">Cultural intelligence</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal y={20} delay={0.7}>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-4 mb-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-ping opacity-20"></div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-lg">Pidgin Support</h4>
                        <p className="text-sm text-muted-foreground">Native understanding</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal y={20} delay={0.8}>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full animate-ping opacity-20"></div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-lg">99% Accuracy</h4>
                        <p className="text-sm text-muted-foreground">Studio-grade quality</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
  <section className="py-16 lg:py-24 bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { number: "50K+", label: "Active users", sublabel: "Growing daily" },
              { number: "99.2%", label: "Accuracy rate", sublabel: "Nigerian English" },
              { number: "200+", label: "Languages", sublabel: "& dialects" },
              { number: "10M+", label: "Hours processed", sublabel: "This month" },
            ].map((stat, i) => (
              <ScrollReveal key={i} y={20} delay={i * 0.1}>
                <div className="text-center p-6 lg:p-8">
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="font-semibold text-foreground text-sm lg:text-base">{stat.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.sublabel}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <ScrollReveal>
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
                Built for Nigerian voices,
                <span className="block text-purple-600 dark:text-purple-400">powered by AI</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal y={20} delay={0.1}>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
                We understand the unique linguistic patterns, cultural context, and speech nuances that make Nigerian communication special. 
                Our AI doesn&apos;t just hear words—it understands meaning.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <ScrollReveal x={-30}>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Cultural Intelligence</h3>
                    <p className="text-muted-foreground">Trained on diverse Nigerian speech patterns from Lagos to Kano, understanding regional variations and cultural context.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Pidgin Mastery</h3>
                    <p className="text-muted-foreground">First-class support for Nigerian Pidgin with deep understanding of its grammar, expressions, and cultural significance.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-purple-500 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Real-time Processing</h3>
                    <p className="text-muted-foreground">Lightning-fast transcription with live editing capabilities. See your words appear as you speak with minimal latency.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal x={30}>
              <div className="relative">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm font-medium">Live transcription active</span>
                  </div>
                  <div className="space-y-3 text-muted-foreground">
                    <p className="border-l-4 border-purple-500 pl-4">&ldquo;Wetin dey happen for this Lagos traffic?&rdquo;</p>
                    <p className="border-l-4 border-blue-500 pl-4">&ldquo;The meeting go start by 3 o&apos;clock.&rdquo;</p>
                    <p className="border-l-4 border-emerald-500 pl-4">&ldquo;Make we discuss the project details.&rdquo;</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Headphones className="w-4 h-4" />
                    <span>Accuracy: 99.2% • Response: 50ms</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features Section */}
  <section id="features" className="py-16 lg:py-24 bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <ScrollReveal>
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
                Everything you need for
                <span className="block text-purple-600 dark:text-purple-400">voice transformation</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal y={20} delay={0.1}>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
                From podcasters to journalists, content creators to businesses—our platform scales with your needs.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Mic,
                title: "Studio-Quality Recording",
                description: "Crystal clear audio capture with noise cancellation and automatic gain control for professional results.",
                gradient: "from-purple-500 to-blue-500"
              },
              {
                icon: Zap,
                title: "Lightning-Fast Processing",
                description: "Real-time transcription with industry-leading speed. Process hours of content in minutes, not hours.",
                gradient: "from-blue-500 to-emerald-500"
              },
              {
                icon: Globe,
                title: "Multi-Dialect Support",
                description: "Comprehensive coverage of Nigerian English variants, Pidgin, and major local languages with cultural context.",
                gradient: "from-emerald-500 to-purple-500"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Share projects, collaborate in real-time, and manage team access with enterprise-grade security.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: MessageSquare,
                title: "Smart Editing",
                description: "AI-powered editing suggestions, automatic punctuation, and intelligent formatting for polished output.",
                gradient: "from-pink-500 to-blue-500"
              },
              {
                icon: ArrowRight,
                title: "Export Anywhere",
                description: "Multiple format support including SRT, VTT, Word, PDF, and direct integration with popular platforms.",
                gradient: "from-blue-500 to-emerald-500"
              },
            ].map((feature, i) => (
              <ScrollReveal key={i} y={30} delay={i * 0.1}>
                <div className="group p-8 transition-all duration-300 hover:scale-105">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <ScrollReveal>
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
                Trusted by creators
                <span className="block text-purple-600 dark:text-purple-400">across Nigeria</span>
              </h2>
            </ScrollReveal>
          </div>

          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={32}
              slidesPerView={1}
              navigation={{
                nextEl: '.testimonial-next',
                prevEl: '.testimonial-prev',
              }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet !bg-muted-foreground/30',
                bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary',
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="testimonials-swiper"
            >
              {[
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
              ].map((testimonial, i) => (
                <SwiperSlide key={i}>
                  <ScrollReveal y={30} delay={0.1}>
                    <div className="h-full p-8">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-6 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12">
                          <Image 
                            src={`https://tapback.co/api/avatar/${testimonial.avatar}.webp`}
                            alt={`${testimonial.name} avatar`}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                            unoptimized
                            onError={(e) => {
                              // Fallback to gradient avatar if image fails to load
                              const target = e.currentTarget as HTMLImageElement;
                              const fallback = target.nextElementSibling as HTMLElement | null;
                              target.style.display = 'none';
                              if (fallback) {
                                fallback.style.display = 'flex';
                              }
                            }}
                          />
                          <div 
                            className={`absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-r ${testimonial.gradient} items-center justify-center text-white font-bold text-lg`}
                            style={{ display: 'none' }}
                          >
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button className="testimonial-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-accent transition-colors">
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <button className="testimonial-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-accent transition-colors">
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-emerald-600/10 p-8 lg:p-16 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-emerald-600/5 blur-3xl"></div>
              <div className="relative">
                <h3 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
                  Ready to transform your voice?
                </h3>
                <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of Nigerians using ToriType for accurate, culturally-aware transcription. Start your free trial today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-semibold text-white shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-xl">
                    <Play className="w-5 h-5" />
                    Start free trial
                  </button>
                  <button className="inline-flex items-center gap-2 px-8 py-4 font-semibold text-foreground transition-all duration-200">
                    See how it works
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
