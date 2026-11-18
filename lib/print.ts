/**
 * Soulmate Dessert & Coffee — Exact-Replica 80mm Thermal Print Engine
 * Prints via hidden iframe with `@page { size: 80mm auto; margin: 0 }` so
 * browser URLs/dates never appear and text is never clipped on thermal rolls.
 */

export function printThermalHtml(html: string) {
  if (typeof window === "undefined") return;
  try {
    let iframe = document.getElementById("__soulmate_print_frame__") as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "__soulmate_print_frame__";
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
        console.error("[Soulmate Print Error]", e);
      }
    }, 280);
  } catch (err) {
    console.error("[Soulmate Print Engine]", err);
  }
}

const COMMON_THERMAL_CSS = `
  @page {
    size: 80mm auto;
    margin: 0mm !important;
  }
  * {
    box-sizing: border-box !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  html, body {
    width: 72mm;
    max-width: 72mm;
    margin: 0 auto !important;
    padding: 1.5mm 1.5mm 4mm 1.5mm !important;
    background: #ffffff !important;
    color: #000000 !important;
    font-family: "Segoe UI", Tahoma, Arial, sans-serif !important;
    direction: rtl;
    font-size: 11px;
    line-height: 1.3;
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
  const suffix = h24 >= 12 ? "P" : "A";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${suffix} ${String(h12).padStart(2, "0")}:${min}`;
}

