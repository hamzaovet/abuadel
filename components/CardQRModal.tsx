"use client";

import React, { useEffect, useState } from "react";
import { X, Printer, QrCode, Cake, Copy, Check, ExternalLink, Zap } from "lucide-react";

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
  const qrImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=460x460&margin=12&color=2b0b16&bgcolor=fffdf8&data=${encodeURIComponent(
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
      padding: 10mm;
    }
    .card {
      width: 136mm;
      padding: 10mm 10mm 8mm 10mm;
      border-radius: 26px;
      background: linear-gradient(165deg, #220a16 0%, #11050b 60%, #1a0812 100%);
      border: 3px solid #d97706;
      box-shadow: 0 10px 40px rgba(0,0,0,0.8), inset 0 0 25px rgba(217,119,6,0.15);
      color: #fff1f2;
      text-align: center;
      position: relative;
    }
    .emblem-wrapper {
      width: 80px;
      height: 80px;
      margin: 0 auto 8px auto;
      border-radius: 50%;
      background: #14080e;
      border: 2.5px solid #fbbf24;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      box-shadow: 0 4px 15px rgba(251,191,36,0.3);
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
      color: #fde68a;
      opacity: 0.85;
      margin-top: 3px;
    }
    .badges-row {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin-top: 10px;
      flex-wrap: wrap;
    }
    .badge {
      font-size: 10px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 999px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(251,191,36,0.4);
      color: #fef08a;
    }
    .headline {
      margin-top: 12px;
      font-size: 15px;
      font-weight: 900;
      color: #ffffff;
      background: rgba(244,63,94,0.18);
      border: 1px dashed rgba(244,63,94,0.4);
      padding: 6px 12px;
      border-radius: 12px;
    }
    .qr-box {
      margin: 12px auto;
      width: 220px;
      height: 220px;
      padding: 10px;
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
    }
    .footer {
      margin-top: 10px;
      padding-top: 6px;
      border-top: 1px solid rgba(255,255,255,0.1);
      font-size: 9.5px;
      color: #fbbf24;
      opacity: 0.85;
      font-weight: 700;
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
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="w-full max-w-md rounded-3xl bg-[#160b10] border border-amber-500/40 text-rose-50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-rose-950/60 to-amber-950/60">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-black text-amber-200">كارت QR الذكي — حلواني أبو عادل</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/30 text-rose-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 text-center space-y-3.5">
          {/* Logo & Headline */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full border border-amber-400/60 bg-[#12080f] p-0.5 overflow-hidden shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/abuadel-emblem.svg"
                alt="أبو عادل"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-right">
              <h3 className="text-sm font-black text-amber-200">حلواني أبو عادل — Haliy Youmak</h3>
              <p className="text-[11px] text-rose-300 font-bold">احنا الحلو اللى بيحلو ✨</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-200 text-xs font-black border border-rose-500/30">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>يفتح صفحة الأيقونات الذكية: دليفري، حجز تورت، إنستاباي، وسوشيال</span>
          </div>

          {/* QR Code Container */}
          <div className="mx-auto w-52 h-52 p-3 rounded-2xl bg-[#fffdf8] border-2 border-amber-400 shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrImgSrc} alt="Abu Adel QR" className="w-full h-full object-contain" />
          </div>

          {/* Link Box */}
          <div className="rounded-xl bg-black/60 border border-white/10 px-3 py-2 flex items-center justify-between gap-2 text-xs">
            <span className="font-mono text-amber-200 truncate text-[11px]" dir="ltr">
              {hubUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1 shrink-0 text-xs transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "تم النسخ" : "نسخ الرابط"}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handlePrintCard}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-l from-rose-600 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة كارت QR 🖨️</span>
            </button>

            <a
              href="/hub"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>معاينة الرابط الذكي</span>
            </a>
          </div>

          <div className="pt-2 border-t border-white/5 text-[10px] text-amber-200/50">
            تطوير شركة أوركا للحلول البرمجية (Orca Tech) 🐬 • 📞 01018671000
          </div>
        </div>
      </div>
    </div>
  );
}
