"use client";

import React, { useEffect, useState } from "react";
import { X, Printer, QrCode, Copy, Check, ExternalLink, Sparkles } from "lucide-react";

interface CardQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotline?: string;
  abuAdelPhone?: string;
  soulmatePhone?: string;
  activeTable?: string;
}

export default function CardQRModal({
  isOpen,
  onClose,
  abuAdelPhone = "01146862114",
}: CardQRModalProps) {
  const [origin, setOrigin] = useState("https://abuadel.vercel.app");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // The Smart Hub URL
  const hubUrl = `${origin}/hub`;
  const qrImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=460x460&margin=12&color=000000&bgcolor=ffffff&data=${encodeURIComponent(
    hubUrl
  )}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(hubUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintCard = () => {
    const win = window.open("", "_blank", "width=800,height=1050");
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>كارت QR الذكي — حلواني أبو عادل</title>
  <style>
    @page { size: A5 portrait; margin: 0; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0d060a;
      font-family: "Segoe UI", Tahoma, Arial, sans-serif;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      padding: 8mm;
    }
    .card {
      width: 134mm;
      padding: 8mm 8mm 6mm 8mm;
      border-radius: 26px;
      background: linear-gradient(165deg, #1f0a14 0%, #11050b 60%, #1a0812 100%);
      border: 3px solid #f59e0b;
      box-shadow: 0 10px 40px rgba(0,0,0,0.8), inset 0 0 25px rgba(245,158,11,0.2);
      color: #ffffff;
      text-align: center;
      position: relative;
    }
    .emblem-wrapper {
      width: 86px;
      height: 86px;
      margin: 0 auto 6px auto;
      border-radius: 50%;
      background: #14080e;
      border: 2.5px solid #fbbf24;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      box-shadow: 0 4px 15px rgba(251,191,36,0.35);
    }
    .emblem-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .brand {
      font-size: 32px;
      font-weight: 900;
      color: #fbbf24;
      letter-spacing: 0.5px;
      margin: 0;
      text-shadow: 0 2px 8px rgba(0,0,0,0.6);
    }
    .slogan {
      font-size: 15px;
      font-weight: 800;
      color: #f43f5e;
      margin-top: 2px;
      letter-spacing: 1px;
    }
    .sub {
      font-size: 11px;
      font-weight: 700;
      color: #fef08a;
      margin-top: 3px;
    }
    .badges-row {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin-top: 8px;
      flex-wrap: wrap;
    }
    .badge {
      font-size: 10px;
      font-weight: 900;
      padding: 3px 8px;
      border-radius: 999px;
      background: rgba(251,191,36,0.15);
      border: 1.5px solid #f59e0b;
      color: #ffffff;
    }
    .headline {
      margin-top: 10px;
      font-size: 15px;
      font-weight: 900;
      color: #ffffff;
      background: rgba(244,63,94,0.25);
      border: 1.5px dashed #f43f5e;
      padding: 6px 12px;
      border-radius: 12px;
    }
    .qr-box {
      margin: 10px auto;
      width: 220px;
      height: 220px;
      padding: 8px;
      border-radius: 20px;
      background: #ffffff;
      border: 3.5px solid #fbbf24;
      box-shadow: 0 6px 20px rgba(0,0,0,0.5);
    }
    .qr-box img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .contact-row {
      font-size: 11px;
      font-weight: 800;
      color: #ffffff;
      margin-top: 6px;
      line-height: 1.5;
    }
    .contact-row span {
      color: #34d399;
      font-family: monospace;
      font-size: 12px;
      font-weight: 900;
    }
    .footer {
      margin-top: 8px;
      padding-top: 6px;
      border-top: 1px solid rgba(255,255,255,0.15);
      font-size: 10px;
      color: #fbbf24;
      font-weight: 800;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="emblem-wrapper">
      <img src="${origin}/abuadel-emblem.svg" alt="أبو عادل" onerror="this.src='${origin}/abuadel-receipt-logo.png'" />
    </div>
    <h1 class="brand">حلواني أبو عادل</h1>
    <div class="slogan">« احنا الحلو اللى بيحلو ✨ »</div>
    <div class="sub">أصل الحلويات الشرقية والغربية والتورت والجاتوهات الفاخرة</div>

    <div class="badges-row">
      <div class="badge">🛵 دليفري وتوصيل</div>
      <div class="badge">🛍️ استلام كاونتر</div>
      <div class="badge">🎂 حجز تورتات</div>
      <div class="badge">⚡ إنستاباي ومحافظ</div>
    </div>

    <div class="headline">امسح الكود بكاميرا الموبايل لفتح الرابط الذكي 📱</div>

    <div class="qr-box">
      <img src="${qrImgSrc}" alt="Abu Adel QR" />
    </div>

    <div class="contact-row">
      📍 101 شارع زمزم خلف مسجد الشيخ غراب - حدائق القبة<br />
      هاتف / واتساب: <span>${abuAdelPhone}</span> • كاش / إنستاباي: <span>01097280514</span>
    </div>

    <div class="footer">
      تطوير شركة أوركا للحلول البرمجية (Orca Tech) 🐬 • 📞 01018671000
    </div>
  </div>
  <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 450); };</script>
</body>
</html>`);
    win.document.close();
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="w-full max-w-md rounded-3xl bg-[#14080e] border-2 border-amber-400 text-white shadow-2xl overflow-hidden">
        {/* Header (High Contrast) */}
        <div className="px-5 py-4 border-b-2 border-amber-400/40 flex items-center justify-between bg-gradient-to-r from-rose-950 via-[#1f0a14] to-amber-950">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-amber-400 text-slate-950">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-300">
                كارت QR الذكي — حلواني أبو عادل
              </h2>
              <p className="text-[11px] text-rose-300 font-bold">احنا الحلو اللى بيحلو ✨</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/15 hover:bg-rose-600 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 text-center space-y-4">
          {/* Action Badge (Bright High Contrast) */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>يفتح صفحة الأيقونات الذكية: دليفري، حجز تورت، إنستاباي، وسوشيال</span>
          </div>

          {/* QR Code Container */}
          <div className="mx-auto w-56 h-56 p-3 rounded-2xl bg-white border-4 border-amber-400 shadow-2xl flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrImgSrc} alt="Abu Adel QR" className="w-full h-full object-contain" />
          </div>

          {/* Link Box (High Contrast) */}
          <div className="rounded-xl bg-black border-2 border-amber-400/70 p-2.5 flex items-center justify-between gap-2 text-xs">
            <span className="font-mono text-amber-300 font-black truncate text-xs sm:text-sm" dir="ltr">
              {hubUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black flex items-center gap-1.5 shrink-0 text-xs transition cursor-pointer shadow"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
              {copied ? "تم النسخ!" : "نسخ الرابط"}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handlePrintCard}
              className="py-3 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة كارت QR 🖨️</span>
            </button>

            <a
              href="/hub"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-3 rounded-xl bg-white/15 hover:bg-white/25 border-2 border-white/30 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow"
            >
              <ExternalLink className="w-4 h-4 text-amber-300" />
              <span>معاينة الرابط الذكي</span>
            </a>
          </div>

          <div className="pt-2 border-t border-white/15 text-xs text-amber-200 font-bold">
            تطوير شركة أوركا للحلول البرمجية (Orca Tech) 🐬 • 📞 01018671000
          </div>
        </div>
      </div>
    </div>
  );
}