function formatTimeAMPM(d: Date): string {
  const h24 = d.getHours();
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${suffix} ${String(h12).padStart(2, "0")}:${min}`;
}

function paymentLabelEn(method?: string): string {
  switch ((method || "CASH").toUpperCase()) {
    case "CARD":
    case "VISA":
      return "Visa";
    case "INSTAPAY":
      return "InstaPay";
    case "VODAFONE_CASH":
      return "Vodafone Cash";
    case "STAFF":
      return "Staff";
    case "HOSPITALITY":
      return "ضيافة";
    case "CREDIT":
      return "اجل";
    default:
      return "Cash";
  }
}

/**
 * 1. Exact Replica of Soulmate Customer Receipt (Photo 7)
 */
export function generateSoulmateReceiptHtml(order: any, settings?: any): string {
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
  const deliveryFee = Number(order.deliveryFee ?? 0);
  const finalAmount = Number(order.finalAmount ?? subtotal - discount + deliveryFee);

  const ticketNo =
    order.dailyTicketNo ||
    String(order.orderNumber || "1").replace(/\D/g, "").slice(-5) ||
    "1";

  const isPreOrder = Boolean(order.isScheduled);
  const numberLabel = isPreOrder ? "رقم الحجز" : "رقم الفاتورة";
  const sectionBanner = isPreOrder
    ? "الحجوزات"
    : order.orderType === "DELIVERY"
    ? "دليفري"
    : "تيك أواي";

  const formatDateSlash = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  const formatTime24 = (d: Date) =>
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

  const scheduledDateObj = order.scheduledFor ? new Date(order.scheduledFor) : null;
  const address = settings?.cafeAddress || "حدائق القبة - القاهرة";
  const phone = settings?.hotline || settings?.abuAdelPhone || "15992";
  const payCodeEn = paymentLabelEn(order.paymentMethod).toUpperCase();

  const rowsHtml = items
    .map((it) => {
      const qty = Number(it.qty) || 1;
      const price = Number(it.price) || 0;
      const lineTotal = (price * qty).toFixed(2);
      const displayName = it.nameAr || it.nameEn || "صنف";
      const noteLine = it.notes ? `<div style="font-size:9px;color:#222;margin-top:1px;">* ${it.notes}</div>` : "";
      return `
        <tr>
          <td class="col-item">${displayName}${noteLine}</td>
          <td class="col-num">${price.toFixed(2)}</td>
          <td class="col-num">${qty.toFixed(3)}</td>
          <td class="col-num" style="font-weight:800;">${lineTotal}</td>
        </tr>
      `;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>فاتورة حلواني أبو عادل</title>
  <style>
    ${COMMON_THERMAL_CSS}
    .logo-wrap { text-align: center; margin-bottom: 6px; }
    .brand-ar { font-size: 22px; font-weight: 900; line-height: 1.05; letter-spacing: 0.2px; }
    .brand-sub { font-size: 11px; font-weight: 800; margin-top: 1px; }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin: 4px 0 6px;
      font-size: 11px;
      font-weight: 700;
    }
    .meta-table td { padding: 2px 2px; vertical-align: middle; }
    .meta-label { width: 30%; text-align: right; font-weight: 800; }
    .meta-val { text-align: center; font-weight: 700; }
    .meta-left { width: 26%; text-align: left; font-family: monospace; font-weight: 900; font-size: 12px; }
    .ticket-box {
      display: inline-block;
      border: 1.5px solid #000;
      padding: 1px 10px;
      font-family: monospace;
      font-size: 13px;
      font-weight: 900;
    }
    .cust-phone {
      text-align: center;
      font-family: monospace;
      font-size: 12.5px;
      font-weight: 900;
      margin: 3px 0 2px;
      letter-spacing: 0.5px;
    }
    .section-title {
      text-align: center;
      font-size: 14px;
      font-weight: 900;
      margin: 2px 0 6px;
      padding-bottom: 3px;
      border-bottom: 1.5px solid #000;
    }
    table.abuadel-tbl {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin-top: 2px;
    }
    table.abuadel-tbl th {
      border-top: 1px solid #000;
      border-bottom: 1.5px solid #000;
      border-left: 1px solid #000;
      border-right: 1px solid #000;
      padding: 3px 2px;
      font-weight: 900;
      text-align: center;
    }
    table.abuadel-tbl td {
      border-left: 1px solid #000;
      border-right: 1px solid #000;
      padding: 2.5px 3px;
      vertical-align: top;
    }
    table.abuadel-tbl tbody tr:last-child td {
      border-bottom: 1.5px solid #000;
    }
    .col-item { text-align: right; font-weight: 700; width: 44%; }
    .col-num { text-align: center; font-family: monospace; font-size: 10px; }
    .sum-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3px 4px;
      border-bottom: 1px solid #000;
      font-weight: 800;
      font-size: 11px;
    }
    .sum-thick {
      border-top: 1.5px solid #000;
      border-bottom: 1.5px solid #000;
      margin-top: 5px;
      font-size: 12px;
      font-weight: 900;
    }
    .net-box {
      border: 1.5px solid #000;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 8px;
      margin-top: 5px;
      font-size: 14px;
      font-weight: 900;
    }
    .footer-block {
      text-align: center;
      margin-top: 7px;
      padding-top: 4px;
      border-top: 1px dashed #000;
      font-size: 10.5px;
      font-weight: 700;
      line-height: 1.45;
    }
  </style>
</head>
<body>
  <!-- Authentic Abu Adel Circular Monogram Emblem (Photo 3 Replica) -->
  <div class="logo-wrap">
    <svg width="56" height="56" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:0 auto 2px;">
      <circle cx="40" cy="40" r="35" fill="none" stroke="#000" stroke-width="3.5" />
      <circle cx="40" cy="40" r="29" fill="none" stroke="#000" stroke-width="1.4" />
      <text x="40" y="54" text-anchor="middle" font-family="Tahoma, Arial, sans-serif" font-size="44" font-weight="900" fill="#000">ع</text>
      <text x="72" y="18" font-family="Arial, sans-serif" font-size="8" font-weight="900" fill="#000">TM</text>
    </svg>
    <div class="brand-ar">أبو عادل</div>
    <div class="brand-sub">حلّي يومك</div>
  </div>

  <!-- Exact Photo 3 Metadata Block -->
  <table class="meta-table">
    <tr>
      <td class="meta-label">${numberLabel}</td>
      <td class="meta-val"><span class="ticket-box">${ticketNo}</span></td>
      <td class="meta-left">${payCodeEn}</td>
    </tr>
    <tr>
      <td class="meta-label">التاريخ</td>
      <td class="meta-val" dir="ltr">${formatDateSlash(created)}</td>
      <td class="meta-left" dir="ltr">${formatTime24(created)}</td>
    </tr>
    <tr>
      <td class="meta-label">الكاشير</td>
      <td class="meta-val" colspan="2">${order.cashierName || "كاشير أبو عادل"}</td>
    </tr>
    ${
      scheduledDateObj
        ? `<tr>
            <td class="meta-label">تاريخ الاستلام</td>
            <td class="meta-val" dir="ltr">${formatDateSlash(scheduledDateObj)}</td>
            <td class="meta-left" dir="ltr">${formatTime24(scheduledDateObj)}</td>
          </tr>`
        : ""
    }
    ${
      order.customerName
        ? `<tr>
            <td class="meta-label">اسم العميل</td>
            <td class="meta-val" colspan="2">${order.customerName}</td>
          </tr>`
        : ""
    }
  </table>

  ${order.customerPhone ? `<div class="cust-phone" dir="ltr">${order.customerPhone}</div>` : ""}
  ${
    order.deliveryAddress
      ? `<div style="text-align:center;font-size:10px;font-weight:700;margin-bottom:3px;">${order.deliveryAddress}</div>`
      : ""
  }

  <div class="section-title">${sectionBanner}${isPreOrder ? (order.orderType === "DELIVERY" ? " (دليفري)" : " (استلام فرع)") : ""}</div>

  ${
    order.notes
      ? `<div style="border:1px dashed #000;padding:3px 5px;margin-bottom:5px;font-size:10px;font-weight:700;">ملاحظة: ${order.notes}</div>`
      : ""
  }

  <!-- Exact Photo 3 4-Column Vertical-Lined Items Table -->
  <table class="abuadel-tbl">
    <thead>
      <tr>
        <th style="width:44%;">ITEM</th>
        <th style="width:18%;">السعر</th>
        <th style="width:17%;">كمية</th>
        <th style="width:21%;">اجمالي</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="sum-line sum-thick">
    <span>الاجمالي</span>
    <span style="font-family:monospace;">${totalQty.toFixed(3)}</span>
    <span style="font-family:monospace;">${subtotal.toFixed(2)}</span>
  </div>

  ${
    discount > 0 || deliveryFee > 0
      ? `<div class="sum-line">
          <span>الخصم: ${discount.toFixed(2)}</span>
          <span>التوصيل: ${deliveryFee.toFixed(2)}</span>
        </div>`
      : ""
  }

  ${
    Number(order.depositPaid || 0) > 0 || Number(order.depositRequired || 0) > 0
      ? `<div class="sum-line">
          <span>العربون: ${Number(order.depositPaid || 0).toFixed(2)}</span>
          <span>المتبقي: ${Math.max(0, finalAmount - Number(order.depositPaid || 0)).toFixed(2)}</span>
        </div>`
      : ""
  }

  <div class="net-box">
    <span>الصافي</span>
    <span style="font-family:monospace;">${finalAmount.toFixed(2)}</span>
  </div>

  <div class="footer-block">
    <div style="font-size:12px;font-weight:900;">حلواني أبو عادل — حلّي يومك</div>
    <div>${address}</div>
    <div style="font-family:monospace;font-size:12px;font-weight:900;">الخط الساخن: ${phone}</div>
  </div>
</body>
</html>`;
}

