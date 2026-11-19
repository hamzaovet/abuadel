import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let settings = await prisma.systemSettings.findFirst();
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: { id: "default-settings" },
      });
    }
    const { geminiApiKey: storedKey, vapidPrivateKey: _vp, ...safeSettings } = settings;
    const defaultFb = "https://www.facebook.com/p/%D9%85%D9%86%D9%81%D8%B0-%D8%A8%D9%8A%D8%B9-%D8%AD%D9%84%D9%88%D8%A7%D9%86%D9%89-%D8%A3%D8%A8%D9%88-%D8%B9%D8%A7%D8%AF%D9%84-%D8%A8%D8%A7%D9%84%D9%82%D8%A7%D9%87%D8%B1%D8%A9-%D8%AD%D8%AF%D8%A7%D8%A6%D9%82-%D8%A7%D9%84%D9%82%D8%A8%D8%A9--100078679611752/";
    const defaultInsta = "https://www.instagram.com/?fbclid=IwY2xjawVrzpZleHRuA2FlbQIxMABwZG9mBWJyaWQRMWNoakkwYUlJaEF4dnYySUhzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEfZZ39iutBc9qooPtr_Xf151JDxOrpRQk6WDl122zuPEwSbh7zeY3gQfQd3FA_aem_7DBcMQasr2G6WTTAdU4VoQ";

    return NextResponse.json(
      {
        success: true,
        settings: {
          ...safeSettings,
          facebookUrl: safeSettings.facebookUrl && !safeSettings.facebookUrl.includes("soulmate") ? safeSettings.facebookUrl : defaultFb,
          instagramUrl: defaultInsta,
          tiktokUrl: "https://www.tiktok.com",
          abuAdelPhone: safeSettings.abuAdelPhone && safeSettings.abuAdelPhone !== "01557879033" ? safeSettings.abuAdelPhone : "01146862114",
          whatsapp: safeSettings.whatsapp && safeSettings.whatsapp !== "01557879033" ? safeSettings.whatsapp : "01146862114",
          vodafoneCashNumber: safeSettings.vodafoneCashNumber && safeSettings.vodafoneCashNumber !== "01557879033" ? safeSettings.vodafoneCashNumber : "01097280514",
          instapayAccount: safeSettings.instapayAccount && safeSettings.instapayAccount !== "soulmate@instapay" ? safeSettings.instapayAccount : "01097280514",
          cafeAddress: safeSettings.cafeAddress && !safeSettings.cafeAddress.includes("99st") ? safeSettings.cafeAddress : "101 شارع زمزم خلف مسجد الشيخ غراب - حدائق القبة",
          hasGeminiKey: Boolean(process.env.GEMINI_API_KEY || storedKey),
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const updateData: any = {
      ...(body.brandNameAr !== undefined && { brandNameAr: body.brandNameAr }),
      ...(body.brandNameEn !== undefined && { brandNameEn: body.brandNameEn }),
      ...(body.cafeAddress !== undefined && { cafeAddress: body.cafeAddress }),
      ...(body.soulmatePhone !== undefined && { soulmatePhone: body.soulmatePhone }),
      ...(body.shift1Name !== undefined && { shift1Name: body.shift1Name }),
      ...(body.shift1Pin !== undefined && { shift1Pin: String(body.shift1Pin).trim() }),
      ...(body.shift2Name !== undefined && { shift2Name: body.shift2Name }),
      ...(body.shift2Pin !== undefined && { shift2Pin: String(body.shift2Pin).trim() }),
      ...(body.hallPasscodeEnabled !== undefined && { hallPasscodeEnabled: Boolean(body.hallPasscodeEnabled) }),
      ...(body.hallPasscode !== undefined && { hallPasscode: String(body.hallPasscode).trim() || "2026" }),
      ...(body.abuAdelPhone !== undefined && { abuAdelPhone: body.abuAdelPhone }),
      ...(body.hotline !== undefined && { hotline: body.hotline }),
      ...(body.whatsapp !== undefined && { whatsapp: body.whatsapp }),
      ...(body.haliyomakUrl !== undefined && { haliyomakUrl: body.haliyomakUrl }),
      ...(body.facebookUrl !== undefined && { facebookUrl: body.facebookUrl }),
      ...(body.serviceChargePercent !== undefined && { serviceChargePercent: Number(body.serviceChargePercent) }),
      ...(body.taxPercent !== undefined && { taxPercent: Number(body.taxPercent) }),
      ...(body.deliveryFee !== undefined && { deliveryFee: Number(body.deliveryFee) }),
      ...(body.preOrderDepositPercent !== undefined && { preOrderDepositPercent: Number(body.preOrderDepositPercent) }),
      ...(body.instapayAccount !== undefined && { instapayAccount: body.instapayAccount }),
      ...(body.vodafoneCashNumber !== undefined && { vodafoneCashNumber: body.vodafoneCashNumber }),
      ...(body.isServiceChargeEnabled !== undefined && { isServiceChargeEnabled: Boolean(body.isServiceChargeEnabled) }),
      ...(body.isTaxEnabled !== undefined && { isTaxEnabled: Boolean(body.isTaxEnabled) }),
      ...(body.isLoyaltyEnabled !== undefined && { isLoyaltyEnabled: Boolean(body.isLoyaltyEnabled) }),
      ...(body.pointsPerPoundSpent !== undefined && { pointsPerPoundSpent: Number(body.pointsPerPoundSpent) }),
      ...(body.poundValuePerPoint !== undefined && { poundValuePerPoint: Number(body.poundValuePerPoint) }),
      ...(body.loyaltyRewardThreshold !== undefined && {
        loyaltyRewardThreshold: Math.max(1, Math.round(Number(body.loyaltyRewardThreshold))),
      }),
      ...(body.loyaltyRewardValue !== undefined && {
        loyaltyRewardValue: Math.max(0, Number(body.loyaltyRewardValue)),
      }),
      ...(body.loyaltyAppliesToAbuAdel !== undefined && {
        loyaltyAppliesToAbuAdel: Boolean(body.loyaltyAppliesToAbuAdel),
      }),
      ...(body.loyaltyAppliesToSoulmate !== undefined && {
        loyaltyAppliesToSoulmate: Boolean(body.loyaltyAppliesToSoulmate),
      }),
      ...(body.loyaltyMotivationalMsg !== undefined && {
        loyaltyMotivationalMsg: String(body.loyaltyMotivationalMsg),
      }),
      ...(body.offersEnabled !== undefined && { offersEnabled: Boolean(body.offersEnabled) }),
      ...(body.specialOffers !== undefined && {
        specialOffers:
          typeof body.specialOffers === "string"
            ? body.specialOffers
            : JSON.stringify(body.specialOffers),
      }),
      ...(body.dailyReportAlertEnabled !== undefined && {
        dailyReportAlertEnabled: Boolean(body.dailyReportAlertEnabled),
      }),
      ...(body.dailyReportAlertTime !== undefined && {
        dailyReportAlertTime: String(body.dailyReportAlertTime || "20:00"),
      }),
      ...(body.dailyReportRepeatSeconds !== undefined && {
        dailyReportRepeatSeconds: Math.max(2, Math.round(Number(body.dailyReportRepeatSeconds) || 4)),
      }),
      ...(body.dailyReportAlertSound !== undefined && {
        dailyReportAlertSound: Boolean(body.dailyReportAlertSound),
      }),
      ...(body.internalSupplyMarkupEnabled !== undefined && {
        internalSupplyMarkupEnabled: Boolean(body.internalSupplyMarkupEnabled),
      }),
      ...(body.internalSupplyMarkupPercent !== undefined && {
        internalSupplyMarkupPercent: Math.max(0, Number(body.internalSupplyMarkupPercent) || 0),
      }),
      ...(body.talabatCommissionPercent !== undefined && {
        talabatCommissionPercent: Math.max(0, Math.min(100, Number(body.talabatCommissionPercent) || 0)),
      }),
      ...(body.geminiApiKey !== undefined && String(body.geminiApiKey).trim() !== "" && {
        geminiApiKey: String(body.geminiApiKey).trim(),
      }),
      ...(body.receiptFooterNotes !== undefined && { receiptFooterNotes: body.receiptFooterNotes }),
      ...(body.systemLocked !== undefined && { systemLocked: Boolean(body.systemLocked) }),
      ...(body.lockMessage !== undefined && { lockMessage: body.lockMessage }),
    };

    const settings = await prisma.systemSettings.upsert({
      where: { id: "default-settings" },
      update: updateData,
      create: {
        id: "default-settings",
        ...updateData,
      },
    });

    const { geminiApiKey: storedKey, vapidPrivateKey: _vp, ...safeSettings } = settings;
    const defaultFb = "https://www.facebook.com/p/%D9%85%D9%86%D9%81%D8%B0-%D8%A8%D9%8A%D8%B9-%D8%AD%D9%84%D9%88%D8%A7%D9%86%D9%89-%D8%A3%D8%A8%D9%88-%D8%B9%D8%A7%D8%AF%D9%84-%D8%A8%D8%A7%D9%84%D9%82%D8%A7%D9%87%D8%B1%D8%A9-%D8%AD%D8%AF%D8%A7%D8%A6%D9%82-%D8%A7%D9%84%D9%82%D8%A8%D8%A9--100078679611752/";
    const defaultInsta = "https://www.instagram.com/?fbclid=IwY2xjawVrzpZleHRuA2FlbQIxMABwZG9mBWJyaWQRMWNoakkwYUlJaEF4dnYySUhzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEfZZ39iutBc9qooPtr_Xf151JDxOrpRQk6WDl122zuPEwSbh7zeY3gQfQd3FA_aem_7DBcMQasr2G6WTTAdU4VoQ";

    return NextResponse.json(
      {
        success: true,
        settings: {
          ...safeSettings,
          facebookUrl: safeSettings.facebookUrl && !safeSettings.facebookUrl.includes("soulmate") ? safeSettings.facebookUrl : defaultFb,
          instagramUrl: defaultInsta,
          tiktokUrl: "https://www.tiktok.com",
          abuAdelPhone: safeSettings.abuAdelPhone && safeSettings.abuAdelPhone !== "01557879033" ? safeSettings.abuAdelPhone : "01146862114",
          whatsapp: safeSettings.whatsapp && safeSettings.whatsapp !== "01557879033" ? safeSettings.whatsapp : "01146862114",
          vodafoneCashNumber: safeSettings.vodafoneCashNumber && safeSettings.vodafoneCashNumber !== "01557879033" ? safeSettings.vodafoneCashNumber : "01097280514",
          instapayAccount: safeSettings.instapayAccount && safeSettings.instapayAccount !== "soulmate@instapay" ? safeSettings.instapayAccount : "01097280514",
          cafeAddress: safeSettings.cafeAddress && !safeSettings.cafeAddress.includes("99st") ? safeSettings.cafeAddress : "101 شارع زمزم خلف مسجد الشيخ غراب - حدائق القبة",
          hasGeminiKey: Boolean(process.env.GEMINI_API_KEY || storedKey),
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export { PATCH as PUT };
