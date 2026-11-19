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
  Sparkles,
  ExternalLink,
  ChevronLeft,
} from "lucide-react";
import PwaInstallButton from "@/components/PwaInstallButton";
import { ThemeToggle } from "@/components/ThemeProviderAndToggle";

const OFFICIAL_FACEBOOK_URL =
  "https://www.facebook.com/p/%D9%85%D9%86%D9%81%D8%B0-%D8%A8%D9%8A%D8%B9-%D8%AD%D9%84%D9%88%D8%A7%D9%86%D9%89-%D8%A3%D8%A8%D9%88-%D8%B9%D8%A7%D8%AF%D9%84-%D8%A8%D8%A7%D9%84%D9%82%D8%A7%D9%87%D8%B1%D8%A9-%D8%AD%D8%AF%D8%A7%D8%A6%D9%82-%D8%A7%D9%84%D9%82%D8%A8%D8%A9--100078679611752/";

const OFFICIAL_INSTAGRAM_URL =
  "https://www.instagram.com/?fbclid=IwY2xjawVrzpZleHRuA2FlbQIxMABwZG9mBWJyaWQRMWNoakkwYUlJaEF4dnYySUhzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEfZZ39iutBc9qooPtr_Xf151JDxOrpRQk6WDl122zuPEwSbh7zeY3gQfQd3FA_aem_7DBcMQasr2G6WTTAdU4VoQ";

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

  const fbLink = settings?.facebookUrl || OFFICIAL_FACEBOOK_URL;
  const instaLink = settings?.instagramUrl || OFFICIAL_INSTAGRAM_URL;
  const tiktokLink = settings?.tiktokUrl || "https://www.tiktok.com";

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
          text: "الرابط الذكي لحلواني أبو عادل: طلب دليفري، استلام كاونتر، حجز تورتات، والدفع الإلكتروني",
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback
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
      className="min-h-screen bg-[#0d070b] text-white flex flex-col items-center justify-between p-4 sm:p-6 relative selection:bg-amber-500 selection:text-black overflow-x-hidden font-sans"
    >
      {/* Ambient Luxury Gradients */}
      <div className="pointer-events-none fixed -top-32 -right-32 w-96 h-96 rounded-full bg-rose-600/15 blur-[140px]" />
      <div className="pointer-events-none fixed -bottom-32 -left-32 w-96 h-96 rounded-full bg-amber-500/15 blur-[140px]" />

      <main className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center space-y-5 my-auto py-4">
        {/* Top Floating Action Bar */}
        <div className="w-full flex items-center justify-between px-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-200 text-xs font-black shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>الرابط الذكي الموحد</span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <button
              type="button"
              onClick={handleShare}
              className="py-1 px-3.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow"
              title="مشاركة الرابط"
            >
              {shareSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-black">تم النسخ!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>مشاركة</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Circular Gold Monogram Emblem */}
          <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-amber-500/30 blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-amber-600 to-rose-700 shadow-2xl">
              <div
                data-force-dark="true"
                className="w-full h-full rounded-full bg-[#12080f] overflow-hidden flex items-center justify-center p-2 border-2 border-amber-400/50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/abuadel-emblem.svg"
                  alt="حلواني أبو عادل"
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>
            </div>
          </div>

          {/* Titles & Slogan (High Contrast) */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black tracking-wide text-amber-300 drop-shadow">
              حلواني أبو عادل
            </h1>
            <p className="text-sm sm:text-base font-black text-rose-300 tracking-wider">
              « احنا الحلو اللى بيحلو ✨ »
            </p>
            <p className="text-xs text-amber-100/90 font-bold max-w-sm">
              أصل الحلويات الشرقية والغربية والتورت والجاتوهات الفاخرة
            </p>
          </div>

          {/* Location & Phone Badge (High Contrast) */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 text-xs text-white font-black px-4 py-2 rounded-2xl bg-[#1b1017] border border-amber-500/40 shadow-lg">
            <span className="flex items-center gap-1.5 text-rose-300">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <span>حدائق القبة — 101 شارع زمزم</span>
            </span>
            <span className="text-amber-500">•</span>
            <span className="flex items-center gap-1.5 text-emerald-300 font-mono" dir="ltr">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{storePhone}</span>
            </span>
          </div>
        </div>

        {/* ── HIGH-CONTRAST ACTION CARDS ── */}
        <div className="w-full space-y-3 pt-1">
          {/* 1. DELIVERY ORDER */}
          <Link
            href="/order?type=delivery"
            className="group relative w-full p-4 rounded-2xl bg-[#1a0c14] border-2 border-rose-500/60 hover:border-rose-400 flex items-center justify-between gap-3 transition shadow-xl hover:shadow-rose-500/25 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition">
                <Bike className="w-7 h-7" />
              </div>
              <div className="text-right min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base sm:text-lg font-black text-white group-hover:text-rose-200 transition">
                    طلب دليفري وتوصيل للمنزل
                  </h2>
                  <span className="text-sm">🛵</span>
                </div>
                <p className="text-xs text-rose-950 dark:text-rose-200 font-bold truncate mt-0.5">
                  توصيل سريع وطازج لباب بيتك بحدائق القبة والمناطق المجاورة
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition shrink-0">
              <ChevronLeft className="w-5 h-5" />
            </div>
          </Link>

          {/* 2. DIRECT PICKUP (TAKEAWAY) */}
          <Link
            href="/order?type=takeaway"
            className="group relative w-full p-4 rounded-2xl bg-[#1b120c] border-2 border-amber-500/60 hover:border-amber-400 flex items-center justify-between gap-3 transition shadow-xl hover:shadow-amber-500/25 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition font-black">
                <Store className="w-7 h-7" />
              </div>
              <div className="text-right min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base sm:text-lg font-black text-white group-hover:text-amber-200 transition">
                    طلب استلام من الفرع (تيك أواي)
                  </h2>
                  <span className="text-sm">🛍️</span>
                </div>
                <p className="text-xs text-amber-950 dark:text-amber-200 font-bold truncate mt-0.5">
                  اطلب مسبقاً واستلم أوردرك طازج وجاهز بدون أي انتظار
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition shrink-0">
              <ChevronLeft className="w-5 h-5" />
            </div>
          </Link>

          {/* 3. SCHEDULED CAKE & SWEETS PRE-ORDER */}
          <Link
            href="/order?mode=preorder"
            className="group relative w-full p-4 rounded-2xl bg-[#170e1c] border-2 border-purple-500/60 hover:border-purple-400 flex items-center justify-between gap-3 transition shadow-xl hover:shadow-purple-500/25 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition">
                <CalendarClock className="w-7 h-7" />
              </div>
              <div className="text-right min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base sm:text-lg font-black text-white group-hover:text-purple-200 transition">
                    حجز تورت ومناسبات بموعد مسبق
                  </h2>
                  <span className="text-sm">🎂</span>
                </div>
                <p className="text-xs text-purple-950 dark:text-purple-200 font-bold truncate mt-0.5">
                  احجز تورتتك لمناسبتك الخاصة وحدد موعد الاستلام أو التوصيل
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition shrink-0">
              <ChevronLeft className="w-5 h-5" />
            </div>
          </Link>

          {/* 4. INSTAPAY & VODAFONE CASH PAYMENT HUB */}
          <button
            type="button"
            onClick={() => setShowPaymentModal(true)}
            className="group relative w-full p-4 rounded-2xl bg-[#0e1c15] border-2 border-emerald-500 hover:border-emerald-400 flex items-center justify-between gap-3 transition shadow-xl hover:shadow-emerald-500/30 active:scale-[0.99] cursor-pointer text-right"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition font-black">
                <Zap className="w-7 h-7" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-black text-white group-hover:text-emerald-200 transition">
                    الدفع الإلكتروني (إنستاباي & كاش)
                  </h2>
                  <span className="py-0.5 px-2.5 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-black shadow">
                    QR كود ⚡
                  </span>
                </div>
                <p className="text-xs text-emerald-950 dark:text-emerald-200 font-bold truncate mt-0.5">
                  أرقام وباركود فودافون كاش ({vodaNum}) وإنستاباي ({instaNum})
                </p>
              </div>
            </div>
            <div className="py-1.5 px-3 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black shrink-0 group-hover:bg-emerald-400 transition shadow">
              عرض 💳
            </div>
          </button>

          {/* 5. DIRECT WHATSAPP */}
          <a
            href={whatsappChatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full p-3.5 rounded-2xl bg-[#0f1a12] border-2 border-green-500/50 hover:border-green-400 flex items-center justify-between gap-3 transition shadow-lg hover:shadow-green-500/20 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-slate-950 flex items-center justify-center shrink-0 shadow font-black">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="min-w-0 text-right">
                <h3 className="text-sm sm:text-base font-black text-white group-hover:text-green-300 transition">
                  واتساب الطلبات والاستفسارات
                </h3>
                <p className="text-xs text-green-950 dark:text-green-200 font-mono font-bold truncate mt-0.5" dir="ltr">
                  +20 {whatsappNum}
                </p>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-green-400 group-hover:scale-110 transition shrink-0" />
          </a>

          {/* 6. DIRECT CALL */}
          <a
            href={`tel:${storePhone}`}
            className="group relative w-full p-3.5 rounded-2xl bg-[#0d1620] border-2 border-sky-500/50 hover:border-sky-400 flex items-center justify-between gap-3 transition shadow-lg hover:shadow-sky-500/20 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow font-black">
                <Phone className="w-6 h-6" />
              </div>
              <div className="min-w-0 text-right">
                <h3 className="text-sm sm:text-base font-black text-white group-hover:text-sky-300 transition">
                  اتصال هاتفي مباشر بالفرع
                </h3>
                <p className="text-xs text-sky-950 dark:text-sky-200 font-mono font-bold truncate mt-0.5" dir="ltr">
                  {storePhone}
                </p>
              </div>
            </div>
            <div className="py-1 px-3 rounded-lg bg-sky-500 text-slate-950 font-black text-xs shrink-0">
              اتصل 📞
            </div>
          </a>

          {/* 7. GOOGLE MAPS LOCATION */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full p-3.5 rounded-2xl bg-[#1a120a] border-2 border-amber-500/50 hover:border-amber-400 flex items-center justify-between gap-3 transition shadow-lg hover:shadow-amber-500/20 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center shrink-0 shadow font-black">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="min-w-0 text-right">
                <h3 className="text-sm sm:text-base font-black text-white group-hover:text-amber-300 transition">
                  موقع الفرع على خرائط جوجل
                </h3>
                <p className="text-xs text-amber-950 dark:text-amber-200 font-bold truncate mt-0.5">
                  {storeAddress}
                </p>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-amber-400 group-hover:scale-110 transition shrink-0" />
          </a>
        </div>

        {/* Social Media Grid (High-Contrast Buttons with User's Exact URLs) */}
        <div className="w-full pt-3">
          <div className="text-center mb-2">
            <span className="text-xs font-black text-amber-300">صفحاتنا الرسمية على السوشيال ميديا:</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Facebook */}
            <a
              href={fbLink}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-2 rounded-xl bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-black flex items-center justify-center gap-1.5 transition shadow-lg"
              title="صفحة حلواني أبو عادل على فيسبوك"
            >
              <span className="text-sm">📘</span>
              <span>فيسبوك</span>
            </a>

            {/* Instagram */}
            <a
              href={instaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 text-white text-xs font-black flex items-center justify-center gap-1.5 transition shadow-lg"
              title="حساب حلواني أبو عادل على إنستجرام"
            >
              <span className="text-sm">📸</span>
              <span>إنستجرام</span>
            </a>

            {/* TikTok */}
            <a
              href={tiktokLink}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-2 rounded-xl bg-black border border-white/30 hover:border-white text-white text-xs font-black flex items-center justify-center gap-1.5 transition shadow-lg"
              title="تيك توك"
            >
              <span className="text-sm">🎵</span>
              <span>تيك توك</span>
            </a>
          </div>
        </div>

        {/* Staff & POS Login Link */}
        <div className="w-full pt-2">
          <Link
            href="/login"
            className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-amber-200 hover:text-white text-xs font-black flex items-center justify-center gap-2 transition shadow"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>تسجيل دخول الكاشير والإدارة (POS)</span>
          </Link>
        </div>

        {/* PWA Windows Desktop Install */}
        <div className="w-full pt-1 flex items-center justify-center">
          <PwaInstallButton variant="button" />
        </div>
      </main>

      {/* ── FOOTER: ORCA TECH SIGNATURE (High Contrast) ── */}
      <footer className="relative z-10 w-full max-w-lg mx-auto pt-4 pb-2 text-center border-t border-white/10 text-xs text-amber-100 font-bold space-y-1">
        <p>
          حلواني أبو عادل — Haliy Youmak © {new Date().getFullYear()}
        </p>
        <p className="flex items-center justify-center gap-2 flex-wrap text-amber-200">
          <span>
            تطوير <strong className="text-amber-300 font-black">شركة أوركا للحلول البرمجية (Orca Tech) 🐬</strong>
          </span>
          <span>•</span>
          <a
            href="tel:01018671000"
            className="font-mono font-black text-amber-300 hover:text-white underline underline-offset-2"
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
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#14080e] border-2 border-emerald-400 p-5 shadow-2xl space-y-4 text-center">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 left-4 p-1.5 rounded-xl bg-white/15 hover:bg-rose-600 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/40 mb-2">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>طرق الدفع الإلكتروني المعتمدة</span>
              </div>
              <h3 className="text-lg font-black text-white">الدفع عبر المحافظ وإنستاباي</h3>
            </div>

            {/* Segmented Tabs: Vodafone Cash vs InstaPay */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-black/80 rounded-2xl border border-white/20">
              <button
                type="button"
                onClick={() => setPaymentTab("VODAFONE")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  paymentTab === "VODAFONE"
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/40"
                    : "text-slate-300 hover:text-white"
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
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/40"
                    : "text-slate-300 hover:text-white"
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
                <div className="mx-auto w-48 h-48 p-2 rounded-2xl bg-white border-4 border-rose-500 shadow-xl flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vodaQrUrl}
                    alt="Vodafone Cash QR"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Account Number & Copy */}
                <div className="p-3 rounded-xl bg-black border-2 border-rose-500/50 flex items-center justify-between gap-2">
                  <div className="text-right min-w-0">
                    <span className="text-xs text-rose-300 block font-bold">
                      رقم محفظة فودافون كاش:
                    </span>
                    <span className="font-mono text-lg font-black text-white" dir="ltr">
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
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ الرقم</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-white leading-relaxed bg-rose-950/60 border border-rose-500/40 p-2.5 rounded-xl font-bold">
                  💡 للتحويل السريع: افتح تطبيق <strong>أنا فودافون</strong> أو اطلب الكود:{" "}
                  <code className="text-amber-300 font-mono font-black" dir="ltr">
                    *9*7*{vodaNum}*المبلغ#
                  </code>
                </p>
              </div>
            )}

            {/* TAB CONTENT: INSTAPAY */}
            {paymentTab === "INSTAPAY" && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                {/* QR Code Container */}
                <div className="mx-auto w-48 h-48 p-2 rounded-2xl bg-white border-4 border-purple-500 shadow-xl flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={instaQrUrl}
                    alt="InstaPay QR"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Account Number & Copy */}
                <div className="p-3 rounded-xl bg-black border-2 border-purple-500/50 flex items-center justify-between gap-2">
                  <div className="text-right min-w-0">
                    <span className="text-xs text-purple-300 block font-bold">
                      حساب / رقم إنستاباي:
                    </span>
                    <span className="font-mono text-lg font-black text-white" dir="ltr">
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
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ الحساب</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-white leading-relaxed bg-purple-950/60 border border-purple-500/40 p-2.5 rounded-xl font-bold">
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
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition"
            >
              <MessageCircle className="w-5 h-5" />
              <span>إرسال سكرين شوت الإيصال على واتساب المحل 📱</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
