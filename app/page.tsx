"use client";

import React from "react";
import Link from "next/link";
import { Bike, CalendarClock, Lock, Monitor, Sparkles, Zap, ArrowLeft } from "lucide-react";
import PwaInstallButton from "@/components/PwaInstallButton";

export default function AbuAdelHomePage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0d070b] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-amber-500 selection:text-black font-sans"
    >
      {/* Ambient Royal Crimson & Gold Glows */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-rose-600/15 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-500/15 blur-[140px]" />

      <div className="relative z-10 w-full max-w-4xl rounded-[2.5rem] border-2 border-amber-500/35 bg-[#14080e]/95 backdrop-blur-xl p-6 sm:p-10 shadow-2xl space-y-7 text-center">
        {/* Brand Emblem */}
        <div className="space-y-3">
          <div className="w-24 h-24 mx-auto rounded-full p-1 bg-gradient-to-tr from-amber-400 via-amber-600 to-rose-700 shadow-2xl">
            <div className="w-full h-full rounded-full bg-[#12080f] overflow-hidden flex items-center justify-center p-2 border-2 border-amber-400/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/abuadel-emblem.svg"
                alt="حلواني أبو عادل"
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-200 text-xs font-black mb-2 shadow">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>أصل الحلويات الشرقية والغربية والتورت • حدائق القبة</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-wide text-amber-300 drop-shadow">
              حلواني أبو عادل
            </h1>
            <p className="text-sm sm:text-base font-black text-rose-300 tracking-wider mt-1">
              « احنا الحلو اللى بيحلو ✨ »
            </p>
          </div>
        </div>

        {/* Action Cards Grid (High Contrast) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-right">
          {/* 1. Smart Hub & Payment */}
          <Link
            href="/hub"
            className="group rounded-2xl border-2 border-emerald-500/60 bg-[#0e1c15] hover:border-emerald-400 p-4 flex flex-col justify-between gap-3 transition shadow-xl hover:shadow-emerald-500/25 active:scale-[0.99]"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-slate-950 flex items-center justify-center group-hover:scale-105 transition font-black shadow">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-white group-hover:text-emerald-200">الرابط الذكي والدفع</h2>
                <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:translate-x-[-2px] transition" />
              </div>
              <p className="text-xs text-emerald-200/90 font-bold mt-1 leading-relaxed">
                باركود QR، إنستاباي، فودافون كاش، محادثة واتساب، وصفحات السوشيال ميديا.
              </p>
            </div>
          </Link>

          {/* 2. Delivery & Takeaway */}
          <Link
            href="/order"
            className="group rounded-2xl border-2 border-rose-500/60 bg-[#1a0c14] hover:border-rose-400 p-4 flex flex-col justify-between gap-3 transition shadow-xl hover:shadow-rose-500/25 active:scale-[0.99]"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 text-white flex items-center justify-center group-hover:scale-105 transition shadow">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-white group-hover:text-rose-200">دليفري وتيك أواي</h2>
                <ArrowLeft className="w-4 h-4 text-rose-400 group-hover:translate-x-[-2px] transition" />
              </div>
              <p className="text-xs text-rose-200/90 font-bold mt-1 leading-relaxed">
                اطلب الحلويات والجاتوهات توصيل سريع لباب البيت أو استلام فوري من المحل.
              </p>
            </div>
          </Link>

          {/* 3. Scheduled Sweet & Cake Pre-Order */}
          <Link
            href="/order?mode=preorder"
            className="group rounded-2xl border-2 border-amber-500/60 bg-[#1b120c] hover:border-amber-400 p-4 flex flex-col justify-between gap-3 transition shadow-xl hover:shadow-amber-500/25 active:scale-[0.99]"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center group-hover:scale-105 transition font-black shadow">
              <CalendarClock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-white group-hover:text-amber-200">حجز تورت بموعد</h2>
                <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:translate-x-[-2px] transition" />
              </div>
              <p className="text-xs text-amber-200/90 font-bold mt-1 leading-relaxed">
                احجز تورتتك أو مناسبتك وحدد موعد وتاريخ الاستلام أو التوصيل مسبقاً.
              </p>
            </div>
          </Link>

          {/* 4. Staff & Admin Portal */}
          <Link
            href="/login"
            className="group rounded-2xl border-2 border-white/20 bg-[#160b12] hover:border-amber-400/60 p-4 flex flex-col justify-between gap-3 transition shadow-xl active:scale-[0.99]"
          >
            <div className="w-12 h-12 rounded-xl bg-white/15 text-amber-200 flex items-center justify-center group-hover:scale-105 transition shadow">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-white">بوابة الإدارة والكاشير</h2>
                <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:translate-x-[-2px] transition" />
              </div>
              <p className="text-xs text-slate-300 font-bold mt-1 leading-relaxed">
                نقطة البيع (POS)، الورديات، مخزن الحلويات، طلبيات المصنع، والتقارير.
              </p>
            </div>
          </Link>
        </div>

        {/* Windows Desktop Icon Install Bar */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-amber-200 font-bold">
            <Monitor className="w-4 h-4 text-amber-400 shrink-0" />
            <span>ثبّت أيقونة حلواني أبو عادل على سطح مكتب الويندوز لفتح الكاشير بضغطة واحدة</span>
          </div>
          <PwaInstallButton variant="button" />
        </div>

        {/* Orca Tech Developer Signature */}
        <div className="pt-3 border-t border-white/10 text-xs text-amber-100 font-bold flex flex-wrap items-center justify-center gap-2">
          <span>
            تطوير <strong className="text-amber-300 font-black">شركة أوركا للحلول البرمجية (Orca Tech) 🐬</strong>
          </span>
          <span>•</span>
          <a href="tel:01018671000" className="font-mono font-black text-amber-300 hover:text-white underline underline-offset-2">
            01018671000
          </a>
        </div>
      </div>
    </div>
  );
}
