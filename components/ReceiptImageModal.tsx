"use client";

import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import {
  X,
  Share2,
  Download,
  Copy,
  Printer,
  CheckCircle2,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  Bike,
  Sparkles,
} from "lucide-react";
import { printThermalHtml, generateAbuAdelReceiptHtml } from "@/lib/print";

interface ReceiptImageModalProps {
  open: boolean;
  onClose: () => void;
  order: any;
  settings?: any;
}

export default function ReceiptImageModal({
  open,
  onClose,
  order,
  settings,
}: ReceiptImageModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!open || !order) return null;

  const brandName = settings?.brandNameAr || "حلواني أبو عادل";
  const brandNameEn = settings?.brandNameEn || "Abu Adel - Haliy Youmak";
  const slogan = settings?.slogan || "احنا الحلو اللى بيحلو";
  const address =
    settings?.cafeAddress ||
    "101 شارع زمزم خلف مسجد الشيخ غراب - حدائق القبة";
  const phone = settings?.abuAdelPhone || settings?.hotline || "01146862114";
  const cashNumber = settings?.vodafoneCashNumber || "01097280514";
  const instapayAccount = settings?.instapayAccount || "01097280514";

  // Parse items
  let items: any[] = [];
  try {
    items =
      typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];
  } catch {
    items = [];
  }

  const rawSubtotal = items.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 1),
    0
  );
  const deliveryFee = Number(order.deliveryFee) || 0;
  const discountAmount = Number(order.discountAmount) || 0;
  const finalAmount =
    order.finalAmount !== undefined
      ? Number(order.finalAmount)
      : Math.max(0, rawSubtotal + deliveryFee - discountAmount);

  // Format recipient phone for WhatsApp
  const rawTargetPhone =
    order.deliveryPhone || order.customerPhone || order.customer?.phone || "";
  let cleanPhone = rawTargetPhone.replace(/\D/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "2" + cleanPhone;
  } else if (!cleanPhone.startsWith("20") && cleanPhone.length === 10) {
    cleanPhone = "20" + cleanPhone;
  }

  // Generate PNG Blob using html2canvas
  const generatePngBlob = async (): Promise<Blob | null> => {
    if (!receiptRef.current) return null;
    const canvas = await html2canvas(receiptRef.current, {
      scale: 2.5,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  };

  // 1. Copy image to clipboard
  const handleCopyImageOnly = async () => {
    try {
      setGenerating(true);
      const blob = await generatePngBlob();
      if (!blob) throw new Error("فشل إنشاء الصورة");

      if (typeof navigator !== "undefined" && navigator.clipboard && (window as any).ClipboardItem) {
        await navigator.clipboard.write([
          new (window as any).ClipboardItem({ "image/png": blob }),
        ]);
        setCopiedSuccess(true);
        setToastMsg("تم نسخ صورة الفاتورة للحافظة بنجاح ✅ يمكنك لصقها الآن في أي مكان (Ctrl + V)");
        setTimeout(() => setCopiedSuccess(false), 4000);
      } else {
        // Fallback: download
        handleDownloadPng();
      }
    } catch (e: any) {
      setToastMsg("تعذر نسخ الصورة تلقائياً للحافظة، يمكنك تنزيلها بالزر المجاور 📥");
    } finally {
      setGenerating(false);
    }
  };

  // 2. Download PNG
  const handleDownloadPng = async () => {
    try {
      setGenerating(true);
      const blob = await generatePngBlob();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `فاتورة-أبو-عادل-${order.orderNumber || order.id?.slice(-4)}.png`;
      link.click();
      URL.revokeObjectURL(url);
      setToastMsg("تم تنزيل صورة الفاتورة بجودة عالية 📥");
    } catch {
      setToastMsg("حدث خطأ أثناء تنزيل الصورة");
    } finally {
      setGenerating(false);
    }
  };

  // 3. Dispatch to Customer's WhatsApp (Copy image + Download PNG + Open WhatsApp chat)
  const handleSendToWhatsApp = async () => {
    try {
      setGenerating(true);

      // 1. Generate Blob & Copy to Clipboard
      const blob = await generatePngBlob();
      let copied = false;
      if (blob && typeof navigator !== "undefined" && navigator.clipboard && (window as any).ClipboardItem) {
        try {
          await navigator.clipboard.write([
            new (window as any).ClipboardItem({ "image/png": blob }),
          ]);
          copied = true;
        } catch {
          // ignore clipboard block
        }
      }

      // 2. Trigger auto-download as immediate backup file
      if (blob) {
        try {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `فاتورة-أبو-عادل-${order.orderNumber || "طلب"}.png`;
          link.click();
          URL.revokeObjectURL(url);
        } catch {
          // ignore download error
        }
      }

      // 3. WhatsApp Message Text
      const custGreeting = order.customerName ? `يا أستاذ/ة *${order.customerName}*` : "يا فندم";
      const orderTypeLabel =
        order.orderType === "DELIVERY"
          ? "توصيل دليفري 🛵"
          : order.orderType === "RESERVATION"
          ? "حجز مسبق 🎂"
          : "تيك أواي 🛍️";

      const waText = [
        `السلام عليكم ${custGreeting} 🍰`,
        `تحياتنا من *${brandName}* (${slogan}) ✨`,
        `────────────────────`,
        `🧾 *فاتورة طلبكم رقم #${order.orderNumber}* (${orderTypeLabel})`,
        `📅 التاريخ: ${new Date(order.createdAt || Date.now()).toLocaleDateString("ar-EG")}`,
        order.deliveryAddress ? `📍 عنوان التوصيل: ${order.deliveryAddress}` : null,
        order.driverName ? `🛵 مندوب التوصيل: ${order.driverName} (${order.driverPhone || ""})` : null,
        `💰 *المبلغ المطلوب: ${finalAmount.toFixed(2)} ج.م*`,
        cashNumber ? `📱 فودافون كاش / إنستاباي: *${cashNumber}*` : null,
        `────────────────────`,
        `📸 *تم إرفاق صورة الفاتورة المعتمدة* 🧾`,
        copied
          ? `(الصورة منسوخة بحافظتك الآن، اضغط لصق Ctrl + V مباشرة في الشات 📎)`
          : `(تجد صورة الفاتورة في التنزيلات، أرسلها في الشات 📎)`,
        `📞 للطلبات والاستفسار: ${phone}`,
        `نسعد بخدمتكم دائماً ❤️`,
      ]
        .filter(Boolean)
        .join("\n");

      const waUrl = cleanPhone
        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`
        : `https://wa.me/?text=${encodeURIComponent(waText)}`;

      window.open(waUrl, "_blank");

      setToastMsg(
        copied
          ? "✅ تم نسخ صورة الفاتورة للحافظة وفتح واتساب العميل! الصق الصورة فوراً (Ctrl + V) داخل الشات 📱"
          : "✅ تم تنزيل صورة الفاتورة وفتح واتساب العميل! يمكنك إرسال الصورة من التنزيلات 📎"
      );
    } catch {
      setToastMsg("تعذر تجهيز رسالة الواتساب");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <div className="w-full max-w-xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto text-slate-100">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/10 bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              📱
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-amber-300">
                إرسال صورة الفاتورة لواتساب العميل
              </h3>
              <p className="text-[11px] text-slate-400">
                طلب رقم #{order.orderNumber} • {order.customerName || "عميل"} • {cleanPhone || "بدون هاتف"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Banner */}
        <div className="p-4 bg-slate-950/70 border-b border-white/5 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSendToWhatsApp}
              disabled={generating}
              className="flex-1 min-w-[200px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer disabled:opacity-50"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>
                {generating ? "جاري تحويل الفاتورة لصورة..." : "إرسال صورة الفاتورة على واتساب العميل 📱"}
              </span>
            </button>

            <button
              onClick={handleCopyImageOnly}
              disabled={generating}
              className="py-2.5 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              title="نسخ صورة الفاتورة فقط للحافظة"
            >
              <Copy className="w-4 h-4 text-purple-300" />
              <span>{copiedSuccess ? "تم النسخ ✅" : "نسخ الصورة"}</span>
            </button>

            <button
              onClick={handleDownloadPng}
              disabled={generating}
              className="py-2.5 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              title="تنزيل كملف PNG"
            >
              <Download className="w-4 h-4 text-sky-300" />
              <span>تنزيل PNG</span>
            </button>

            <button
              onClick={() => printThermalHtml(generateAbuAdelReceiptHtml(order, settings))}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              title="طباعة حرارية 80mm"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>طباعة</span>
            </button>
          </div>

          {toastMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}
        </div>

        {/* Scrollable Receipt Preview Container */}
        <div className="p-4 max-h-[55vh] overflow-y-auto bg-slate-950 flex justify-center items-start">
          {/* THE EXACT RECEIPT CANVAS TARGET (Clean white background, high contrast, elegant thermal receipt layout) */}
          <div
            ref={receiptRef}
            dir="rtl"
            style={{
              width: "340px",
              background: "#ffffff",
              color: "#0f172a",
              fontFamily: "Tajawal, Cairo, sans-serif",
              padding: "18px 16px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
              borderRadius: "14px",
              lineHeight: 1.35,
            }}
          >
            {/* Header: Logo & Store Info */}
            <div style={{ textAlign: "center", borderBottom: "2px solid #0f172a", paddingBottom: "10px", marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>
                <img
                  src="/abuadel-emblem.svg"
                  alt="Abu Adel Logo"
                  style={{
                    width: "88px",
                    height: "88px",
                    objectFit: "contain",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.08))",
                  }}
                  onError={(e: any) => {
                    e.currentTarget.src = "/abuadel-receipt-logo.png";
                  }}
                />
              </div>
              <h1 style={{ margin: "2px 0 0 0", fontSize: "19px", fontWeight: 900, color: "#b45309" }}>
                {brandName}
              </h1>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", fontFamily: "monospace", letterSpacing: "1px" }}>
                {brandNameEn}
              </div>
              <div style={{ fontSize: "12px", fontWeight: 900, color: "#b45309", marginTop: "3px" }}>
                ✨ {slogan} ✨
              </div>
              <div style={{ fontSize: "10.5px", color: "#334155", marginTop: "4px", lineHeight: 1.3 }}>
                📍 {address}
              </div>
              <div style={{ fontSize: "11.5px", fontWeight: 900, color: "#0f172a", marginTop: "3px", direction: "ltr" }}>
                📞 هاتف / واتساب: {phone}
              </div>
            </div>

            {/* Order Details Header */}
            <div style={{ fontSize: "11px", borderBottom: "1px dashed #64748b", paddingBottom: "8px", marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 900, fontSize: "13px" }}>
                <span>إيصال طلب: #{order.orderNumber}</span>
                <span
                  style={{
                    fontSize: "11px",
                    background: "#fef3c7",
                    color: "#92400e",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    border: "1px solid #fde68a",
                  }}
                >
                  {order.orderType === "DELIVERY"
                    ? "🛵 دليفري"
                    : order.orderType === "RESERVATION"
                    ? "🎂 حجز مسبق"
                    : "🛍️ تيك أواي"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#475569", fontSize: "10px", marginTop: "3px" }}>
                <span>التاريخ: {new Date(order.createdAt || Date.now()).toLocaleDateString("ar-EG")}</span>
                <span>الوقت: {new Date(order.createdAt || Date.now()).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              {order.cashierName && (
                <div style={{ fontSize: "10.5px", color: "#334155", marginTop: "2px" }}>
                  الكاشير: <strong>{order.cashierName}</strong>
                </div>
              )}
              {order.customerName && (
                <div style={{ fontSize: "11.5px", fontWeight: 900, color: "#0f172a", marginTop: "3px" }}>
                  العميل: <strong>{order.customerName}</strong>
                </div>
              )}
              {(order.deliveryPhone || order.customerPhone) && (
                <div style={{ fontSize: "11px", color: "#0f172a", fontWeight: 700, direction: "ltr", textAlign: "right" }}>
                  الموبايل: {order.deliveryPhone || order.customerPhone}
                </div>
              )}
              {order.deliveryAddress && (
                <div style={{ fontSize: "11px", color: "#0f172a", fontWeight: 700, marginTop: "2px" }}>
                  العنوان: {order.deliveryAddress}
                </div>
              )}
              {order.driverName && (
                <div style={{ fontSize: "11px", fontWeight: 900, color: "#0369a1", marginTop: "3px", background: "#f0f9ff", padding: "3px 6px", borderRadius: "6px" }}>
                  🛵 المندوب: {order.driverName} {order.driverPhone ? `(${order.driverPhone})` : ""}
                </div>
              )}
            </div>

            {/* Items Table */}
            <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse", marginBottom: "8px" }}>
              <thead>
                <tr style={{ borderBottom: "1.5px solid #0f172a", color: "#0f172a", fontSize: "10.5px" }}>
                  <th style={{ textAlign: "right", padding: "4px 2px" }}>الصنف</th>
                  <th style={{ textAlign: "center", padding: "4px 2px", width: "35px" }}>العدد</th>
                  <th style={{ textAlign: "center", padding: "4px 2px", width: "45px" }}>السعر</th>
                  <th style={{ textAlign: "left", padding: "4px 2px", width: "55px" }}>الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it: any, idx: number) => {
                  const qty = Number(it.qty) || 1;
                  const unitPrice = Number(it.price) || 0;
                  const total = qty * unitPrice;
                  return (
                    <tr key={idx} style={{ borderBottom: "1px dashed #cbd5e1" }}>
                      <td style={{ padding: "5px 2px", fontWeight: 700 }}>
                        <div>{it.nameAr || it.name}</div>
                        {it.selectedSize && (
                          <span style={{ fontSize: "9.5px", color: "#64748b" }}>({it.selectedSize})</span>
                        )}
                      </td>
                      <td style={{ textAlign: "center", padding: "5px 2px", fontWeight: 900, fontFamily: "monospace" }}>
                        {qty}
                      </td>
                      <td style={{ textAlign: "center", padding: "5px 2px", fontFamily: "monospace", color: "#475569" }}>
                        {unitPrice.toFixed(0)}
                      </td>
                      <td style={{ textAlign: "left", padding: "5px 2px", fontWeight: 900, fontFamily: "monospace" }}>
                        {total.toFixed(0)} ج
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Totals Breakdown */}
            <div style={{ borderTop: "1.5px solid #0f172a", paddingTop: "6px", fontSize: "11px", display: "flex", flexDirection: "column", gap: "3px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
                <span>المجموع الفرعي:</span>
                <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{rawSubtotal.toFixed(2)} ج.م</span>
              </div>
              {deliveryFee > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#0369a1", fontWeight: 700 }}>
                  <span>رسوم التوصيل:</span>
                  <span style={{ fontFamily: "monospace" }}>+{deliveryFee.toFixed(2)} ج.م</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#b91c1c", fontWeight: 700 }}>
                  <span>الخصم:</span>
                  <span style={{ fontFamily: "monospace" }}>-{discountAmount.toFixed(2)} ج.م</span>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "2px solid #0f172a",
                  marginTop: "5px",
                  paddingTop: "5px",
                  fontSize: "14px",
                  fontWeight: 900,
                  color: "#0f172a",
                }}
              >
                <span>المبلغ الإجمالي المطلوب:</span>
                <span style={{ fontSize: "16px", fontFamily: "monospace", color: "#b45309" }}>
                  {finalAmount.toFixed(2)} ج.م
                </span>
              </div>
            </div>

            {/* Electronic Payment Callout */}
            <div
              style={{
                marginTop: "10px",
                background: "#fef3c7",
                border: "1px dashed #d97706",
                borderRadius: "8px",
                padding: "6px 8px",
                textAlign: "center",
                fontSize: "10.5px",
                color: "#92400e",
                fontWeight: 700,
              }}
            >
              <div>💳 الدفع الإلكتروني (فودافون كاش / إنستاباي):</div>
              <div style={{ fontSize: "12.5px", fontWeight: 900, fontFamily: "monospace", color: "#78350f", marginTop: "2px" }}>
                {cashNumber}
              </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: "center", marginTop: "10px", paddingTop: "8px", borderTop: "1px solid #cbd5e1", fontSize: "10px", color: "#64748b" }}>
              <div style={{ fontWeight: 900, color: "#b45309" }}>{brandName} • {slogan}</div>
              <div style={{ marginTop: "2px" }}>شكراً لاختياركم لنا ❤️ نتمنى لكم يوماً سعيداً</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
