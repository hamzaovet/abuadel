"use client";

import React from "react";
import Link from "next/link";
import { Bike, CalendarClock, Lock, Monitor, Sparkles, Zap, ArrowLeft } from "lucide-react";
import PwaInstallButton from "@/components/PwaInstallButton";

export default function AbuAdelHomePage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0d070a] text-amber-50 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-amber-500 selection:text-black"
    >
      {/* Ambient Royal Crimson & Gold Glows */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-rose-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-500/15 blur-[140px]" />

      <div className="relative z-10 w-full max-w-4xl rounded-[2.5rem] border border-amber-500/25 bg-[#160c11]/95 backdrop-blur-xl p-6 sm:p-10 shadow-2xl space-y-7 text-center">
        {/* Brand Emblem */}
        <div className="space-y-3">
          <div className="w-24 h-24 mx-auto rounded-full p-1 bg-gradient-to-tr from-amber-400 via-amber-600 to-rose-700 shadow-2xl">
            <div className="w-full h-full rounded-full bg-[#14080e] overflow-hidden flex items-center justify-center p-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/abuadel-emblem.svg"
                alt="حلواني أبو عادل"
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-400/35 text-rose-200 text-[11px] font-black mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>أصل الحلويات الشرقية والغربية والتورت • حدائق القبة</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100">
              حلواني أبو عادل
            </h1>
            <p className="text-sm font-black text-rose-300 tracking-wider mt-1">
              Haliy Youmak — احنا الحلو اللى بيحلو ✨
            </p>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-right">
          {/* 1. Smart Hub & Payment */}
          <Link
            href="/hub"
            className="group rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-[#131f18] to-black/60 hover:border-emerald-400 p-4 flex flex-col justify-between gap-3 transition shadow-lg hover:shadow-emerald-500/15"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center group-hover:scale-105 transition font-black">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-emerald-200">الرابط الذكي والدفع</h2>
                <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:translate-x-[-2px] transition" />
              </div>
              <p className="text-[11px] text-emerald-100/70 mt-1 leading-relaxed">
                باركود QR، إنستاباي، فودافون كاش، محادثة واتساب، وصفحات السوشيال ميديا.
              </p>
            </div>
          </Link>

          {/* 2. Delivery & Takeaway */}
          <Link
            href="/order"
            className="group rounded-2xl border border-rose-500/35 bg-gradient-to-br from-rose-950/40 via-[#1f0e16] to-black/60 hover:border-rose-400 p-4 flex flex-col justify-between gap-3 transition shadow-lg hover:shadow-rose-500/15"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 text-white flex items-center justify-center group-hover:scale-105 transition">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-rose-200">دليفري وتيك أواي</h2>
                <ArrowLeft className="w-4 h-4 text-rose-400 group-hover:translate-x-[-2px] transition" />
              </div>
              <p className="text-[11px] text-rose-100/70 mt-1 leading-relaxed">
                اطلب الحلويات والجاتوهات توصيل سريع لباب البيت أو استلام فوري من المحل.
              </p>
            </div>
          </Link>

          {/* 3. Scheduled Sweet & Cake Pre-Order */}
          <Link
            href="/order?mode=preorder"
            className="group rounded-2xl border border-amber-500/35 bg-gradient-to-br from-amber-950/40 via-[#1f160e] to-black/60 hover:border-amber-400 p-4 flex flex-col justify-between gap-3 transition shadow-lg hover:shadow-amber-500/15"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center group-hover:scale-105 transition font-black">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-amber-200">حجز تورت بموعد</h2>
                <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:translate-x-[-2px] transition" />
              </div>
              <p className="text-[11px] text-amber-100/70 mt-1 leading-relaxed">
                احجز تورتتك أو مناسبتك وحدد موعد وتاريخ الاستلام أو التوصيل مسبقاً.
              </p>
            </div>
          </Link>

          {/* 4. Staff & Admin Portal */}
          <Link
            href="/login"
            className="group rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.06] via-[#140b10] to-black/60 hover:border-amber-400/60 p-4 flex flex-col justify-between gap-3 transition shadow-lg"
          >
            <div className="w-11 h-11 rounded-xl bg-white/10 text-amber-200 flex items-center justify-center group-hover:scale-105 transition">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-white">بوابة الإدارة والكاشير</h2>
                <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:translate-x-[-2px] transition" />
              </div>
              <p className="text-[11px] text-white/60 mt-1 leading-relaxed">
                نقطة البيع (POS)، الورديات، مخزن الحلويات، طلبيات المصنع، والتقارير.
              </p>
            </div>
          </Link>
        </div>

        {/* Windows Desktop Icon Install Bar */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
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
