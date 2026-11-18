"use client";

import React, { useEffect, useState } from "react";
import { X, Printer, QrCode, Cake, Copy, Check } from "lucide-react";

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
  hotline = "15992",
}: CardQRModalProps) {
  const [origin, setOrigin] = useState("https://abuadel.vercel.app");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const orderUrl = `${origin}/order`;
  const qrImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=420x420&margin=12&color=2b0b16&bgcolor=fffdf8&data=${encodeURIComponent(
    orderUrl
  )}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(orderUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintCard = () => {
    const win = window.open("", "_blank", "width=760,height=960");
    if (!win) return;
    win.document.write(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>كارت QR حلواني أبو عادل</title>
  <style>
    @page { size: A5 portrait; margin: 0; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #14080e;
      font-family: "Segoe UI", Tahoma, Arial, sans-serif;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .card {
      width: 132mm;
      padding: 12mm 10mm;
      border-radius: 22px;
      background: linear-gradient(160deg, #240c18 0%, #10060b 100%);
      border: 2.5px solid #f43f5e;
      color: #fff1f2;
      text-align: center;
    }
    .brand { font-size: 38px; font-weight: 900; color: #fbbf24; }
    .sub { font-size: 13px; font-weight: 800; color: #fda4af; margin-top: 4px; }
    .headline { margin-top: 16px; font-size: 19px; font-weight: 900; color: #ffffff; }
    .qr-box {
      margin: 18px auto;
      width: 240px;
      height: 240px;
      padding: 12px;
      border-radius: 20px;
      background: #fffdf8;
      border: 3px solid #f59e0b;
    }
    .qr-box img { width: 100%; height: 100%; display: block; }
    .footer { margin-top: 12px; font-size: 11px; color: #fde68a; font-weight: 800; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">حلواني أبو عادل</div>
    <div class="sub">أصل الحلويات الشرقية والغربية والتورت • الخط الساخن ${hotline}</div>
    <div class="headline">امسح الكود للطلب دليفري أو حجز التورت بموعد مسبق 🍰</div>
    <div class="qr-box"><img src="${qrImgSrc}" alt="Abu Adel QR" /></div>
    <div class="footer">تطوير شركة أوركا للحلول البرمجية (Orca Tech) 🐬 • 📞 01018671000</div>
  </div>
  <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 450); };</script>
</body>
</html>`);
    win.document.close();
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md rounded-3xl bg-[#160b10] border border-rose-500/35 text-rose-50 shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-rose-500/10">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-black text-amber-200">كارت QR حلواني أبو عادل</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-rose-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-200 text-xs font-black">
            <Cake className="w-3.5 h-3.5 text-amber-400" />
            <span>لطلبات الدليفري والتيك أواي وحجز التورت بموعد مسبق</span>
          </div>

          <div className="mx-auto w-56 h-56 p-3 rounded-2xl bg-[#fffdf8] border-2 border-amber-400 shadow-xl">
            <img src={qrImgSrc} alt="Abu Adel QR" className="w-full h-full object-contain" />
          </div>

          <div className="rounded-xl bg-black/50 border border-white/10 px-3 py-2 flex items-center justify-between gap-2 text-xs">
            <span className="font-mono text-amber-200 truncate" dir="ltr">
              {orderUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 font-bold flex items-center gap-1 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "تم" : "نسخ"}
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrintCard}
            className="w-full py-3 rounded-2xl bg-gradient-to-l from-rose-500 to-amber-500 hover:brightness-110 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg transition"
          >
            <Printer className="w-4 h-4" />
            طباعة كارت QR حلواني أبو عادل
          </button>
        </div>
      </div>
    </div>
  );
}
