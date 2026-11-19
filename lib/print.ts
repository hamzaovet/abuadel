/**
 * Abu Adel Patisserie (حلواني أبو عادل — Haliy Youmak)
 * Precision 80mm Thermal & A4 Print Engine
 * Optimized for standard 80mm thermal printers (Xprinter, Epson, Bixolon)
 * With zero margin-clipping, embedded Abu Adel emblem, and single-dialog combined reporting.
 */

export function printThermalHtml(html: string) {
  if (typeof window === "undefined") return;
  try {
    let iframe = document.getElementById("__abuadel_print_frame__") as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "__abuadel_print_frame__";
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0px";
      iframe.style.height = "0px";
      iframe.style.border = "0";
      iframe.style.visibility = "hidden";
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();

    setTimeout(() => {
      try {
        iframe?.contentWindow?.focus();
        iframe?.contentWindow?.print();
      } catch (e) {
        console.error("[Abu Adel Print Error]", e);
      }
    }, 280);
  } catch (err) {
    console.error("[Abu Adel Print Engine]", err);
  }
}

export const COMMON_THERMAL_CSS = `
  @page {
    size: 80mm auto;
    margin: 0 !important;
  }
  * {
    box-sizing: border-box !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  html, body {
    width: 100% !important;
    max-width: 68mm !important;
    margin: 0 auto !important;
    padding: 1mm 1.5mm 3.5mm 1.5mm !important;
    background: #ffffff !important;
    color: #000000 !important;
    font-family: "Segoe UI", Tahoma, Arial, sans-serif !important;
    direction: rtl;
    font-size: 11px;
    line-height: 1.3;
    overflow-x: hidden !important;
  }
  table.items-tbl {
    width: 100% !important;
    table-layout: fixed !important;
    border-collapse: collapse !important;
    margin-top: 5px;
    font-size: 10px;
    word-break: break-word !important;
  }
  table.items-tbl th, table.items-tbl td {
    box-sizing: border-box !important;
    padding: 2.5px 2px !important;
    overflow: hidden !important;
  }
`;

function formatDateYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDateDMY(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}-${m}-${y}`;
}

function formatTimePA(d: Date): string {
  const h24 = d.getHours();
  const suffix = h24 >= 12 ? "م" : "ص";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${String(h12).padStart(2, "0")}:${min} ${suffix}`;
}

