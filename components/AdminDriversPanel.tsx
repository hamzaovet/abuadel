"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Bike,
  Plus,
  Edit2,
  Trash2,
  Phone,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  DollarSign,
  TrendingUp,
  Clock,
  MessageCircle,
  Power,
  FileSpreadsheet,
} from "lucide-react";

interface AdminDriversPanelProps {
  currentUser?: any;
  settings?: any;
}

export default function AdminDriversPanel({
  currentUser,
  settings,
}: AdminDriversPanelProps) {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"ADD" | "EDIT">("ADD");
  const [driverForm, setDriverForm] = useState({
    id: "",
    name: "",
    phone: "",
    vehicleInfo: "",
    notes: "",
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/drivers?includeStats=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.drivers)) {
        setDrivers(data.drivers);
      } else {
        setToast({ type: "error", text: data.error || "فشل تحميل قائمة المناديب" });
      }
    } catch {
      setToast({ type: "error", text: "تعذر الاتصال بالخادم لجلب بيانات المناديب" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleOpenAdd = () => {
    setModalMode("ADD");
    setDriverForm({
      id: "",
      name: "",
      phone: "",
      vehicleInfo: "",
      notes: "",
      isActive: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (drv: any) => {
    setModalMode("EDIT");
    setDriverForm({
      id: drv.id,
      name: drv.name,
      phone: drv.phone,
      vehicleInfo: drv.vehicleInfo || "",
      notes: drv.notes || "",
      isActive: Boolean(drv.isActive),
    });
    setShowModal(true);
  };

  const handleSubmitDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverForm.name.trim() || !driverForm.phone.trim()) {
      setToast({ type: "error", text: "اسم المندوب ورقم الموبايل مطلوبان" });
      return;
    }

    try {
      setSubmitting(true);
      const method = modalMode === "ADD" ? "POST" : "PATCH";
      const res = await fetch("/api/drivers", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(driverForm),
      });
      const data = await res.json();
      if (data.success) {
        setToast({
          type: "success",
          text: modalMode === "ADD" ? `تمت إضافة المندوب "${driverForm.name}" بنجاح 🛵` : `تم تحديث بيانات المندوب بنجاح ✅`,
        });
        setShowModal(false);
        fetchDrivers();
      } else {
        setToast({ type: "error", text: data.error || "فشل حفظ بيانات المندوب" });
      }
    } catch {
      setToast({ type: "error", text: "حدث خطأ أثناء حفظ بيانات المندوب" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (drv: any) => {
    try {
      const res = await fetch("/api/drivers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: drv.id,
          isActive: !drv.isActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDrivers();
        setToast({
          type: "success",
          text: `تم ${!drv.isActive ? "تفعيل" : "تعطيل"} المندوب "${drv.name}"`,
        });
      }
    } catch {
      setToast({ type: "error", text: "تعذر تغيير حالة المندوب" });
    }
  };

  const handleDeleteDriver = async (drv: any) => {
    if (!window.confirm(`هل أنت متأكد من حذف المندوب "${drv.name}"؟ (تظل الفواتير السابقة محتفظة باسمه)`)) {
      return;
    }

    try {
      const res = await fetch(`/api/drivers?id=${encodeURIComponent(drv.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setToast({ type: "success", text: "تم حذف المندوب من السجل بنجاح" });
        fetchDrivers();
      } else {
        setToast({ type: "error", text: data.error || "فشل حذف المندوب" });
      }
    } catch {
      setToast({ type: "error", text: "حدث خطأ أثناء محاولة الحذف" });
    }
  };

  // Filtered list
  const filteredDrivers = drivers.filter((d) => {
    if (filterActive === "ACTIVE" && !d.isActive) return false;
    if (filterActive === "INACTIVE" && d.isActive) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        d.name?.toLowerCase().includes(q) ||
        d.phone?.includes(q) ||
        d.vehicleInfo?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Aggregated KPIs
  const totalDriversCount = drivers.length;
  const activeDriversCount = drivers.filter((d) => d.isActive).length;
  const totalTodayTrips = drivers.reduce((s, d) => s + (d.stats?.totalTrips || 0), 0);
  const totalTodayDeliveryFeesDue = drivers.reduce(
    (s, d) => s + (d.stats?.totalDeliveryFeesDue || 0),
    0
  );
  const totalTodayCashToCollect = drivers.reduce(
    (s, d) => s + (d.stats?.totalCashToCollectFromCustomer || 0),
    0
  );
  const totalStoreNet = drivers.reduce((s, d) => s + (d.stats?.storeNetFromDriver || 0), 0);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-lg ${
            toast.type === "success"
              ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-200"
              : "bg-rose-950/70 border-rose-500/50 text-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toast.text}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-xs opacity-75 hover:opacity-100 underline cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            <Bike className="w-3.5 h-3.5 text-amber-400" />
            <span>إجمالي المناديب</span>
          </div>
          <div className="text-xl font-black text-white font-mono">{totalDriversCount}</div>
          <div className="text-[10px] text-emerald-400 font-bold">{activeDriversCount} نشط بالخدمة</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
            <span>رحلات اليوم</span>
          </div>
          <div className="text-xl font-black text-sky-300 font-mono">{totalTodayTrips}</div>
          <div className="text-[10px] text-slate-400">أوردرات دليفري مسندة</div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-3.5 space-y-1">
          <div className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span>حق المناديب (مفصول)</span>
          </div>
          <div className="text-xl font-black text-amber-400 font-mono">
            {totalTodayDeliveryFeesDue.toFixed(0)} <span className="text-xs">ج.م</span>
          </div>
          <div className="text-[10px] text-slate-400 font-bold">مصاريف توصيل لا تدخل الإيراد</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
          <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            <span>💵</span>
            <span>كاش للتحصيل</span>
          </div>
          <div className="text-xl font-black text-white font-mono">
            {totalTodayCashToCollect.toFixed(0)} <span className="text-xs">ج.م</span>
          </div>
          <div className="text-[10px] text-slate-400">مع المناديب من العملاء</div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-3.5 space-y-1 sm:col-span-2">
          <div className="text-[10px] text-emerald-300 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>صافي توريد المحل من المناديب</span>
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">
            {totalStoreNet.toFixed(0)} <span className="text-xs">ج.م</span>
          </div>
          <div className="text-[10px] text-slate-400">
            الكاش المحصل مطروحاً منه حق توصيل الطيارين
          </div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو رقم الموبايل أو المركبة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterActive("ALL")}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                filterActive === "ALL" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              الكل ({drivers.length})
            </button>
            <button
              onClick={() => setFilterActive("ACTIVE")}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                filterActive === "ACTIVE" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              النشطين ({activeDriversCount})
            </button>
            <button
              onClick={() => setFilterActive("INACTIVE")}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                filterActive === "INACTIVE" ? "bg-rose-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              المعطلين ({drivers.length - activeDriversCount})
            </button>
          </div>

          <button
            onClick={fetchDrivers}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مندوب توصيل جديد 🛵</span>
        </button>
      </div>

      {/* Drivers Grid */}
      {loading && drivers.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-xs">جاري تحميل بيانات مناديب التوصيل...</div>
      ) : filteredDrivers.length === 0 ? (
        <div className="py-16 text-center bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-2">
          <Bike className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-300">لا يوجد مناديب مطابقون للبحث</h4>
          <p className="text-xs text-slate-500">يمكنك إضافة مندوب جديد بالضغط على الزر أعلاه</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrivers.map((drv) => {
            const stats = drv.stats || {
              totalTrips: 0,
              activeOrdersCount: 0,
              completedOrdersCount: 0,
              totalDeliveryFeesDue: 0,
              totalCashToCollectFromCustomer: 0,
              storeNetFromDriver: 0,
            };

            const cleanPhone = drv.phone?.replace(/\D/g, "");
            const waPhone = cleanPhone?.startsWith("0") ? "2" + cleanPhone : cleanPhone;

            return (
              <div
                key={drv.id}
                className={`p-4 rounded-3xl border flex flex-col justify-between gap-3 shadow-lg transition-all ${
                  drv.isActive
                    ? "bg-slate-900/95 border-slate-800 hover:border-amber-500/40"
                    : "bg-slate-950/80 border-slate-800/60 opacity-60"
                }`}
              >
                {/* Header: Name, Status & Vehicle */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-sm text-white">{drv.name}</h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            drv.isActive
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          }`}
                        >
                          {drv.isActive ? "نشط بالخدمة" : "معطل مؤقتاً"}
                        </span>
                      </div>
                      {drv.vehicleInfo && (
                        <div className="text-[11px] text-amber-300 font-bold mt-0.5 flex items-center gap-1">
                          <Bike className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{drv.vehicleInfo}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleActive(drv)}
                        className={`p-1.5 rounded-xl border text-xs transition cursor-pointer ${
                          drv.isActive
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                        }`}
                        title={drv.isActive ? "تعطيل المندوب" : "تفعيل المندوب"}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(drv)}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                        title="تعديل البيانات"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDriver(drv)}
                        className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition cursor-pointer"
                        title="حذف من السجل"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Phone & WhatsApp */}
                  <div className="flex items-center justify-between text-xs bg-slate-950/70 p-2 rounded-xl border border-white/5 font-mono">
                    <span className="text-slate-300 direction-ltr text-right">{drv.phone}</span>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${drv.phone}`}
                        className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                        title="اتصال هاتفي"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      {waPhone && (
                        <a
                          href={`https://wa.me/${waPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition"
                          title="محادثة واتساب"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {drv.notes && (
                    <p className="text-[11px] text-slate-400 bg-black/30 p-2 rounded-xl border border-white/5">
                      {drv.notes}
                    </p>
                  )}
                </div>

                {/* Financial & Trip Stats */}
                <div className="pt-2 border-t border-white/5 space-y-1.5 text-xs">
                  <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
                    <div className="p-1.5 bg-slate-950 rounded-xl border border-white/5">
                      <div className="text-[9px] text-slate-400">إجمالي الرحلات</div>
                      <div className="font-black text-white">{stats.totalTrips}</div>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded-xl border border-sky-500/20">
                      <div className="text-[9px] text-sky-400">جاري التوصيل</div>
                      <div className="font-black text-sky-300">{stats.activeOrdersCount}</div>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded-xl border border-emerald-500/20">
                      <div className="text-[9px] text-emerald-400">مكتمل اليوم</div>
                      <div className="font-black text-emerald-300">{stats.completedOrdersCount}</div>
                    </div>
                  </div>

                  {/* Accounting Breakdown: Driver Fee vs Store Net */}
                  <div className="p-2.5 rounded-2xl bg-black/60 border border-amber-500/20 space-y-1 text-[11px]">
                    <div className="flex justify-between items-center text-amber-300 font-bold">
                      <span>حق المندوب (مصاريف التوصيل):</span>
                      <span className="font-mono font-black text-amber-400">
                        {stats.totalDeliveryFeesDue.toFixed(0)} ج.م
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>إجمالي كاش العملاء مع المندوب:</span>
                      <span className="font-mono text-white">
                        {stats.totalCashToCollectFromCustomer.toFixed(0)} ج.م
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-white/10 text-emerald-300 font-black">
                      <span>صافي توريد المحل المستحق:</span>
                      <span className="font-mono text-emerald-400 text-xs">
                        {stats.storeNetFromDriver.toFixed(0)} ج.م
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: ADD / EDIT DRIVER */}
      {showModal && (
        <div
          dir="rtl"
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
        >
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Bike className="w-4 h-4 text-amber-400" />
                <span>{modalMode === "ADD" ? "إضافة مندوب توصيل جديد" : "تعديل بيانات مندوب التوصيل"}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitDriver} className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-bold">اسم المندوب / الطيار *</label>
                <input
                  type="text"
                  required
                  placeholder="محمد أشرف / كابتن كريم..."
                  value={driverForm.name}
                  onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-bold">رقم الموبايل / واتساب *</label>
                <input
                  type="tel"
                  required
                  placeholder="01XXXXXXXXX"
                  value={driverForm.phone}
                  onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-amber-400"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-bold">نوع المركبة ورقم اللوحة</label>
                <input
                  type="text"
                  placeholder="موتوسيكل دايو 4 (أ ب ج 123) / سكوتر..."
                  value={driverForm.vehicleInfo}
                  onChange={(e) => setDriverForm({ ...driverForm, vehicleInfo: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-bold">ملاحظات إضافية</label>
                <textarea
                  rows={2}
                  placeholder="مثال: شيفت مسائي، متاح أيام الجمعة والسبت..."
                  value={driverForm.notes}
                  onChange={(e) => setDriverForm({ ...driverForm, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={driverForm.isActive}
                  onChange={(e) => setDriverForm({ ...driverForm, isActive: e.target.checked })}
                  className="accent-amber-500 w-4 h-4"
                />
                <span className="font-bold text-white">المندوب متاح ونشط بالخدمة حالياً</span>
              </label>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black cursor-pointer shadow-lg"
                >
                  {submitting ? "جاري الحفظ..." : modalMode === "ADD" ? "إضافة المندوب ✅" : "حفظ التعديل ✅"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
