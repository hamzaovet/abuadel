"use client";

import React from "react";
import Link from "next/link";
import { Cake, Bike, CalendarClock, Lock, Monitor, Sparkles } from "lucide-react";
import PwaInstallButton from "@/components/PwaInstallButton";

export default function AbuAdelHomePage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0d070a] text-amber-50 flex flex-col items-center justify-center p-5 relative overflow-hidden"
    >
      {/* Ambient Royal Crimson & Gold Glows */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-rose-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-500/15 blur-[140px]" />

      <div className="relative z-10 w-full max-w-4xl rounded-[2rem] border border-amber-500/25 bg-[#160c11]/95 backdrop-blur-xl p-7 sm:p-10 shadow-2xl space-y-8 text-center">
        {/* Brand Emblem */}
        <div className="space-y-3">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-rose-500 via-amber-500 to-amber-600 flex items-center justify-center text-black shadow-xl shadow-rose-500/25">
            <Cake className="w-10 h-10" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-400/35 text-rose-200 text-[11px] font-black mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>أصل الحلويات الشرقية والغربية والتورت • الخط الساخن 15992</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-wide text-amber-100">
              حلواني أبو عادل
            </h1>
            <p className="text-sm font-bold text-rose-300/85 tracking-widest uppercase mt-1">
              Abu Adel Patisserie
            </p>
          </div>
        </div>

        {/* 3 Main Action Cards (NO Dine-In Hall!) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
          {/* 1. Delivery & Takeaway */}
          <Link
            href="/order"
            className="group rounded-3xl border border-rose-500/35 bg-gradient-to-br from-rose-500/15 to-black/50 hover:border-rose-400 p-5 flex flex-col justify-between gap-4 transition shadow-lg hover:shadow-rose-500/15"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center group-hover:scale-110 transition">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-rose-100 flex items-center gap-1.5">
                <span>دليفري وتيك أواي</span>
                <span className="text-sm">🛵</span>
              </h2>
              <p className="text-xs text-rose-100/70 mt-1 leading-relaxed">
                اطلب الحلويات الشرقية والغربية والتورت توصيل فوري لحد باب البيت أو استلام سريع من المحل.
              </p>
            </div>
          </Link>

          {/* 2. Scheduled Sweet & Cake Pre-Order */}
          <Link
            href="/order?mode=preorder"
            className="group rounded-3xl border border-amber-500/35 bg-gradient-to-br from-amber-500/15 to-black/50 hover:border-amber-400 p-5 flex flex-col justify-between gap-4 transition shadow-lg hover:shadow-amber-500/15"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center group-hover:scale-110 transition">
              <CalendarClock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-100 flex items-center gap-1.5">
                <span>حجز حلويات بموعد مسبق</span>
                <span className="text-sm">🎂</span>
              </h2>
              <p className="text-xs text-amber-100/70 mt-1 leading-relaxed">
                احجز تورتة مناسبتك أو طلبية حلويات وحدد موعد الاستلام (من المحل أو توصيل دليفري في الميعاد).
              </p>
            </div>
          </Link>

          {/* 3. Staff & Admin Portal */}
          <Link
            href="/login"
            className="group rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.06] to-black/50 hover:border-amber-400/60 p-5 flex flex-col justify-between gap-4 transition shadow-lg"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-200 flex items-center justify-center group-hover:scale-110 transition">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">بوابة الكاشير والإدارة</h2>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                نقطة البيع (POS)، نظام الورديتين، مخزن الحلويات، طلبيات المصنع والموردين، والتقارير 80mm.
              </p>
            </div>
          </Link>
        </div>

        {/* Windows Desktop Icon Install Bar */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-amber-200/70">
            <Monitor className="w-4 h-4 text-amber-400 shrink-0" />
            <span>ثبّت أيقونة حلواني أبو عادل على سطح مكتب الويندوز لفتح الكاشير بضغطة واحدة</span>
          </div>
          <PwaInstallButton variant="button" />
        </div>

        {/* Orca Tech Developer Signature */}
        <div className="pt-3 border-t border-white/5 text-[11px] text-amber-200/55 flex flex-wrap items-center justify-center gap-2">
          <span>
            تطوير <strong className="text-amber-300">شركة أوركا للحلول البرمجية (Orca Tech) 🐬</strong>
          </span>
          <span>•</span>
          <a href="tel:01018671000" className="font-mono font-bold text-amber-200/80 hover:text-amber-300">
            📞 01018671000
          </a>
        </div>
      </div>
    </div>
  );
}
