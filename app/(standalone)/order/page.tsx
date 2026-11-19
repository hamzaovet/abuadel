"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Cake,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Search,
  Bike,
  Store,
  CalendarClock,
  MapPin,
  Phone,
  User,
  StickyNote,
  Sparkles,
  Copy,
  Check,
  MessageCircle,
  Banknote,
  Zap,
  Smartphone,
  Bell,
  Home,
  ChevronUp,
  X,
  Clock,
} from "lucide-react";
import { getCategoryLabel } from "@/lib/categories";
import { ThemeToggle } from "@/components/ThemeProviderAndToggle";
import {
  registerAudioUnlockListeners,
  playCustomerUpdateChime,
  requestBrowserNotificationPermission,
  showBrowserNotification,
} from "@/lib/alertSound";

interface MenuItem {
  id: string;
  outletId: string;
  nameAr: string;
  nameEn?: string | null;
  category: string;
  price: number;
  unitType?: string;
  image?: string | null;
  itemType: string;
  isAvailable: boolean;
}

interface CartItem {
  menuItemId: string;
  nameAr: string;
  nameEn?: string | null;
  price: number;
  qty: number;
  unitType?: string;
  category: string;
  itemType: string;
  notes?: string;
}

interface DeliveryZone {
  id: string;
  nameAr: string;
  fee: number;
  estimatedTime?: string | null;
}

const ACTIVE_ORDER_STORAGE_KEY = "abuadel_active_order_id";

function normalizeEgyptWa(phone?: string | null): string {
  const digits = String(phone || "01018671000").replace(/[^\d]/g, "");
  if (digits.startsWith("20") && digits.length >= 12) return digits;
  if (digits.startsWith("0")) return `2${digits}`;
  return `20${digits}`;
}