export const generateAbuAdelReceiptHtml = generateSoulmateReceiptHtml;

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
  deliveryCount: number;
  deliveryFees: number;
  grandTotalSales: number;
  difference: number;
  categories: DailyReportCategorySection[];
}

/**
 * 2. Exact Replica of Photo 9 — Daily/Shift Items Breakdown by Category
 */
export function generateDailyItemsReportHtml(data: DailyReportPayload): string {
  const sectionsHtml = data.categories
    .map(
      (cat) => `
      <div class="cat-title">قسم &nbsp; ${cat.categoryName}</div>
      <table class="cat-tbl">
        <thead>
          <tr>
            <th style="width:58%;">الصنف</th>
            <th style="width:18%;">الكمية</th>
            <th style="width:24%;">الاجمالى</th>
          </tr>
        </thead>
        <tbody>
          ${cat.items
            .map(
              (it) => `
            <tr>
              <td style="text-align:center;font-weight:600;">${it.name}</td>
              <td style="text-align:center;font-family:monospace;font-weight:700;">${it.qty}</td>
              <td style="text-align:center;font-family:monospace;font-weight:700;">${it.total.toFixed(0)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <div class="cat-sub">
        <span>اجمالى القسم ${cat.categoryName}</span>
        <span style="font-family:monospace;">${cat.totalQty}</span>
        <span style="font-family:monospace;">${cat.totalAmount.toFixed(0)}</span>
      </div>
    `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>تقرير مبيعات الأصناف</title>
  <style>
    ${COMMON_THERMAL_CSS}
    .title { text-align: center; font-size: 16px; font-weight: 900; margin-bottom: 2px; }
    .subtitle { text-align: center; font-size: 12px; font-weight: 800; margin-bottom: 8px; }
    .cat-title { text-align: center; font-size: 13px; font-weight: 900; margin: 8px 0 3px; }
    table.cat-tbl { width: 100%; border-collapse: collapse; font-size: 10.5px; }
    table.cat-tbl th {
      background: #000 !important;
      color: #fff !important;
      padding: 4px 3px;
      border: 1px solid #000;
      font-weight: 900;
      text-align: center;
    }
    table.cat-tbl td {
      border: 1px solid #000;
      padding: 3px 3px;
    }
    .cat-sub {
      display: flex;
      justify-content: space-between;
      padding: 3px 6px;
      font-size: 11px;
      font-weight: 900;
      border-bottom: 1.5px dashed #000;
      margin-bottom: 4px;
    }
  </style>
</head>
<body>
  <div class="title">تقرير مبيعات اليوم</div>
  <div class="subtitle">وردية رقم: ${data.reportNumber} (${data.shiftLabel})</div>
  ${sectionsHtml || '<div style="text-align:center;padding:12px;">لا توجد مبيعات مسجلة في هذه الفترة</div>'}
</body>
</html>`;
}

/**
 * 3. Exact Replica of Photo 10 — Daily/Shift Financial Summary Report
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
  <title>تقرير مبيعات اليوم - الملخص المالي</title>
  <style>
    ${COMMON_THERMAL_CSS}
    .title { text-align: center; font-size: 16px; font-weight: 900; margin-bottom: 6px; }
    .box { border: 1.5px solid #000; }
    .sec-head {
      text-align: center;
      font-weight: 900;
      font-size: 11.5px;
      padding: 4px;
      border-top: 1.5px solid #000;
      border-bottom: 1px solid #000;
      background: #f1f5f9 !important;
    }
    .f-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2.5px 6px;
      font-size: 11px;
      font-weight: 700;
    }
    .f-bold { font-weight: 900; font-size: 12px; }
    .f-val { font-family: monospace; font-weight: 800; }
    .div-line { border-top: 1px solid #000; margin: 2px 0; }
    .footer-ts {
      text-align: center;
      font-family: monospace;
      font-size: 11px;
      font-weight: 900;
      margin-top: 6px;
    }
  </style>
</head>
<body>
  <div class="title">تقرير مبيعات اليوم</div>
  <div style="text-align:center;font-size:11px;font-weight:800;margin-bottom:5px;">${data.shiftLabel}</div>

  <div class="box">
    ${row("يوم رقم", data.reportNumber, true)}
    ${row("التاريخ", data.dateStr)}
    <div class="div-line"></div>
    ${row("وقت فتح اليوم", data.openedAt || formatDateDMY(now))}
    ${row("قام بفتح الوردية", data.openedBy)}
    ${row("الرصيد عند فتح اليوم", data.openingBalance.toFixed(2))}
    <div class="div-line"></div>
    ${row("وقت غلق الوردية", data.closedAt || `${formatDateDMY(now)} ${formatTimeAMPM(now)}`)}
    ${row("قام بغلق اليوم", data.closedBy)}
    ${row("الرصيد عند غلق اليوم", data.closingBalance.toFixed(2))}
    <div class="div-line"></div>
    ${row("اجمالى الحركة", data.totalMovement.toFixed(2), true)}

    <div class="sec-head">تفاصيل ايرادات مبيعات اليوم</div>
    ${row("Cash", data.cash.toFixed(2))}
    ${row("Visa", data.visa.toFixed(2))}
    ${row("Insta Pay", data.instapay.toFixed(2))}
    ${row("Vodafone Cash", data.vodafoneCash.toFixed(2))}
    ${row("Staff", data.staff.toFixed(2))}
    ${row("ضيافة", data.hospitality.toFixed(2))}
    ${row("اجل", data.credit.toFixed(2))}
    ${row("Tips", data.tips.toFixed(2))}

    <div class="div-line"></div>
    ${row("اجمالى المصروفات", data.expenses.toFixed(2))}
    ${row("اجمالى مرتجع المبيعات", data.returnsTotal.toFixed(2))}
    ${row("عدد فواتير المرتجع", String(data.returnsCount))}
    <div class="div-line"></div>
    ${row("اجمالى المشتريات", data.purchasesTotal.toFixed(2))}
    ${row("اجمالى مرتجع المشتريات", data.purchaseReturnsTotal.toFixed(2))}
    ${row("اجمالى الكميات المحذوفة", String(data.deletedQty))}

    <div class="div-line"></div>
    ${row("قيمة مبيعات تيك اوي", data.takeawaySales.toFixed(2))}
    ${row("عدد الفواتير التيك اوي", String(data.takeawayCount))}
    <div class="div-line"></div>
    ${row("قيمة مبيعات الصالة", data.dineInSales.toFixed(2))}
    ${row("عدد الفواتير الصالة", String(data.dineInCount))}
    ${row("قيمة خدمة الصالة", data.dineInService.toFixed(2))}
    <div class="div-line"></div>
    ${row("قيمة مبيعات الدليفري", data.deliverySales.toFixed(2))}
    ${row("عدد الفواتير الدليفري", String(data.deliveryCount))}
    ${row("قيمة خدمة التوصيل", data.deliveryFees.toFixed(2))}

    <div class="div-line"></div>
    ${row("اجمالى قيمة المبيعات", data.grandTotalSales.toFixed(2), true)}
    <div class="div-line"></div>
    ${row("اجمالى الفرق", data.difference.toFixed(2), true)}
  </div>

  <div class="footer-ts" dir="ltr">${formatTimeAMPM(now)} &nbsp; ${formatDateDMY(now)}</div>
</body>
</html>`;
}
