"use client";

import Link from "next/link";
import React from "react";
import { ArrowUpRight } from "lucide-react";

interface MenuCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  backgroundColor?: string;
}

export function MenuCard({
  href,
  icon,
  title,
  description,
  backgroundColor = "bg-white",
}: MenuCardProps) {
  return (
    <Link href={href} className="group block focus:outline-none h-full">
      <div
        className={`
          ${backgroundColor} relative overflow-hidden
          rounded-[20px] h-full
          transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
          hover:shadow-2xl hover:-translate-y-0.5
        `}
      >
        {/* Subtle grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-7 sm:p-8 flex flex-col h-full">
          {/* Top row: icon + arrow */}
          <div className="flex items-start justify-between mb-auto">
            <div
              className={`
                w-12 h-12 rounded-xl
                bg-white/15 backdrop-blur-sm
                flex items-center justify-center
                transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                group-hover:scale-105
              `}
            >
              <div className="w-6 h-6 text-white/90">{icon}</div>
            </div>

            <div
              className={`
                w-8 h-8 rounded-full
                bg-white/10
                flex items-center justify-center
                transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                group-hover:bg-white/20
                group-hover:translate-x-0.5 group-hover:-translate-y-0.5
              `}
            >
              <ArrowUpRight className="w-4 h-4 text-white/70 transition-colors duration-300 group-hover:text-white" />
            </div>
          </div>

          {/* Bottom: text content */}
          <div className="mt-10 sm:mt-12">
            <h3
              className={`
                font-poppins! text-[22px] leading-tight
                font-semibold text-white tracking-[-0.01em]
                mb-2
              `}
            >
              {title}
            </h3>
            <p className="text-[13px] leading-relaxed text-white/60 font-normal max-w-[240px]">
              {description}
            </p>
          </div>
        </div>

        {/* Decorative corner glow */}
        <div
          className={`
            absolute -bottom-12 -right-12
            w-40 h-40 rounded-full
            bg-white/[0.04]
            blur-2xl
            pointer-events-none
            transition-opacity duration-700
            group-hover:opacity-100 opacity-60
          `}
        />
      </div>
    </Link>
  );
}