function getTomorrowYMD() {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getStatusMeta(status?: string, orderType?: string) {
  switch (status) {
    case "NEW_PENDING":
      return {
        step: 1,
        label: "تم استلام طلبك — جاري مراجعته وتأكيده الآن ⏳",
        color: "amber",
      };
    case "PREPARING":
      return {
        step: 2,
        label: "جاري تجهيز وتغليف حلوياتك الطازجة الآن 🍰✨",
        color: "sky",
      };
    case "READY_TO_SERVE":
      return {
        step: 3,
        label:
          orderType === "TAKEAWAY"
            ? "طلبك جاهز الآن — يمكنك استلامه من المحل مباشرة ✅"
            : "طلبك جاهز ومغلّف وفي انتظار خروج الطيار ✅",
        color: "emerald",
      };
    case "OUT_FOR_DELIVERY":
      return {
        step: 4,
        label: "طلبك خرج للتوصيل وفي طريقه إليك الآن 🛵🔥",
        color: "purple",
      };
    case "COMPLETED":
      return {
        step: 5,
        label: "تم التسليم بنجاح — ألف هنا من حلواني أبو عادل 🍰💛",
        color: "emerald",
      };
    case "CANCELLED":
      return {
        step: 0,
        label: "تم إلغاء الطلب",
        color: "rose",
      };
    default:
      return {
        step: 1,
        label: "جاري المتابعة...",
        color: "amber",
      };
  }
}

function formatQtyLabel(qty: number, unitType?: string) {
  if (unitType === "KG") {
    if (qty < 1) return `${Math.round(qty * 1000)} جم`;
    return `${Number(qty.toFixed(2))} كجم`;
  }
  return `${qty}`;
}

function AbuAdelOrderInner() {
  const searchParams = useSearchParams();
  const initialModeParam = (searchParams.get("mode") || searchParams.get("type") || "").toLowerCase();

  // 3 Pure Abu Adel Modes: DELIVERY | TAKEAWAY | PREORDER (NO DINE_IN!)
  const [mode, setMode] = useState<"DELIVERY" | "TAKEAWAY" | "PREORDER">(
    initialModeParam === "preorder"
      ? "PREORDER"
      : initialModeParam === "takeaway"
      ? "TAKEAWAY"
      : "DELIVERY"
  );
  // For PREORDER: customer chooses Branch Pickup OR Delivery on their scheduled date/time!
  const [preorderFulfillment, setPreorderFulfillment] = useState<"TAKEAWAY" | "DELIVERY">("TAKEAWAY");
  const [scheduledDate, setScheduledDate] = useState<string>(getTomorrowYMD());
  const [scheduledTime, setScheduledTime] = useState<string>("18:00");

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const cached = localStorage.getItem("abuadel_menu_cache_v1");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loadingMenu, setLoadingMenu] = useState<boolean>(true);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [outletId, setOutletId] = useState<string>("");

  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mobileCartOpen, setMobileCartOpen] = useState<boolean>(false);

  // Checkout fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "INSTAPAY" | "VODAFONE_CASH">("CASH");
  const [submitting, setSubmitting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live Active Order Tracker + Real-Time Customer Notifications
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);
  const [trackedOrder, setTrackedOrder] = useState<any>(null);
  const prevStatusRef = useRef<string | null>(null);
  const [liveAlert, setLiveAlert] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    const cleanup = registerAudioUnlockListeners();
    try {
      const savedId = localStorage.getItem(ACTIVE_ORDER_STORAGE_KEY);
      if (savedId) setTrackedOrderId(savedId);
    } catch {}
    return cleanup;
  }, []);

  const loadStaticData = useCallback(async () => {
    try {
      const [menuRes, settingsRes, zonesRes] = await Promise.all([
        fetch("/api/menu?outletId=ABU_ADEL_PATISSERIE"),
        fetch("/api/settings"),
        fetch("/api/delivery-zones"),
      ]);
      const [menuData, settingsData, zonesData] = await Promise.all([
        menuRes.json(),
        settingsRes.json(),
        zonesRes.json(),
      ]);

      if (menuData.success && Array.isArray(menuData.items)) {
        const available = menuData.items.filter((i: MenuItem) => i.isAvailable !== false);
        setMenuItems(available);
        try {
          localStorage.setItem("abuadel_menu_cache_v1", JSON.stringify(available));
        } catch {}
        if (available[0]?.outletId) setOutletId(available[0].outletId);
      }
      if (settingsData.success && settingsData.settings) {
        setSettings(settingsData.settings);
      }
      if (zonesData.success && Array.isArray(zonesData.zones)) {
        const activeZones = zonesData.zones.filter((z: any) => z.isActive !== false);
        setZones(activeZones);
        if (activeZones.length > 0 && !selectedZoneId) {
          setSelectedZoneId(activeZones[0].id);
        }
      }
    } catch (e) {
      console.error("Failed loading Abu Adel menu", e);
    } finally {
      setLoadingMenu(false);
    }
  }, [selectedZoneId]);

  useEffect(() => {
    loadStaticData();
  }, [loadStaticData]);

  // Fast 3-second real-time customer notification polling!
  useEffect(() => {
    if (!trackedOrderId) return;
    const pollOrder = async () => {
      try {
        const res = await fetch(`/api/orders?orderId=${encodeURIComponent(trackedOrderId)}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.orders) && data.orders[0]) {
          const ord = data.orders[0];
          setTrackedOrder(ord);
          if (prevStatusRef.current && prevStatusRef.current !== ord.status) {
            const meta = getStatusMeta(ord.status, ord.orderType);
            const driverExtra =
              ord.status === "OUT_FOR_DELIVERY" && ord.driverName
                ? ` — الكابتن ${ord.driverName}${ord.driverPhone ? ` (${ord.driverPhone})` : ""}`
                : "";
            const title = `تحديث طلبك #${ord.dailyTicketNo || ord.orderNumber} — حلواني أبو عادل`;
            const body = meta.label + driverExtra;
            playCustomerUpdateChime();
            setLiveAlert({ title, body });
            showBrowserNotification(title, body);
          }
          prevStatusRef.current = ord.status;
        }
      } catch {}
    };
    pollOrder();
    const interval = setInterval(pollOrder, 3000);
    return () => clearInterval(interval);
  }, [trackedOrderId]);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of menuItems) {
      map.set(item.category, (map.get(item.category) || 0) + 1);
    }
    return Array.from(map.entries()).map(([code, count]) => ({
      code,
      label: getCategoryLabel(code) || code,
      count,
    }));
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return menuItems.filter((item) => {
      if (activeCategory !== "ALL" && item.category !== activeCategory) return false;
      if (q) {
        return (
          item.nameAr.toLowerCase().includes(q) ||
          (item.nameEn || "").toLowerCase().includes(q) ||
          (getCategoryLabel(item.category) || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [menuItems, activeCategory, searchQuery]);

  const groupedByCategory = useMemo(() => {
    const groups: { code: string; label: string; items: MenuItem[] }[] = [];
    const byCat = new Map<string, MenuItem[]>();
    for (const item of filteredItems) {
      if (!byCat.has(item.category)) byCat.set(item.category, []);
      byCat.get(item.category)!.push(item);
    }
    for (const [code, items] of byCat.entries()) {
      groups.push({ code, label: getCategoryLabel(code) || code, items });
    }
    return groups;
  }, [filteredItems]);

  const addToCart = (item: MenuItem, customQty?: number) => {
    const step = customQty ?? (item.unitType === "KG" ? 0.5 : 1);
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.menuItemId === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: Number((copy[idx].qty + step).toFixed(2)) };
        return copy;
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          nameAr: item.nameAr,
          nameEn: item.nameEn,
          price: item.price,
          qty: step,
          unitType: item.unitType,
          category: item.category,
          itemType: item.itemType,
        },
      ];
    });
  };

  const updateCartQty = (menuItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.menuItemId !== menuItemId) return c;
          const step = c.unitType === "KG" ? 0.25 : 1;
          return { ...c, qty: Number((c.qty + delta * step).toFixed(2)) };
        })
        .filter((c) => c.qty > 0.01)
    );
  };

  const effectiveOrderType: "DELIVERY" | "TAKEAWAY" =
    mode === "PREORDER" ? preorderFulfillment : mode;
  const needsDeliveryAddress = effectiveOrderType === "DELIVERY";

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || null;
  const deliveryFee = needsDeliveryAddress
    ? Number(selectedZone?.fee ?? settings?.deliveryFee ?? 20)
    : 0;
  const cartSubtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const grandTotal = cartSubtotal + deliveryFee;
  const depositPercent = Number(settings?.preOrderDepositPercent ?? 30);
  const depositRequired =
    mode === "PREORDER" ? Math.round((cartSubtotal * depositPercent) / 100) : 0;

  const instapayValue = settings?.instapayAccount || "abuadel@instapay";
  const walletValue = settings?.vodafoneCashNumber || "01018671000";
  const receiptWhatsappRaw = settings?.whatsapp || "01018671000";
  const receiptWhatsappWa = normalizeEgyptWa(receiptWhatsappRaw);

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard?.writeText(val).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (cart.length === 0) {
      setErrorMsg("اختر أصناف الحلويات من المنيو أولاً");
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg("يرجى كتابة الاسم ورقم الموبايل للتواصل");
      return;
    }
    if (needsDeliveryAddress && !deliveryAddress.trim()) {
      setErrorMsg("يرجى كتابة عنوان التوصيل بالتفصيل");
      return;
    }
    if (mode === "PREORDER" && (!scheduledDate || !scheduledTime)) {
      setErrorMsg("يرجى تحديد تاريخ وموعد الاستلام المطلوب للحجز المسبق");
      return;
    }

    requestBrowserNotificationPermission();
    setSubmitting(true);
    try {
      const scheduledIso =
        mode === "PREORDER" ? new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString() : undefined;

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outletId: outletId || undefined,
          orderType: effectiveOrderType,
          isScheduled: mode === "PREORDER",
          scheduledFor: scheduledIso,
          depositRequired: mode === "PREORDER" ? depositRequired : 0,
          items: cart.map((c) => ({
            menuItemId: c.menuItemId,
            nameAr: c.nameAr,
            nameEn: c.nameEn,
            price: c.price,
            qty: c.qty,
            unitType: c.unitType,
            category: c.category,
            itemType: c.itemType,
            notes: c.notes?.trim() || undefined,
          })),
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          deliveryZoneId: needsDeliveryAddress ? selectedZone?.id || undefined : undefined,
          deliveryZoneName: needsDeliveryAddress ? selectedZone?.nameAr || undefined : undefined,
          deliveryFee,
          deliveryAddress: needsDeliveryAddress ? deliveryAddress.trim() : undefined,
          deliveryPhone: needsDeliveryAddress ? customerPhone.trim() : undefined,
          paymentMethod,
          notes: orderNote.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.order) {
        setErrorMsg(data.error || "تعذر إرسال الطلب، حاول مرة أخرى");
        return;
      }

      prevStatusRef.current = data.order.status;
      setTrackedOrderId(data.order.id);
      setTrackedOrder(data.order);
      try {
        localStorage.setItem(ACTIVE_ORDER_STORAGE_KEY, data.order.id);
      } catch {}
      setCart([]);
      setOrderNote("");
      setMobileCartOpen(false);

      playCustomerUpdateChime();
      setLiveAlert({
        title:
          mode === "PREORDER"
            ? `تم تسجيل حجز الحلويات #${data.order.dailyTicketNo || data.order.orderNumber} بنجاح 🎂`
            : `تم استلام طلبك #${data.order.dailyTicketNo || data.order.orderNumber} بنجاح ✅`,
        body:
          mode === "PREORDER"
            ? `الموعد: ${scheduledDate} الساعة ${scheduledTime} (${
                effectiveOrderType === "DELIVERY" ? "توصيل دليفري" : "استلام من المحل"
              })`
            : "سيتم إشعارك تلقائياً بالصوت فور تجهيز الطلب!",
      });
    } catch {
      setErrorMsg("تعذر الاتصال بالسيرفر، حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  const buildWhatsappReceiptLink = () => {
    const ticket = trackedOrder?.dailyTicketNo || trackedOrder?.orderNumber || "جديد";
    const total = Number(trackedOrder?.finalAmount || grandTotal).toFixed(0);
    const payLabel = paymentMethod === "INSTAPAY" ? "إنستاباي InstaPay" : "محفظة كاش";
    const typeLabel =
      mode === "PREORDER"
        ? `حجز حلويات بموعد (${scheduledDate} ${scheduledTime} - ${
            effectiveOrderType === "DELIVERY" ? "دليفري" : "استلام من المحل"
          })`
        : effectiveOrderType === "DELIVERY"
        ? "دليفري فوري"
        : "تيك أواي استلام فرع";
    const msg = encodeURIComponent(
      `أهلاً حلواني أبو عادل 🍰\nمرفق صورة إيصال الدفع / العربون (${payLabel})\n• نوع الطلب: ${typeLabel}\n• الاسم: ${
        customerName || trackedOrder?.customerName || ""
      }\n• رقم الطلب: #${ticket}\n• الإجمالي: ${total} ج.م`
    );
    return `https://wa.me/${receiptWhatsappWa}?text=${msg}`;
  };

  const renderCheckoutSidebar = () => (
    <form onSubmit={handlePlaceOrder} className="p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="text-sm font-black text-amber-200 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          {mode === "PREORDER" ? "سلة حجز الحلويات 🎂" : "سلة الطلب"} ({cart.length} صنف)
        </h3>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={() => setCart([])}
            className="text-[11px] text-rose-300/80 hover:text-rose-300 flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            إفراغ
          </button>
        )}
      </div>

      {/* Pre-Order Date, Time & Pickup-vs-Delivery Choice */}
      {mode === "PREORDER" && (
        <div className="rounded-2xl border border-amber-500/35 bg-amber-500/10 p-3 space-y-3">
          <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
            <CalendarClock className="w-4 h-4" />
            <span>تفاصيل موعد وطريقة استلام الحجز</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-amber-100/80 mb-1">
                تاريخ الاستلام *
              </label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-black/60 border border-amber-400/40 text-xs font-bold text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-amber-100/80 mb-1">
                الساعة المطلوبة *
              </label>
              <input
                type="time"
                required
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-black/60 border border-amber-400/40 text-xs font-bold text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-amber-100/80 mb-1.5">
              طريقة الاستلام في الموعد المحدد:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPreorderFulfillment("TAKEAWAY")}
                className={`py-2 px-2.5 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 transition ${
                  preorderFulfillment === "TAKEAWAY"
                    ? "bg-amber-500 text-black border-amber-300"
                    : "bg-black/40 text-amber-100/75 border-white/10"
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                استلام من المحل
              </button>
              <button
                type="button"
                onClick={() => setPreorderFulfillment("DELIVERY")}
                className={`py-2 px-2.5 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 transition ${
                  preorderFulfillment === "DELIVERY"
                    ? "bg-rose-500 text-white border-rose-300"
                    : "bg-black/40 text-amber-100/75 border-white/10"
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                توصيل دليفري
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Items */}
      {cart.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-5 text-center text-xs text-amber-100/45">
          اختر الحلويات أو التورت من المنيو لإضافتها للسلة 🍰
        </div>
      ) : (
        <div className="space-y-2 max-h-[190px] overflow-y-auto pl-1">
          {cart.map((item) => (
            <div
              key={item.menuItemId}
              className="rounded-2xl bg-white/[0.04] border border-white/10 p-2.5 flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="text-xs font-black text-amber-50 truncate">{item.nameAr}</div>
                <div className="text-[11px] text-amber-300 font-mono font-bold">
                  {(item.price * item.qty).toFixed(0)} ج.م
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => updateCartQty(item.menuItemId, -1)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-rose-500/30 flex items-center justify-center text-amber-100"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="min-w-[44px] text-center text-[11px] font-black font-mono">
                  {formatQtyLabel(item.qty, item.unitType)}
                </span>
                <button
                  type="button"
                  onClick={() => updateCartQty(item.menuItemId, 1)}
                  className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-black"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customer Info */}
      <div className="space-y-2.5 pt-2 border-t border-white/10">
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <User className="w-3.5 h-3.5 text-amber-400/70 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="الاسم *"
              className="w-full pr-8 pl-2.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-amber-50 placeholder:text-white/35 focus:outline-none focus:border-amber-400"
            />
          </div>
          <div className="relative">
            <Phone className="w-3.5 h-3.5 text-amber-400/70 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="رقم الموبايل *"
              className="w-full pr-8 pl-2.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-amber-50 placeholder:text-white/35 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
        </div>

        {needsDeliveryAddress && (
          <>
            {zones.length > 0 && (
              <div>
                <label className="block text-[11px] font-bold text-amber-200/75 mb-1">
                  منطقة التوصيل
                </label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-rose-500/35 text-xs font-bold text-rose-200 focus:outline-none focus:border-rose-400"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id} className="bg-[#160c11] text-white">
                      {z.nameAr} — التوصيل {z.fee} ج.م {z.estimatedTime ? `(${z.estimatedTime})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-rose-400/80 absolute right-3 top-3" />
              <textarea
                rows={2}
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="العنوان بالتفصيل (الشارع، رقم العمارة، الدور، علامة مميزة) *"
                className="w-full pr-8 pl-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-amber-50 placeholder:text-white/35 focus:outline-none focus:border-rose-400 resize-none"
              />
            </div>
          </>
        )}

        <div>
          <label className="flex items-center gap-1 text-[11px] font-bold text-amber-200/75 mb-1">
            <StickyNote className="w-3.5 h-3.5 text-amber-400" />
            ملاحظة / كتابة على التورتة أو تفاصيل التغليف
          </label>
          <input
            type="text"
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value)}
            placeholder="مثال: اكتب على التورتة Happy Birthday، تغليف هدية..."
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-amber-50 placeholder:text-white/35 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-[11px] font-bold text-amber-200/75 mb-1.5">
            {mode === "PREORDER" ? "وسيلة سداد العربون / الطلب" : "وسيلة الدفع"}
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setPaymentMethod("CASH")}
              className={`py-2 px-2 rounded-xl border text-[11px] font-black flex flex-col items-center gap-1 transition ${
                paymentMethod === "CASH"
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
                  : "border-white/10 bg-white/5 text-white/70"
              }`}
            >
              <Banknote className="w-4 h-4 text-emerald-400" />
              كاش
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("INSTAPAY")}
              className={`py-2 px-2 rounded-xl border text-[11px] font-black flex flex-col items-center gap-1 transition ${
                paymentMethod === "INSTAPAY"
                  ? "border-purple-400 bg-purple-500/20 text-purple-200"
                  : "border-white/10 bg-white/5 text-white/70"
              }`}
            >
              <Zap className="w-4 h-4 text-purple-400" />
              إنستاباي
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("VODAFONE_CASH")}
              className={`py-2 px-2 rounded-xl border text-[11px] font-black flex flex-col items-center gap-1 transition ${
                paymentMethod === "VODAFONE_CASH"
                  ? "border-rose-400 bg-rose-500/20 text-rose-200"
                  : "border-white/10 bg-white/5 text-white/70"
              }`}
            >
              <Smartphone className="w-4 h-4 text-rose-400" />
              محفظة كاش
            </button>
          </div>
        </div>

        {paymentMethod === "INSTAPAY" && (
          <div className="rounded-xl bg-purple-500/15 border border-purple-400/30 p-2.5 flex items-center justify-between gap-2 text-xs">
            <div>
              <div className="text-[10px] text-purple-200/75">حساب إنستاباي:</div>
              <div className="font-mono font-black text-purple-100" dir="ltr">
                {instapayValue}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(instapayValue, "instapay")}
              className="px-2.5 py-1 rounded-lg bg-purple-500 text-black text-[11px] font-black flex items-center gap-1"
            >
              {copiedKey === "instapay" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedKey === "instapay" ? "تم" : "نسخ"}
            </button>
          </div>
        )}
        {paymentMethod === "VODAFONE_CASH" && (
          <div className="rounded-xl bg-rose-500/15 border border-rose-400/30 p-2.5 flex items-center justify-between gap-2 text-xs">
            <div>
              <div className="text-[10px] text-rose-200/75">رقم المحفظة:</div>
              <div className="font-mono font-black text-rose-100" dir="ltr">
                {walletValue}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(walletValue, "wallet")}
              className="px-2.5 py-1 rounded-lg bg-rose-500 text-white text-[11px] font-black flex items-center gap-1"
            >
              {copiedKey === "wallet" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedKey === "wallet" ? "تم" : "نسخ"}
            </button>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="pt-2 border-t border-white/10 space-y-1 text-xs">
        <div className="flex justify-between text-white/70">
          <span>المجموع</span>
          <span className="font-mono font-bold">{cartSubtotal.toFixed(0)} ج.م</span>
        </div>
        {needsDeliveryAddress && (
          <div className="flex justify-between text-rose-300">
            <span>خدمة التوصيل</span>
            <span className="font-mono font-bold">{deliveryFee.toFixed(0)} ج.م</span>
          </div>
        )}
        {mode === "PREORDER" && depositRequired > 0 && (
          <div className="flex justify-between text-amber-300 font-bold">
            <span>العربون المطلوب لتأكيد الحجز ({depositPercent}%)</span>
            <span className="font-mono">{depositRequired.toFixed(0)} ج.م</span>
          </div>
        )}
        <div className="flex justify-between items-center text-sm font-black text-amber-300 pt-1">
          <span>الإجمالي النهائي</span>
          <span className="font-mono text-base">{grandTotal.toFixed(0)} ج.م</span>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl bg-rose-500/15 border border-rose-500/35 px-3 py-2 text-xs font-bold text-rose-200">
          ⚠️ {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || cart.length === 0}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-rose-500 to-amber-500 hover:brightness-110 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition"
      >
        {mode === "PREORDER" ? (
          <CalendarClock className="w-4 h-4" />
        ) : effectiveOrderType === "DELIVERY" ? (
          <Bike className="w-4 h-4" />
        ) : (
          <Store className="w-4 h-4" />
        )}
        <span>
          {submitting
            ? "جاري تسجيل طلبك..."
            : mode === "PREORDER"
            ? `تأكيد حجز الحلويات (${grandTotal.toFixed(0)} ج.م)`
            : effectiveOrderType === "DELIVERY"
            ? `تأكيد طلب الدليفري (${grandTotal.toFixed(0)} ج.م)`
            : `تأكيد طلب التيك أواي (${grandTotal.toFixed(0)} ج.م)`}
        </span>
      </button>
    </form>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-[#0d070a] text-amber-50 flex flex-col">
      {/* Real-Time Customer Update Notification Banner */}
      {liveAlert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[120] max-w-md w-[94%] rounded-2xl bg-gradient-to-l from-amber-500 to-rose-500 text-black px-4 py-3.5 shadow-2xl border-2 border-amber-200 flex items-start gap-3 animate-bounce">
          <Bell className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs sm:text-sm font-black">{liveAlert.title}</div>
            <div className="text-[11px] sm:text-xs font-bold mt-0.5">{liveAlert.body}</div>
          </div>
          <button
            type="button"
            onClick={() => setLiveAlert(null)}
            className="p-1 rounded-lg bg-black/15 hover:bg-black/25"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#160c11]/95 backdrop-blur-md border-b border-rose-500/25 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-black shadow-lg"
            >
              <Cake className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-black text-amber-100 leading-none">حلواني أبو عادل</h1>
              <p className="text-[11px] text-rose-300/85 font-bold mt-0.5">
                أصل الحلويات • الخط الساخن {settings?.hotline || "15992"}
              </p>
            </div>
          </div>

          {/* 3 Clean Order Mode Tabs (NO Dine-In!) */}
          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setMode("DELIVERY")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition ${
                mode === "DELIVERY" ? "bg-rose-500 text-white shadow" : "text-white/70 hover:text-white"
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              دليفري
            </button>
            <button
              type="button"
              onClick={() => setMode("TAKEAWAY")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition ${
                mode === "TAKEAWAY" ? "bg-amber-500 text-black shadow" : "text-white/70 hover:text-white"
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              تيك أواي
            </button>
            <button
              type="button"
              onClick={() => setMode("PREORDER")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition ${
                mode === "PREORDER"
                  ? "bg-gradient-to-l from-amber-400 to-rose-500 text-black shadow"
                  : "text-amber-200/80 hover:text-white"
              }`}
            >
              <CalendarClock className="w-3.5 h-3.5" />
              حجز حلويات بموعد
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
            <div className="relative flex-1 sm:w-52">
              <Search className="w-4 h-4 text-amber-300/60 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الحلويات والتورت..."
                className="w-full pr-9 pl-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-amber-50 placeholder:text-white/35 focus:outline-none focus:border-amber-400"
              />
            </div>
            <ThemeToggle compact />
            <Link
              href="/"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-amber-200"
              title="الرئيسية"
            >
              <Home className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Category Filter Strip */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveCategory("ALL")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap border transition ${
              activeCategory === "ALL"
                ? "bg-amber-500 text-black border-amber-400"
                : "bg-white/5 text-amber-100/75 border-white/10 hover:bg-white/10"
            }`}
          >
            كل الأقسام ({menuItems.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.code}
              type="button"
              onClick={() => setActiveCategory(cat.code)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap border transition ${
                activeCategory === cat.code
                  ? "bg-amber-500 text-black border-amber-400"
                  : "bg-white/5 text-amber-100/75 border-white/10 hover:bg-white/10"
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>
      </header>

      {/* Live Tracked Order Banner */}
      {trackedOrder && (
        <div className="max-w-7xl w-full mx-auto px-4 pt-4">
          {(() => {
            const meta = getStatusMeta(trackedOrder.status, trackedOrder.orderType);
            return (
              <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-l from-rose-950/60 via-[#190d13] to-[#190d13] p-4 shadow-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                      <Clock className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-amber-300 flex flex-wrap items-center gap-2">
                        <span>
                          متابعة طلبك المباشرة — بون #{trackedOrder.dailyTicketNo || trackedOrder.orderNumber}
                        </span>
                        {trackedOrder.isScheduled && trackedOrder.scheduledFor && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/25 text-rose-200 text-[10px]">
                            🎂 حجز موعد:{" "}
                            {new Date(trackedOrder.scheduledFor).toLocaleString("ar-EG", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-black text-white mt-0.5">{meta.label}</div>
                      {trackedOrder.driverName && trackedOrder.status === "OUT_FOR_DELIVERY" && (
                        <div className="text-xs text-purple-200 font-bold mt-0.5">
                          🛵 الكابتن: {trackedOrder.driverName}{" "}
                          {trackedOrder.driverPhone ? `(${trackedOrder.driverPhone})` : ""}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {(trackedOrder.paymentMethod === "INSTAPAY" ||
                      trackedOrder.paymentMethod === "VODAFONE_CASH" ||
                      trackedOrder.isScheduled) && (
                      <a
                        href={buildWhatsappReceiptLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        إرسال إيصال الدفع / العربون واتساب
                      </a>
                    )}
                    {(trackedOrder.status === "COMPLETED" || trackedOrder.status === "CANCELLED") && (
                      <button
                        type="button"
                        onClick={() => {
                          setTrackedOrderId(null);
                          setTrackedOrder(null);
                          prevStatusRef.current = null;
                          try {
                            localStorage.removeItem(ACTIVE_ORDER_STORAGE_KEY);
                          } catch {}
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold"
                      >
                        إخفاء
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 pb-28 lg:pb-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-8 space-y-6">
          {loadingMenu && menuItems.length === 0 ? (
            <div className="space-y-4">
              <div className="text-center text-xs font-bold text-amber-300/80 py-2">
                🍰 جاري تحميل منيو حلواني أبو عادل...
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/10 bg-[#190d13] p-3 flex items-center gap-3 animate-pulse"
                  >
                    <div className="w-16 h-16 rounded-xl bg-white/10 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-white/10 rounded w-3/4" />
                      <div className="h-2.5 bg-white/5 rounded w-1/2" />
                      <div className="h-5 bg-rose-500/15 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : groupedByCategory.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] py-16 text-center text-white/40 font-bold">
              لا توجد أصناف مطابقة للبحث
            </div>
          ) : (
            groupedByCategory.map((group) => (
              <div key={group.code} className="space-y-3">
                <div className="flex items-center gap-2 border-b border-rose-500/20 pb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h2 className="text-base font-black text-amber-200">{group.label}</h2>
                  <span className="text-[11px] text-amber-200/50 font-bold">
                    ({group.items.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.items.map((item) => {
                    const inCart = cart.find((c) => c.menuItemId === item.id);
                    const isKg = item.unitType === "KG";
                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border p-3 flex items-center gap-3 transition ${
                          inCart
                            ? "bg-rose-500/10 border-amber-400/50"
                            : "bg-[#180d12] border-white/10 hover:border-rose-500/35"
                        }`}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.nameAr}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10 bg-black/40"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 text-amber-400/70">
                            <Cake className="w-6 h-6" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-black text-amber-50 truncate">{item.nameAr}</h3>
                          <div className="text-[11px] text-rose-200/65 font-bold">
                            {isKg ? "سعر الكيلو" : "بالقطعة / العلبة"}
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <span className="text-sm font-black text-amber-300 font-mono">
                              {item.price} <span className="text-[10px] font-sans">ج.م</span>
                            </span>
                            {inCart ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => updateCartQty(item.id, -1)}
                                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-rose-500/30 flex items-center justify-center text-white"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="min-w-[40px] text-center text-[11px] font-black font-mono">
                                  {formatQtyLabel(inCart.qty, inCart.unitType)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateCartQty(item.id, 1)}
                                  className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-black"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => addToCart(item)}
                                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-amber-500 text-amber-200 hover:text-black text-xs font-black flex items-center gap-1 transition"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                {isKg ? "+ نصف كيلو" : "إضافة"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </section>

        {/* Scrollable Sticky Checkout Sidebar (NEVER cut off!) */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-32 max-h-[calc(100vh-8.5rem)] overflow-y-auto rounded-3xl border border-rose-500/30 bg-[#160c11] shadow-2xl">
          {renderCheckoutSidebar()}
        </aside>
      </main>

      {/* Orca Tech Developer Footer */}
      <footer className="pb-24 lg:pb-6 pt-3 text-center text-[11px] text-amber-200/45 border-t border-white/5">
        تطوير <strong className="text-amber-300/80">شركة أوركا للحلول البرمجية (Orca Tech) 🐬</strong> •{" "}
        <a href="tel:01018671000" className="font-mono hover:text-amber-300">
          01018671000
        </a>
      </footer>

      {/* Mobile Floating Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-gradient-to-t from-[#0d070a] via-[#0d070a]/95 to-transparent">
        <button
          type="button"
          onClick={() => setMobileCartOpen(true)}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-l from-rose-500 to-amber-500 text-black font-black text-sm flex items-center justify-between shadow-2xl"
        >
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            {mode === "PREORDER" ? "إتمام حجز الحلويات 🎂" : `إتمام الطلب (${cart.length} صنف)`}
          </span>
          <span className="flex items-center gap-1 font-mono">
            {grandTotal.toFixed(0)} ج.م
            <ChevronUp className="w-4 h-4" />
          </span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileCartOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end">
          <div className="w-full max-h-[90vh] rounded-t-3xl bg-[#160c11] border-t border-rose-500/35 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-sm font-black text-amber-200">
                {mode === "PREORDER"
                  ? "إتمام حجز الحلويات بموعد 🎂"
                  : effectiveOrderType === "DELIVERY"
                  ? "إتمام طلب الدليفري 🛵"
                  : "إتمام طلب التيك أواي 🛍️"}
              </span>
              <button
                type="button"
                onClick={() => setMobileCartOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 text-amber-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1">{renderCheckoutSidebar()}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AbuAdelOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0d070a] flex items-center justify-center text-amber-300 font-black">
          جاري تحميل منيو حلواني أبو عادل 🍰...
        </div>
      }
    >
      <AbuAdelOrderInner />
    </Suspense>
  );
}
