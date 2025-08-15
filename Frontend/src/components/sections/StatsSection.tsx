import { useRef } from "react";
import { Users } from "lucide-react";
import Image from "next/image";

export default function StatsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const avatarsRef = useRef<HTMLDivElement>(null);

  const userAvatars = [
    {
      name: "Adebayo",
      avatar: "adebayo",
      gradient: "from-[#0db2f3] to-blue-500",
    },
    {
      name: "Fatima",
      avatar: "fatima",
      gradient: "from-blue-500 to-[#0db2f3]",
    },
    {
      name: "Chinedu",
      avatar: "chinedu",
      gradient: "from-[#0db2f3] to-blue-600",
    },
    { name: "Amina", avatar: "amina", gradient: "from-blue-600 to-[#0db2f3]" },
  ];

  return (
    <section
      ref={containerRef}
      className="py-12 md:py-16 lg:py-24 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0e0f16] via-[#0e0f16]/95 to-[#0e0f16] dark:from-[#0e0f16] dark:via-[#0e0f16]/95 dark:to-[#0e0f16] light:from-white light:via-gray-50 light:to-white"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(13,178,243,0.1),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.1),transparent_70%)]"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          {/* Users Section - Centered */}
          <div ref={avatarsRef} className="text-center max-w-2xl">
            <div className="mb-6">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white dark:text-white light:text-gray-900 mb-3">
                Join{" "}
                <span className="bg-gradient-to-r from-[#0db2f3] to-blue-500 bg-clip-text text-transparent">
                  50K+
                </span>{" "}
                users
              </h3>
              <p className="text-base md:text-lg text-gray-300 dark:text-gray-300 light:text-gray-600">
                Trusted by creators across Nigeria
              </p>
            </div>

            {/* Avatar Stack */}
            <div className="flex justify-center items-center gap-2 mb-6">
              <div className="flex -space-x-3">
                {userAvatars.map((user, index) => (
                  <div
                    key={index}
                    className="user-avatar relative"
                    style={{ zIndex: userAvatars.length - index }}
                  >
                    <div className="relative w-12 h-12 md:w-14 md:h-14">
                      <Image
                        src={`https://tapback.co/api/avatar/${user.avatar}.webp`}
                        alt={`${user.name} avatar`}
                        width={56}
                        height={56}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-3 border-[#0e0f16] dark:border-[#0e0f16] light:border-white shadow-lg hover:scale-110 transition-transform duration-300"
                        unoptimized
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          const fallback =
                            target.nextElementSibling as HTMLElement | null;
                          target.style.display = "none";
                          if (fallback) {
                            fallback.style.display = "flex";
                          }
                        }}
                      />
                      <div
                        className={`absolute inset-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r ${user.gradient} items-center justify-center text-white font-bold text-sm border-3 border-[#0e0f16] dark:border-[#0e0f16] light:border-white shadow-lg`}
                        style={{ display: "none" }}
                      >
                        {user.name.charAt(0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-[#0db2f3]" />
                  <span className="text-sm font-medium text-gray-300 dark:text-gray-300 light:text-gray-600">
                    Growing daily
                  </span>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex justify-center items-center gap-6 text-sm text-gray-400 dark:text-gray-400 light:text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live now</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0db2f3] rounded-full"></div>
                <span>AI powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
