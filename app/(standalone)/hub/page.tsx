"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bike,
  Store,
  CalendarClock,
  Zap,
  Smartphone,
  MessageCircle,
  Phone,
  MapPin,
  Lock,
  Copy,
  Check,
  X,
  Share2,
  QrCode,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import PwaInstallButton from "@/components/PwaInstallButton";

interface SettingsData {
  brandNameAr?: string;
  brandNameEn?: string;
  cafeAddress?: string;
  abuAdelPhone?: string;
  whatsapp?: string;
  instapayAccount?: string;
  vodafoneCashNumber?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
}

export default function AbuAdelSmartHubPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentTab, setPaymentTab] = useState<"VODAFONE" | "INSTAPAY">("VODAFONE");
  const [copiedVoda, setCopiedVoda] = useState(false);
  const [copiedInsta, setCopiedInsta] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  const storePhone = settings?.abuAdelPhone || "01146862114";
  const whatsappNum = (settings?.whatsapp || storePhone).replace(/\D/g, "");
  const vodaNum = settings?.vodafoneCashNumber || "01097280514";
  const instaNum = settings?.instapayAccount || "01097280514";
  const storeAddress = settings?.cafeAddress || "101 شارع زمزم خلف مسجد الشيخ غراب - حدائق القبة";

  // Pre-generate QR codes for Vodafone Cash and InstaPay
  const vodaQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&color=991b1b&bgcolor=ffffff&data=${encodeURIComponent(
    `tel:*9*7*${vodaNum}#`
  )}`;
  const instaQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&color=4c1d95&bgcolor=ffffff&data=${encodeURIComponent(
    instaNum
  )}`;

  const copyVodafone = () => {
    navigator.clipboard?.writeText(vodaNum).catch(() => {});
    setCopiedVoda(true);
    setTimeout(() => setCopiedVoda(false), 2000);
  };

  const copyInsta = () => {
    navigator.clipboard?.writeText(instaNum).catch(() => {});
    setCopiedInsta(true);
    setTimeout(() => setCopiedInsta(false), 2000);
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "حلواني أبو عادل — Haliy Youmak",
          text: "الرابط الذكي لحلواني أبو عادل: طلب دليفري، استلام، حجز تورتات، والدفع الإلكتروني",
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to copy URL
      }
    }
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `حلواني أبو عادل ${storeAddress}`
  )}`;

  const whatsappChatUrl = `https://wa.me/20${whatsappNum}?text=${encodeURIComponent(
    "أهلاً حلواني أبو عادل 🍰 أود الاستفسار / الطلب"
  )}`;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0e070c] text-amber-50 flex flex-col items-center justify-between p-4 sm:p-6 relative selection:bg-amber-500 selection:text-black overflow-x-hidden"
    >
      {/* Ambient Luxury Gradients */}
      <div className="pointer-events-none fixed -top-32 -right-32 w-96 h-96 rounded-full bg-rose-600/20 blur-[150px]" />
      <div className="pointer-events-none fixed -bottom-32 -left-32 w-96 h-96 rounded-full bg-amber-500/15 blur-[150px]" />

      <main className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center space-y-5 my-auto py-4">
        {/* Top Floating Action Bar (Share) */}
        <div className="w-full flex items-center justify-between px-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>الرابط الذكي الموحد</span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="py-1 px-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/90 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            title="مشاركة الرابط"
          >
            {shareSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">تم النسخ!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة</span>
              </>
            )}
          </button>
        </div>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Circular Gold Emblem */}
          <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 blur-xl opacity-60 group-hover:opacity-90 transition duration-500" />
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 bg-gradient-to-b from-amber-400 via-amber-600 to-rose-800 shadow-2xl">
              <div className="w-full h-full rounded-full bg-[#14080e] overflow-hidden flex items-center justify-center p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/abuadel-emblem.svg"
                  alt="حلواني أبو عادل"
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>
            </div>
          </div>

          {/* Titles */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
              حلواني أبو عادل
            </h1>
            <p className="text-xs sm:text-sm font-black text-rose-300 tracking-wider">
              Haliy Youmak — احنا الحلو اللى بيحلو ✨
            </p>
            <p className="text-[11px] text-amber-200/70 max-w-xs">
              أصل الحلويات الشرقية والغربية والتورت والجاتوهات الفاخرة
            </p>
          </div>

          {/* Location & Phone Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 text-[11px] text-amber-200/90 font-bold px-3 py-1.5 rounded-2xl bg-black/50 border border-white/10 shadow-inner">
            <span className="flex items-center gap-1 text-rose-300">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>حدائق القبة</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-300 font-mono" dir="ltr">
              <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{storePhone}</span>
            </span>
          </div>
        </div>

        {/* ── ACTION CARDS / BUTTONS ── */}
        <div className="w-full space-y-2.5 pt-1">
          {/* 1. DELIVERY ORDER */}
          <Link
            href="/order?type=delivery"
            className="group relative w-full p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-[#1c0c14] to-rose-950/40 border border-rose-500/40 hover:border-rose-400 flex items-center justify-between gap-3 transition shadow-lg hover:shadow-rose-500/20 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition">
                <Bike className="w-6 h-6" />
              </div>
              <div className="text-right min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm sm:text-base font-black text-white group-hover:text-rose-200 transition">
                    طلب دليفري وتوصيل للمنزل
                  </h2>
                  <span className="text-xs">🛵</span>
                </div>
                <p className="text-[11px] text-rose-200/70 truncate mt-0.5">
                  توصيل سريع وطازج لباب بيتك بحدائق القبة والمناطق المجاورة
                </p>
              </div>
            </div>
            <div className="text-rose-400 group-hover:translate-x-[-3px] transition text-sm font-black shrink-0">
              ←
            </div>
          </Link>

          {/* 2. DIRECT PICKUP (TAKEAWAY) */}
          <Link
            href="/order?type=takeaway"
            className="group relative w-full p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-[#1c0c14] to-amber-950/40 border border-amber-500/40 hover:border-amber-400 flex items-center justify-between gap-3 transition shadow-lg hover:shadow-amber-500/20 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition font-black">
                <Store className="w-6 h-6" />
              </div>
              <div className="text-right min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm sm:text-base font-black text-white group-hover:text-amber-200 transition">
                    طلب استلام من الفرع (تيك أواي)
                  </h2>
                  <span className="text-xs">🛍️</span>
                </div>
                <p className="text-[11px] text-amber-200/70 truncate mt-0.5">
                  اطلب مسبقاً واستلم أوردرك طازج وجاهز بدون انتظار
                </p>
              </div>
            </div>
            <div className="text-amber-400 group-hover:translate-x-[-3px] transition text-sm font-black shrink-0">
              ←
            </div>
          </Link>

          {/* 3. SCHEDULED CAKE & SWEETS PRE-ORDER */}
          <Link
            href="/order?mode=preorder"
            className="group relative w-full p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#1c0c14] to-purple-950/40 border border-purple-500/40 hover:border-purple-400 flex items-center justify-between gap-3 transition shadow-lg hover:shadow-purple-500/20 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition">
                <CalendarClock className="w-6 h-6" />
              </div>
              <div className="text-right min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm sm:text-base font-black text-white group-hover:text-purple-200 transition">
                    حجز تورت ومناسبات بموعد مسبق
                  </h2>
                  <span className="text-xs">🎂</span>
                </div>
                <p className="text-[11px] text-purple-200/70 truncate mt-0.5">
                  احجز تورتتك لمناسبتك الخاصة وحدد موعد الاستلام أو التوصيل
                </p>
              </div>
            </div>
            <div className="text-purple-400 group-hover:translate-x-[-3px] transition text-sm font-black shrink-0">
              ←
            </div>
          </Link>

          {/* 4. INSTAPAY & VODAFONE CASH PAYMENT HUB (CLICK TO OPEN MODAL) */}
          <button
            type="button"
            onClick={() => setShowPaymentModal(true)}
            className="group relative w-full p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-[#111f18] to-emerald-950/50 border-2 border-emerald-500/50 hover:border-emerald-400 flex items-center justify-between gap-3 transition shadow-xl hover:shadow-emerald-500/20 active:scale-[0.99] cursor-pointer text-right"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition font-black">
                <Zap className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-sm sm:text-base font-black text-white group-hover:text-emerald-200 transition">
                    الدفع الإلكتروني (إنستاباي & كاش)
                  </h2>
                  <span className="py-0.5 px-2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/40">
                    كيو ار كود ⚡
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/80 truncate mt-0.5">
                  أرقام وباركود فودافون كاش ({vodaNum}) وإنستاباي ({instaNum})
                </p>
              </div>
            </div>
            <div className="py-1 px-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-black shrink-0 border border-emerald-500/40 group-hover:bg-emerald-500 group-hover:text-slate-950 transition">
              عرض 💳
            </div>
          </button>

          {/* 5. DIRECT WHATSAPP */}
          <a
            href={whatsappChatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full p-3.5 rounded-2xl bg-gradient-to-r from-green-950/40 via-[#0e1711] to-black/40 border border-green-500/30 hover:border-green-400 flex items-center justify-between gap-3 transition shadow hover:shadow-green-500/10 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-slate-950 flex items-center justify-center shrink-0 shadow font-black">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-black text-white group-hover:text-green-300 transition">
                  واتساب الطلبات والاستفسارات
                </h3>
                <p className="text-[11px] text-green-200/70 truncate mt-0.5" dir="ltr">
                  +20 {whatsappNum}
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-green-400 group-hover:scale-110 transition shrink-0" />
          </a>

          {/* 6. DIRECT CALL */}
          <a
            href={`tel:${storePhone}`}
            className="group relative w-full p-3.5 rounded-2xl bg-gradient-to-r from-sky-950/40 via-[#0c141c] to-black/40 border border-sky-500/30 hover:border-sky-400 flex items-center justify-between gap-3 transition shadow hover:shadow-sky-500/10 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow font-black">
                <Phone className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-black text-white group-hover:text-sky-300 transition">
                  اتصال هاتفي مباشر
                </h3>
                <p className="text-[11px] text-sky-200/70 truncate mt-0.5 font-mono" dir="ltr">
                  {storePhone}
                </p>
              </div>
            </div>
            <div className="text-sky-400 text-xs font-bold shrink-0">اتصل 📞</div>
          </a>

          {/* 7. GOOGLE MAPS LOCATION */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-[#18110b] to-black/40 border border-amber-500/25 hover:border-amber-400/50 flex items-center justify-between gap-3 transition shadow active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center shrink-0 shadow font-black">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition">
                  موقع الفرع على خرائط جوجل
                </h3>
                <p className="text-[11px] text-amber-200/70 truncate mt-0.5">
                  {storeAddress}
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-amber-400 group-hover:scale-110 transition shrink-0" />
          </a>
        </div>

        {/* Social Media Grid */}
        <div className="w-full pt-2">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {/* Facebook */}
            <a
              href={settings?.facebookUrl || "https://facebook.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-bold flex items-center gap-2 transition"
            >
              <span>📘</span>
              <span>فيسبوك</span>
            </a>

            {/* Instagram */}
            <a
              href={settings?.instagramUrl || "https://instagram.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-bold flex items-center gap-2 transition"
            >
              <span>📸</span>
              <span>إنستجرام</span>
            </a>

            {/* TikTok */}
            <a
              href={settings?.tiktokUrl || "https://tiktok.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-bold flex items-center gap-2 transition"
            >
              <span>🎵</span>
              <span>تيك توك</span>
            </a>
          </div>
        </div>

        {/* Staff & POS Login Link */}
        <div className="w-full pt-2">
          <Link
            href="/login"
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>تسجيل دخول الكاشير والإدارة (POS)</span>
          </Link>
        </div>

        {/* PWA Windows Desktop Install */}
        <div className="w-full pt-2 flex items-center justify-center">
          <PwaInstallButton variant="button" />
        </div>
      </main>

      {/* ── FOOTER: ORCA TECH SIGNATURE ── */}
      <footer className="relative z-10 w-full max-w-lg mx-auto pt-4 pb-2 text-center border-t border-white/5 text-[11px] text-amber-200/50 space-y-1">
        <p>
          حلواني أبو عادل — Haliy Youmak © {new Date().getFullYear()}
        </p>
        <p className="flex items-center justify-center gap-2 flex-wrap text-amber-200/60">
          <span>
            تطوير <strong className="text-amber-300 font-black">شركة أوركا للحلول البرمجية (Orca Tech) 🐬</strong>
          </span>
          <span>•</span>
          <a
            href="tel:01018671000"
            className="font-mono font-bold text-amber-200/90 hover:text-amber-300 underline underline-offset-2"
            dir="ltr"
          >
            01018671000
          </a>
        </p>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          PAYMENT MODAL (VODAFONE CASH & INSTAPAY WITH QR & COPY)
         ───────────────────────────────────────────────────────────── */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#150a12] border-2 border-emerald-500/50 p-5 shadow-2xl space-y-4 text-center">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 left-4 p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/30 text-white/70 hover:text-rose-300 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30 mb-2">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>طرق الدفع الإلكتروني المعتمدة</span>
              </div>
              <h3 className="text-lg font-black text-white">الدفع عبر المحافظ وإنستاباي</h3>
            </div>

            {/* Segmented Tabs: Vodafone Cash vs InstaPay */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-black/60 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setPaymentTab("VODAFONE")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  paymentTab === "VODAFONE"
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>فودافون كاش</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentTab("INSTAPAY")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  paymentTab === "INSTAPAY"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>إنستاباي (InstaPay)</span>
              </button>
            </div>

            {/* TAB CONTENT: VODAFONE CASH */}
            {paymentTab === "VODAFONE" && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                {/* QR Code Container */}
                <div className="mx-auto w-44 h-44 p-2.5 rounded-2xl bg-white border-2 border-rose-500/50 shadow-xl flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vodaQrUrl}
                    alt="Vodafone Cash QR"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Account Number & Copy */}
                <div className="p-2.5 rounded-xl bg-black/60 border border-rose-500/30 flex items-center justify-between gap-2">
                  <div className="text-right min-w-0">
                    <span className="text-[10px] text-rose-300/80 block font-bold">
                      رقم محفظة فودافون كاش:
                    </span>
                    <span className="font-mono text-base font-black text-white" dir="ltr">
                      {vodaNum}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={copyVodafone}
                    className="py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow"
                  >
                    {copiedVoda ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ الرقم</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed bg-rose-950/30 border border-rose-500/20 p-2 rounded-xl">
                  💡 للتحويل السريع: افتح تطبيق <strong>أنا فودافون</strong> أو اطلب الكود:{" "}
                  <code className="text-amber-300 font-mono font-bold" dir="ltr">
                    *9*7*{vodaNum}*المبلغ#
                  </code>
                </p>
              </div>
            )}

            {/* TAB CONTENT: INSTAPAY */}
            {paymentTab === "INSTAPAY" && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                {/* QR Code Container */}
                <div className="mx-auto w-44 h-44 p-2.5 rounded-2xl bg-white border-2 border-purple-500/50 shadow-xl flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={instaQrUrl}
                    alt="InstaPay QR"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Account Number & Copy */}
                <div className="p-2.5 rounded-xl bg-black/60 border border-purple-500/30 flex items-center justify-between gap-2">
                  <div className="text-right min-w-0">
                    <span className="text-[10px] text-purple-300/80 block font-bold">
                      حساب / رقم إنستاباي:
                    </span>
                    <span className="font-mono text-base font-black text-white" dir="ltr">
                      {instaNum}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={copyInsta}
                    className="py-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow"
                  >
                    {copiedInsta ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ الحساب</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed bg-purple-950/30 border border-purple-500/20 p-2 rounded-xl">
                  ⚡ يمكنك التحويل لحظياً من أي حساب بنكي أو محفظة إلكترونية عبر تطبيق <strong>إنستاباي (InstaPay)</strong>.
                </p>
              </div>
            )}

            {/* Send Receipt to WhatsApp Button */}
            <a
              href={`https://wa.me/20${whatsappNum}?text=${encodeURIComponent(
                `أهلاً حلواني أبو عادل 🍰 مرفق صورة إيصال التحويل الإلكتروني (${
                  paymentTab === "VODAFONE" ? "فودافون كاش" : "إنستاباي"
                }) لتأكيد الطلب`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>إرسال سكرين شوت الإيصال على واتساب المحل 📱</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