function formatTimeAMPM(d: Date): string {
  const h24 = d.getHours();
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${suffix} ${String(h12).padStart(2, "0")}:${min}`;
}

function paymentLabelAr(method?: string): string {
  switch ((method || "CASH").toUpperCase()) {
    case "CARD":
    case "VISA":
      return "فيزا / كارت";
    case "INSTAPAY":
      return "إنستاباي (InstaPay)";
    case "VODAFONE_CASH":
      return "محفظة كاش (فودافون)";
    case "STAFF":
      return "ستاف / موظفين";
    case "HOSPITALITY":
      return "ضيافة كافيه";
    case "CREDIT":
      return "آجل";
    case "TALABAT":
      return "تطبيق طلبات (شركة)";
    default:
      return "نقداً (كاش)";
  }
}

/**
 * 1. Abu Adel Official Customer Thermal Receipt (80mm)
 * Uses the authentic Abu Adel Logo (& TM motif) and official slogan "احنا الحلو اللى بيحلو"
 */
export function generateAbuAdelReceiptHtml(order: any, settings?: any): string {
  const created = order.createdAt ? new Date(order.createdAt) : new Date();
  let items: any[] = [];
  try {
    items = typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];
  } catch {
    items = [];
  }

  const totalQty = items.reduce((s, it) => s + (Number(it.qty) || 1), 0);
  const subtotal = Number(order.subtotal ?? order.finalAmount ?? 0);
  const discount = Number(order.discountAmount ?? 0);
  const tax = Number(order.taxAmount ?? 0);
  const service = Number(order.serviceCharge ?? 0);
  const deliveryFee = Number(order.deliveryFee ?? 0);
  const finalAmount = Number(order.finalAmount ?? subtotal - discount + tax + service + deliveryFee);

  const ticketNo =
    order.dailyTicketNo ||
    String(order.orderNumber || "1").replace(/\D/g, "").slice(-4) ||
    "1";

  const orderTypeTitle =
    order.orderType === "DELIVERY"
      ? `طلب دليفري منزلي — بون #${ticketNo}`
      : order.orderType === "TALABAT" || (order.paymentMethod || "").toUpperCase() === "TALABAT"
      ? `طلب تطبيق طلبات (Talabat) — بون #${ticketNo}`
      : order.orderType === "DINE_IN"
      ? `طلب صالة — بون #${ticketNo}`
      : `طلب تيك أواي واستلام — بون #${ticketNo}`;

  const address = settings?.cafeAddress || "101 شارع زمزم خلف مسجد الشيخ غراب - حدائق القبة";
  const whatsapp = settings?.whatsapp || "01146862114";
  const walletPhone = settings?.vodafoneCashNumber || "01097280514";
  const slogan = "احنا الحلو اللى بيحلو";

  const rowsHtml = items
    .map((it) => {
      const qty = Number(it.qty) || 1;
      const price = Number(it.price) || 0;
      const lineTotal = (price * qty).toFixed(2);
      const displayName = it.nameAr || it.nameEn || "صنف حلويات";
      const noteLine = it.notes ? `<div style="font-size:9px;color:#333;margin-top:1px;">* ${it.notes}</div>` : "";
      return `
        <tr>
          <td style="text-align:right;font-weight:700;padding:3px 2px;">${displayName}${noteLine}</td>
          <td style="text-align:center;font-family:monospace;">${price.toFixed(0)}</td>
          <td style="text-align:center;font-family:monospace;font-weight:800;">${qty}</td>
          <td style="text-align:center;font-family:monospace;font-weight:900;">${lineTotal}</td>
        </tr>
      `;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>فاتورة حلواني أبو عادل #${ticketNo}</title>
  <style>
    ${COMMON_THERMAL_CSS}
    .logo-wrap { text-align: center; margin-bottom: 4px; }
    .logo-img { max-width: 110px; height: auto; display: block; margin: 0 auto 2px; }
    .brand-name { font-size: 17px; font-weight: 900; color: #000; margin: 1px 0; }
    .slogan-tag {
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.5px;
      padding: 2px 6px;
      display: inline-block;
      margin: 1px 0 3px;
      border-bottom: 1.5px solid #000;
    }
    .sub-brand { font-size: 9.5px; font-weight: 800; color: #333; letter-spacing: 1px; }
    .bon-box {
      border: 1.5px solid #000;
      text-align: center;
      font-size: 12.5px;
      font-weight: 900;
      padding: 3px 4px;
      margin: 4px 0;
      background: #fafafa;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      font-size: 10.5px;
      font-weight: 700;
      margin: 1.5px 0;
    }
    table.items-tbl th {
      border-top: 1.5px solid #000;
      border-bottom: 1.5px solid #000;
      font-weight: 900;
      text-align: center;
      background: #f1f5f9;
    }
    table.items-tbl td {
      border-bottom: 1px dashed #666;
    }
    .sum-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2.5px 3px;
      font-weight: 800;
      font-size: 10.5px;
    }
    .sum-thick {
      border-top: 1.5px solid #000;
      border-bottom: 1.5px solid #000;
      margin-top: 3px;
      font-size: 11.5px;
      font-weight: 900;
    }
    .net-box {
      border: 1.5px solid #000;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3.5px 6px;
      margin-top: 4px;
      font-size: 13.5px;
      font-weight: 900;
      background: #f8fafc;
    }
    .pay-row {
      display: flex;
      justify-content: space-between;
      padding: 2.5px 6px;
      font-size: 11px;
      font-weight: 800;
      border-bottom: 1px solid #000;
    }
    .footer-block {
      text-align: center;
      margin-top: 5px;
      padding-top: 4px;
      border-top: 1px dashed #000;
      font-size: 10px;
      font-weight: 700;
      line-height: 1.45;
    }
  </style>
</head>
<body>
  <div class="logo-wrap">
    <img src="/abuadel-receipt-logo.jpg" alt="Abu Adel Logo" class="logo-img" onerror="this.style.display='none'" />
    <div class="brand-name">حلواني أبو عادل 🍰</div>
    <div class="slogan-tag">« ${slogan} »</div>
    <div class="sub-brand">Haliy Youmak • أصل الحلويات الشرقية والغربية والتورت</div>
  </div>

  <div class="bon-box">${orderTypeTitle}</div>

  <div class="meta-row">
    <span>التاريخ: ${formatDateDMY(created)}</span>
    <span>الوقت: ${formatTimePA(created)}</span>
  </div>

  <div class="meta-row">
    <span>الكاشير: ${order.cashierName || "كاشير أبو عادل"}</span>
    <span>الوردية: ${(order.shiftCode || "SHIFT_1") === "SHIFT_2" ? "المسائية" : "الصباحية"}</span>
  </div>

  ${
    order.customerName
      ? `<div class="meta-row" style="border-top:1px dashed #888;padding-top:2px;margin-top:2px;">
          <span>العميل: ${order.customerName}</span>
          <span>${order.customerPhone || ""}</span>
        </div>`
      : ""
  }

  ${
    order.orderType === "DELIVERY" && order.deliveryAddress
      ? `<div style="font-size:10px;font-weight:700;margin:2px 0;">العنوان: ${order.deliveryAddress}</div>`
      : ""
  }

  ${
    order.driverName
      ? `<div class="meta-row" style="color:#0f766e;">
          <span>مندوب التوصيل: ${order.driverName}</span>
          <span>${order.driverPhone || ""}</span>
        </div>`
      : ""
  }

  ${
    order.isScheduled && order.scheduledFor
      ? `<div style="border:1px solid #000;padding:2px 4px;margin:2px 0;font-size:10px;font-weight:900;text-align:center;background:#fffbeb;">
          موعد الاستلام المطلوب: ${formatDateDMY(new Date(order.scheduledFor))} — ${formatTimePA(new Date(order.scheduledFor))}
        </div>`
      : ""
  }

  ${
    order.notes
      ? `<div style="border:1px dashed #000;padding:2px 4px;margin-top:3px;font-size:9.5px;font-weight:700;">ملاحظات: ${order.notes}</div>`
      : ""
  }

  <table class="items-tbl">
    <thead>
      <tr>
        <th style="width:42%;">الصنف</th>
        <th style="width:18%;">السعر</th>
        <th style="width:16%;">الكمية</th>
        <th style="width:24%;">الاجمالى</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="sum-line sum-thick">
    <span>إجمالي الأصناف (${totalQty} قطعة)</span>
    <span style="font-family:monospace;">${subtotal.toFixed(2)} ج</span>
  </div>

  ${
    discount > 0
      ? `<div class="sum-line" style="color:#b91c1c;">
          <span>الخصم الممنوح</span>
          <span style="font-family:monospace;">-${discount.toFixed(2)} ج</span>
        </div>`
      : ""
  }

  ${
    deliveryFee > 0
      ? `<div class="sum-line" style="color:#047857;">
          <span>خدمة / مصاريف التوصيل</span>
          <span style="font-family:monospace;">+${deliveryFee.toFixed(2)} ج</span>
        </div>`
      : ""
  }

  <div class="net-box">
    <span>الصافي المطلوب</span>
    <span style="font-family:monospace;">${finalAmount.toFixed(2)} ج.م</span>
  </div>

  <div class="pay-row">
    <span>طريقة الدفع: ${paymentLabelAr(order.paymentMethod)}</span>
    <span style="font-family:monospace;">${finalAmount.toFixed(2)}</span>
  </div>

  ${
    order.depositPaid && order.depositPaid > 0
      ? `<div class="sum-line" style="background:#fef3c7;padding:2px 4px;">
          <span>المدفوع مقدماً (عربون): ${Number(order.depositPaid).toFixed(2)} ج</span>
          <span>المتبقي: ${(finalAmount - Number(order.depositPaid)).toFixed(2)} ج</span>
        </div>`
      : ""
  }

  <div class="footer-block">
    <div style="font-size:11px;font-weight:900;">« ${slogan} »</div>
    <div>${address}</div>
    <div dir="ltr" style="font-family:monospace;font-size:11px;font-weight:900;margin-top:1px;">
      📞 ${whatsapp}
    </div>
    <div style="font-size:9.5px;color:#333;margin-top:1px;">
      دفع كاش / إنستاباي / محفظة: <span style="font-family:monospace;font-weight:900;">${walletPhone}</span>
    </div>
    <div style="font-size:9px;color:#555;margin-top:4px;">
      تطوير شركة أوركا للحلول البرمجية (Orca Tech) 🐬 • 01018671000
    </div>
  </div>
</body>
</html>`;
}

// Alias to maintain compatibility with any existing calls
export const generateSoulmateReceiptHtml = generateAbuAdelReceiptHtml;

export interface DailyReportCategorySection {
  categoryName: string;
  items: { name: string; qty: number; total: number }[];
  totalQty: number;
  totalAmount: number;
}

export interface DailyReportPayload {
  reportNumber: string;
  shiftLabel: string;
  dateStr: string;
  openedAt?: string;
  openedBy: string;
  openingBalance: number;
  closedAt?: string;
  closedBy: string;
  closingBalance: number;
  totalMovement: number;
  cash: number;
  visa: number;
  instapay: number;
  vodafoneCash: number;
  staff: number;
  hospitality: number;
  credit: number;
  tips: number;
  expenses: number;
  returnsTotal: number;
  returnsCount: number;
  purchasesTotal: number;
  purchaseReturnsTotal: number;
  deletedQty: number;
  takeawaySales: number;
  takeawayCount: number;
  dineInSales: number;
  dineInCount: number;
  dineInService: number;
  deliverySales: number;
  deliveryFoodSales?: number;
  deliveryCount: number;
  deliveryFees: number;
  talabatGross?: number;
  talabatCommissionPercent?: number;
  talabatCommission?: number;
  talabatNet?: number;
  talabatCount?: number;
  productSalesOnly?: number;
  grandTotalSales: number;
  difference: number;
  categories: DailyReportCategorySection[];
}

/**
 * 2. Daily/Shift Items Breakdown by Category (Photo 9)
 */
export function generateDailyItemsReportHtml(data: DailyReportPayload): string {
  const sectionsHtml = (data.categories || [])
    .map(
      (cat) => `
      <div class="cat-title">قسم ${cat.categoryName}</div>
      <table class="cat-tbl">
        <thead>
          <tr>
            <th style="width:56%;">الصنف</th>
            <th style="width:18%;">الكمية</th>
            <th style="width:26%;">الاجمالى</th>
          </tr>
        </thead>
        <tbody>
          ${cat.items
            .map(
              (it) => `
            <tr>
              <td style="text-align:right;font-weight:600;padding:2.5px 3px;">${it.name}</td>
              <td style="text-align:center;font-family:monospace;font-weight:800;">${it.qty}</td>
              <td style="text-align:center;font-family:monospace;font-weight:900;">${it.total.toFixed(0)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <div class="cat-sub">
        <span>إجمالي قسم ${cat.categoryName}</span>
        <span style="font-family:monospace;">${cat.totalQty} ق</span>
        <span style="font-family:monospace;">${cat.totalAmount.toFixed(0)} ج</span>
      </div>
    `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>تقرير مبيعات الأصناف — حلواني أبو عادل</title>
  <style>
    ${COMMON_THERMAL_CSS}
    .title { text-align: center; font-size: 15px; font-weight: 900; margin-bottom: 2px; }
    .subtitle { text-align: center; font-size: 11px; font-weight: 800; margin-bottom: 6px; }
    .cat-title { text-align: center; font-size: 12px; font-weight: 900; margin: 6px 0 2px; background: #e2e8f0; padding: 2px; }
    table.cat-tbl { width: 100%; border-collapse: collapse; font-size: 10px; }
    table.cat-tbl th {
      background: #000 !important;
      color: #fff !important;
      padding: 3px 2px;
      border: 1px solid #000;
      font-weight: 900;
      text-align: center;
    }
    table.cat-tbl td {
      border: 1px solid #000;
      padding: 2.5px 2px;
    }
    .cat-sub {
      display: flex;
      justify-content: space-between;
      padding: 2.5px 4px;
      font-size: 10.5px;
      font-weight: 900;
      border-bottom: 1.5px dashed #000;
      margin-bottom: 4px;
    }
  </style>
</head>
<body>
  <div class="title">${data.dateStr?.includes("إلى") ? "تقرير مبيعات الأصناف للفترة" : "تقرير مبيعات أصناف اليوم"}</div>
  <div class="subtitle">حلواني أبو عادل • ${data.shiftLabel}</div>
  ${sectionsHtml || '<div style="text-align:center;padding:12px;font-size:11px;font-weight:bold;">لا توجد مبيعات أصناف مسجلة في هذه الفترة</div>'}
</body>
</html>`;
}

/**
 * 3. Daily/Shift Financial Summary Report (Photo 10)
 */
export function generateDailyFinancialSummaryHtml(data: DailyReportPayload): string {
  const now = new Date();
  const row = (label: string, value: string, bold = false) => `
    <div class="f-row ${bold ? "f-bold" : ""}">
      <span>${label}</span>
      <span dir="ltr" class="f-val">${value}</span>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>تقرير مبيعات اليوم - الملخص المالي — حلواني أبو عادل</title>
  <style>
    ${COMMON_THERMAL_CSS}
    .title { text-align: center; font-size: 15px; font-weight: 900; margin-bottom: 3px; }
    .box { border: 1.5px solid #000; }
    .sec-head {
      text-align: center;
      font-weight: 900;
      font-size: 11px;
      padding: 3px;
      border-top: 1.5px solid #000;
      border-bottom: 1px solid #000;
      background: #f1f5f9 !important;
    }
    .f-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 4px;
      font-size: 10.5px;
      font-weight: 700;
    }
    .f-bold { font-weight: 900; font-size: 11.5px; }
    .f-val { font-family: monospace; font-weight: 800; }
    .div-line { border-top: 1px solid #000; margin: 2px 0; }
    .footer-ts {
      text-align: center;
      font-family: monospace;
      font-size: 10.5px;
      font-weight: 900;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div class="title">${data.dateStr?.includes("إلى") ? "تقرير مبيعات الفترة" : "تقرير مبيعات اليوم"}</div>
  <div style="text-align:center;font-size:11px;font-weight:900;margin-bottom:4px;">حلواني أبو عادل • ${data.shiftLabel}</div>

  <div class="box">
    ${row("يوم رقم", data.reportNumber, true)}
    ${row("التاريخ", data.dateStr)}
    <div class="div-line"></div>
    ${row("وقت فتح الوردية", data.openedAt || formatDateDMY(now))}
    ${row("قام بفتح الوردية", data.openedBy || "كاشير أبو عادل")}
    ${row("الرصيد عند فتح اليوم", data.openingBalance.toFixed(2))}
    <div class="div-line"></div>
    ${row("وقت غلق الوردية", data.closedAt || `${formatDateDMY(now)} ${formatTimeAMPM(now)}`)}
    ${row("قام بغلق الوردية", data.closedBy || "كاشير أبو عادل")}
    ${row("الرصيد عند غلق اليوم", data.closingBalance.toFixed(2))}
    <div class="div-line"></div>
    ${row("اجمالى الحركة بالدرج", data.totalMovement.toFixed(2), true)}

    <div class="sec-head">تفاصيل إيرادات وطرق الدفع بالدرج</div>
    ${row("Cash (كاش الدرج)", data.cash.toFixed(2))}
    ${row("Visa (فيزا)", data.visa.toFixed(2))}
    ${row("Insta Pay (إنستاباي)", data.instapay.toFixed(2))}
    ${row("Vodafone Cash (محفظة كاش)", data.vodafoneCash.toFixed(2))}
    ${row("Staff (موظفين)", data.staff.toFixed(2))}
    ${row("ضيافة", data.hospitality.toFixed(2))}
    ${row("آجل", data.credit.toFixed(2))}
    ${row("Tips", data.tips.toFixed(2))}

    <div class="div-line"></div>
    ${row("اجمالى المصروفات", data.expenses.toFixed(2))}
    ${row("اجمالى مرتجع المبيعات", data.returnsTotal.toFixed(2))}
    ${row("عدد فواتير المرتجع", String(data.returnsCount))}

    <div class="div-line"></div>
    ${row("قيمة مبيعات تيك اوي", data.takeawaySales.toFixed(2))}
    ${row("عدد الفواتير التيك اوي", String(data.takeawayCount))}
    <div class="div-line"></div>
    ${row("مبيعات اصناف الدليفري", (data.deliveryFoodSales ?? Math.max(0, data.deliverySales - data.deliveryFees)).toFixed(2))}
    ${row("رسوم خدمة التوصيل", data.deliveryFees.toFixed(2))}
    ${row("اجمالى مبيعات الدليفري", data.deliverySales.toFixed(2))}
    ${row("عدد الفواتير الدليفري", String(data.deliveryCount))}

    ${(data.talabatGross || 0) > 0 ? `
    <div class="sec-head" style="background:#fed7aa !important; color:#7c2d12;">حسابات تطبيق طلبات (Talabat) — تسوية الشركة</div>
    ${row("اجمالى مبيعات طلبات", (data.talabatGross || 0).toFixed(2))}
    ${row(`عمولة طلبات (${data.talabatCommissionPercent || 25}%)`, `-${(data.talabatCommission || 0).toFixed(2)}`)}
    ${row("صافى المستحق من طلبات", (data.talabatNet || 0).toFixed(2), true)}
    ${row("عدد فواتير طلبات", String(data.talabatCount || 0))}
    <div style="font-size:9.5px;color:#78350f;padding:2px 4px;text-align:center;">* مبيعات طلبات تسوّى مع الشركة وخارج درج الكاشير</div>
    ` : ""}

    <div class="div-line"></div>
    ${row("صافى مبيعات الاصناف (حلويات ومخبوزات)", (data.productSalesOnly ?? Math.max(0, data.grandTotalSales - data.deliveryFees)).toFixed(2), true)}
    ${row("اجمالى المبيعات والتحصيل (شامل التوصيل)", data.grandTotalSales.toFixed(2), true)}
    <div class="div-line"></div>
    ${row("اجمالى الفرق", data.difference.toFixed(2), true)}
  </div>

  <div class="footer-ts" dir="ltr">${formatTimeAMPM(now)} &nbsp; ${formatDateDMY(now)}</div>
</body>
</html>`;
}

/**
 * 4. Combined Daily Report (Financial Summary + Items Breakdown in ONE continuous print!)
 * Solves Item 6: Prevents opening a first blank window and then a second window!
 */
export function generateCombinedDailyReportHtml(data: DailyReportPayload): string {
  const now = new Date();
  const row = (label: string, value: string, bold = false) => `
    <div class="f-row ${bold ? "f-bold" : ""}">
      <span>${label}</span>
      <span dir="ltr" class="f-val">${value}</span>
    </div>
  `;

  const sectionsHtml = (data.categories || [])
    .map(
      (cat) => `
      <div class="cat-title">قسم ${cat.categoryName}</div>
      <table class="cat-tbl">
        <thead>
          <tr>
            <th style="width:56%;">الصنف</th>
            <th style="width:18%;">الكمية</th>
            <th style="width:26%;">الاجمالى</th>
          </tr>
        </thead>
        <tbody>
          ${cat.items
            .map(
              (it) => `
            <tr>
              <td style="text-align:right;font-weight:600;padding:2.5px 3px;">${it.name}</td>
              <td style="text-align:center;font-family:monospace;font-weight:800;">${it.qty}</td>
              <td style="text-align:center;font-family:monospace;font-weight:900;">${it.total.toFixed(0)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <div class="cat-sub">
        <span>إجمالي قسم ${cat.categoryName}</span>
        <span style="font-family:monospace;">${cat.totalQty} ق</span>
        <span style="font-family:monospace;">${cat.totalAmount.toFixed(0)} ج</span>
      </div>
    `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>تقرير مبيعات اليوم الشامل — حلواني أبو عادل</title>
  <style>
    ${COMMON_THERMAL_CSS}
    .title { text-align: center; font-size: 15px; font-weight: 900; margin-bottom: 2px; }
    .subtitle { text-align: center; font-size: 11px; font-weight: 800; margin-bottom: 5px; }
    .box { border: 1.5px solid #000; }
    .sec-head {
      text-align: center;
      font-weight: 900;
      font-size: 11px;
      padding: 3px;
      border-top: 1.5px solid #000;
      border-bottom: 1px solid #000;
      background: #f1f5f9 !important;
    }
    .f-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 4px;
      font-size: 10.5px;
      font-weight: 700;
    }
    .f-bold { font-weight: 900; font-size: 11.5px; }
    .f-val { font-family: monospace; font-weight: 800; }
    .div-line { border-top: 1px solid #000; margin: 2px 0; }
    .part-divider {
      border-top: 2px dashed #000;
      margin: 10px 0 6px;
      padding-top: 6px;
      text-align: center;
      font-weight: 900;
      font-size: 12px;
    }
    .cat-title { text-align: center; font-size: 11.5px; font-weight: 900; margin: 5px 0 2px; background: #e2e8f0; padding: 2px; }
    table.cat-tbl { width: 100%; border-collapse: collapse; font-size: 10px; }
    table.cat-tbl th {
      background: #000 !important;
      color: #fff !important;
      padding: 3px 2px;
      border: 1px solid #000;
      font-weight: 900;
      text-align: center;
    }
    table.cat-tbl td { border: 1px solid #000; padding: 2.5px 2px; }
    .cat-sub {
      display: flex;
      justify-content: space-between;
      padding: 2.5px 4px;
      font-size: 10.5px;
      font-weight: 900;
      border-bottom: 1.5px dashed #000;
      margin-bottom: 3px;
    }
    .footer-ts {
      text-align: center;
      font-family: monospace;
      font-size: 10px;
      font-weight: 900;
      margin-top: 6px;
    }
  </style>
</head>
<body>
  <div class="title">حلواني أبو عادل 🍰</div>
  <div class="subtitle">${data.dateStr?.includes("إلى") ? "تقرير مبيعات الفترة الشامل" : "التقرير المالي والورديات اليومي"}</div>
  <div style="text-align:center;font-size:10.5px;font-weight:800;margin-bottom:4px;">${data.shiftLabel}</div>

  <div class="box">
    ${row("يوم رقم", data.reportNumber, true)}
    ${row("التاريخ", data.dateStr)}
    <div class="div-line"></div>
    ${row("وقت فتح الوردية", data.openedAt || formatDateDMY(now))}
    ${row("قام بفتح الوردية", data.openedBy || "كاشير أبو عادل")}
    ${row("الرصيد عند فتح اليوم", data.openingBalance.toFixed(2))}
    <div class="div-line"></div>
    ${row("وقت غلق الوردية", data.closedAt || `${formatDateDMY(now)} ${formatTimeAMPM(now)}`)}
    ${row("قام بغلق الوردية", data.closedBy || "كاشير أبو عادل")}
    ${row("الرصيد عند غلق اليوم", data.closingBalance.toFixed(2))}
    <div class="div-line"></div>
    ${row("اجمالى الحركة بالدرج", data.totalMovement.toFixed(2), true)}

    <div class="sec-head">تفاصيل إيرادات وطرق الدفع بالدرج</div>
    ${row("Cash (كاش الدرج)", data.cash.toFixed(2))}
    ${row("Visa (فيزا)", data.visa.toFixed(2))}
    ${row("Insta Pay (إنستاباي)", data.instapay.toFixed(2))}
    ${row("Vodafone Cash (محفظة كاش)", data.vodafoneCash.toFixed(2))}
    ${row("Staff (موظفين)", data.staff.toFixed(2))}
    ${row("ضيافة", data.hospitality.toFixed(2))}
    ${row("آجل", data.credit.toFixed(2))}

    <div class="div-line"></div>
    ${row("اجمالى المصروفات", data.expenses.toFixed(2))}
    ${row("اجمالى مرتجع المبيعات", data.returnsTotal.toFixed(2))}
    ${row("عدد فواتير المرتجع", String(data.returnsCount))}

    <div class="div-line"></div>
    ${row("قيمة مبيعات تيك اوي", data.takeawaySales.toFixed(2))}
    ${row("عدد الفواتير التيك اوي", String(data.takeawayCount))}
    <div class="div-line"></div>
    ${row("مبيعات اصناف الدليفري", (data.deliveryFoodSales ?? Math.max(0, data.deliverySales - data.deliveryFees)).toFixed(2))}
    ${row("رسوم خدمة التوصيل", data.deliveryFees.toFixed(2))}
    ${row("اجمالى مبيعات الدليفري", data.deliverySales.toFixed(2))}
    ${row("عدد الفواتير الدليفري", String(data.deliveryCount))}

    ${(data.talabatGross || 0) > 0 ? `
    <div class="sec-head" style="background:#fed7aa !important; color:#7c2d12;">حسابات تطبيق طلبات (Talabat) — تسوية الشركة</div>
    ${row("اجمالى مبيعات طلبات", (data.talabatGross || 0).toFixed(2))}
    ${row(`عمولة طلبات (${data.talabatCommissionPercent || 25}%)`, `-${(data.talabatCommission || 0).toFixed(2)}`)}
    ${row("صافى المستحق من طلبات", (data.talabatNet || 0).toFixed(2), true)}
    ${row("عدد فواتير طلبات", String(data.talabatCount || 0))}
    ` : ""}

    <div class="div-line"></div>
    ${row("صافى مبيعات الاصناف (حلويات ومخبوزات)", (data.productSalesOnly ?? Math.max(0, data.grandTotalSales - data.deliveryFees)).toFixed(2), true)}
    ${row("اجمالى المبيعات والتحصيل (شامل التوصيل)", data.grandTotalSales.toFixed(2), true)}
    <div class="div-line"></div>
    ${row("اجمالى الفرق", data.difference.toFixed(2), true)}
  </div>

  <div class="part-divider">
    <span>🍰 تفصيل مبيعات الأصناف مقسمة بالأقسام</span>
  </div>

  ${
    sectionsHtml ||
    '<div style="text-align:center;padding:10px;font-size:10.5px;color:#444;font-weight:bold;">لا توجد أصناف مباعة مسجلة في هذه الفترة</div>'
  }

  <div class="footer-ts" dir="ltr">
    طُبع في: ${formatTimeAMPM(now)} &nbsp; ${formatDateDMY(now)} • حلواني أبو عادل
  </div>
</body>
</html>`;
}

/**
 * 5. Supplier Account Statement (كشف حساب الموردين التفصيلي)
 * Solves Item 4: Fixes blank white print!
 */
export function generateSupplierStatementPrintHtml(
  supplier: any,
  transactions: any[],
  settings?: any
): string {
  const now = new Date();
  const address = settings?.cafeAddress || "101 شارع زمزم خلف مسجد الشيخ غراب - حدائق القبة";
  const phone = settings?.abuAdelPhone || settings?.whatsapp || "01146862114";

  const rows = (transactions || []).map((tx) => {
    const d = tx.createdAt ? new Date(tx.createdAt) : now;
    const dateStr = formatDateDMY(d);
    const debit = Number(tx.debit || 0); // مستحق له (فاتورة توريد)
    const credit = Number(tx.credit || 0); // مسدد له (دفعة سداد)
    const bal = Number(tx.balanceAfter || 0);
    return `
      <tr>
        <td style="text-align:center;font-family:monospace;padding:3px;">${dateStr}</td>
        <td style="text-align:right;font-weight:700;padding:3px;">
          ${tx.invoiceNumber ? `إذن #${tx.invoiceNumber} — ` : ""}${tx.notes || tx.movementType || "حركة توريد"}
        </td>
        <td style="text-align:center;font-family:monospace;font-weight:700;color:#047857;">${debit > 0 ? debit.toFixed(2) : "—"}</td>
        <td style="text-align:center;font-family:monospace;font-weight:700;color:#b91c1c;">${credit > 0 ? credit.toFixed(2) : "—"}</td>
        <td style="text-align:center;font-family:monospace;font-weight:900;">${bal.toFixed(2)}</td>
      </tr>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>كشف حساب مورد — ${supplier.name}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body {
      font-family: "Segoe UI", Tahoma, Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: #0f172a;
      direction: rtl;
      font-size: 12px;
      line-height: 1.4;
    }
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 10px;
      margin-bottom: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-title { font-size: 22px; font-weight: 900; color: #000; margin: 0; }
    .brand-sub { font-size: 11px; color: #475569; font-weight: bold; margin-top: 2px; }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 900;
    }
    .meta-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 14px;
      margin-bottom: 15px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
    }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11px; }
    th {
      background: #0f172a;
      color: #fff;
      padding: 6px 4px;
      border: 1px solid #0f172a;
      font-weight: 900;
      text-align: center;
    }
    td {
      border: 1px solid #cbd5e1;
      padding: 5px 4px;
      vertical-align: middle;
    }
    tr:nth-child(even) { background: #f8fafc; }
    .footer {
      margin-top: 25px;
      border-top: 1px solid #cbd5e1;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="brand-title">حلواني أبو عادل 🍰</h1>
      <div class="brand-sub">أصل الحلويات الشرقية والغربية والتورت • ${address} • ${phone}</div>
    </div>
    <div class="badge">كشف حساب مورد تفصيلي 📜</div>
  </div>

  <div class="meta-box">
    <div>
      <div style="color:#64748b;font-size:10px;">اسم المورد / المصنع:</div>
      <div style="font-weight:900;font-size:14px;color:#0f172a;">${supplier.name}</div>
    </div>
    <div>
      <div style="color:#64748b;font-size:10px;">رصيد أول المدة:</div>
      <div style="font-weight:900;font-size:13px;font-family:monospace;">${Number(supplier.openingBalance || 0).toFixed(2)} ج.م</div>
    </div>
    <div>
      <div style="color:#64748b;font-size:10px;">الرصيد الختامي المستحق للمورد:</div>
      <div style="font-weight:900;font-size:15px;color:#b91c1c;font-family:monospace;">${Number(supplier.currentBalance || 0).toFixed(2)} ج.م</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:14%;">التاريخ</th>
        <th style="width:42%;">البيان ونوع الحركة / رقم الإذن</th>
        <th style="width:14%;">مستحق له (فاتورة)</th>
        <th style="width:14%;">مسدد له (دفعة)</th>
        <th style="width:16%;">الرصيد التراكمي</th>
      </tr>
    </thead>
    <tbody>
      ${rows || '<tr><td colspan="5" style="text-align:center;padding:15px;color:#64748b;">لا توجد حركات مسجلة لهذا المورد حتى الآن</td></tr>'}
    </tbody>
  </table>

  <div class="footer">
    <div>طُبع بتاريخ: ${formatDateDMY(now)} — ${formatTimeAMPM(now)}</div>
    <div>توقيع المحاسب / الإدارة: ..........................</div>
    <div>توقيع واستلام المورد: ..........................</div>
  </div>
</body>
</html>`;
}

/**
 * 6. Daily Brief & Cashier Audit Report (التقرير اليومي الشامل للمدير وطلبية المصنع)
 * Solves Item 7: Fixes blank white print!
 */
export function generateDailyBriefPrintHtml(briefData: any, settings?: any): string {
  const now = new Date();
  const dateStr = briefData?.dateStr || formatDateDMY(now);
  const audit = briefData?.branchAudit?.[0] || {};
  const products = briefData?.abuAdelReplenishment || briefData?.abuAdelProducts || [];

  const productRows = products.map((p: any) => `
    <tr>
      <td style="text-align:right;font-weight:700;padding:3px;">${p.nameAr || p.name || ""}</td>
      <td style="text-align:center;font-family:monospace;font-weight:700;">${p.dailyProductionLimit || p.productionCap || 0}</td>
      <td style="text-align:center;font-family:monospace;font-weight:700;color:#047857;">${p.dailySales || p.salesToday || p.soldToday || 0}</td>
      <td style="text-align:center;font-family:monospace;font-weight:700;">${p.currentStock || p.stock || 0}</td>
      <td style="text-align:center;font-family:monospace;font-weight:900;color:#b91c1c;background:#fff1f2;">
        ${p.tomorrowFactoryNeeded || p.totalFactoryOrderSuggested || p.suggestedOrder || 0}
      </td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>التقرير اليومي الشامل للمدير — حلواني أبو عادل</title>
  <style>
    ${COMMON_THERMAL_CSS}
    .title { text-align: center; font-size: 14px; font-weight: 900; margin-bottom: 2px; }
    .subtitle { text-align: center; font-size: 10.5px; font-weight: 800; margin-bottom: 5px; }
    .box { border: 1.5px solid #000; margin-bottom: 6px; }
    .sec-head {
      text-align: center;
      font-weight: 900;
      font-size: 11px;
      padding: 2.5px;
      background: #f1f5f9;
      border-top: 1px solid #000;
      border-bottom: 1px solid #000;
    }
    .row { display: flex; justify-content: space-between; padding: 2px 4px; font-size: 10px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; font-size: 9.5px; margin-top: 3px; }
    th { background: #000; color: #fff; padding: 2.5px 1px; border: 1px solid #000; text-align: center; font-weight: 900; }
    td { border: 1px solid #000; padding: 2px 1px; }
  </style>
</head>
<body>
  <div class="title">حلواني أبو عادل 🍰</div>
  <div class="subtitle">التقرير اليومي الشامل للمدير وطلبية المصنع</div>
  <div style="text-align:center;font-size:10px;font-weight:800;margin-bottom:4px;">تاريخ اليومية: ${dateStr}</div>

  <div class="box">
    <div class="sec-head">1. مراجعة الخزنة ودرج الكاشير والمبيعات</div>
    <div class="row"><span>صافي مبيعات اليوم:</span><span dir="ltr" style="font-family:monospace;font-weight:900;">${Number(audit.storeRevenue || 0).toFixed(2)} ج</span></div>
    <div class="row"><span>كاش بالدرج:</span><span dir="ltr" style="font-family:monospace;font-weight:800;">${Number(audit.cashSales || 0).toFixed(2)} ج</span></div>
    <div class="row"><span>فيزا / كروت:</span><span dir="ltr" style="font-family:monospace;">${Number(audit.visaSales || 0).toFixed(2)} ج</span></div>
    <div class="row"><span>إنستاباي:</span><span dir="ltr" style="font-family:monospace;">${Number(audit.instapaySales || 0).toFixed(2)} ج</span></div>
    <div class="row"><span>فودافون كاش:</span><span dir="ltr" style="font-family:monospace;">${Number(audit.vodafoneSales || 0).toFixed(2)} ج</span></div>
    <div class="row"><span>طلبات (Talabat خارج الدرج):</span><span dir="ltr" style="font-family:monospace;">${Number(audit.talabatSales || 0).toFixed(2)} ج</span></div>
    <div class="row"><span>رسوم الدليفري (للطيارين):</span><span dir="ltr" style="font-family:monospace;color:#047857;">${Number(audit.deliveryFeesTotal || 0).toFixed(2)} ج</span></div>
    <div class="row"><span>إجمالي المصروفات:</span><span dir="ltr" style="font-family:monospace;color:#b91c1c;">${Number(audit.expensesTotal || 0).toFixed(2)} ج</span></div>
    <div class="row" style="background:#fef3c7;border-top:1px solid #000;font-weight:900;">
      <span>الدرج المتوقع الآن:</span>
      <span dir="ltr" style="font-family:monospace;font-size:11.5px;">${Number(audit.expectedCashInDrawer || 0).toFixed(2)} ج.م</span>
    </div>
  </div>

  <div class="box">
    <div class="sec-head">2. كشف طلبية المصنع المطلوبة لتغطية الغد</div>
    <table>
      <thead>
        <tr>
          <th style="width:38%;">الصنف</th>
          <th style="width:14%;">الحد</th>
          <th style="width:16%;">المباع</th>
          <th style="width:14%;">الرصيد</th>
          <th style="width:18%;">مطلوب غداً</th>
        </tr>
      </thead>
      <tbody>
        ${productRows || '<tr><td colspan="5" style="text-align:center;padding:5px;">لا توجد أصناف مسجلة</td></tr>'}
      </tbody>
    </table>
  </div>

  <div style="text-align:center;font-size:9.5px;color:#555;margin-top:4px;">
    طُبع: ${formatTimeAMPM(now)} • حلواني أبو عادل
  </div>
</body>
</html>`;
}
