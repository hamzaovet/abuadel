import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("🍰 Seeding Standalone Abu Adel Patisserie Database...");

  // 1. System Settings (Pure Abu Adel Patisserie defaults)
  await prisma.systemSettings.upsert({
    where: { id: "default-settings" },
    update: {
      brandNameAr: "حلواني أبو عادل",
      brandNameEn: "Abu Adel Patisserie",
      cafeAddress: "حدائق القبة - القاهرة",
      abuAdelPhone: "15992",
      hotline: "15992",
      whatsapp: "01018671000",
      instapayAccount: "abuadel@instapay",
      vodafoneCashNumber: "01018671000",
      deliveryFee: 20,
      preOrderDepositPercent: 30,
      isServiceChargeEnabled: false,
      isTaxEnabled: false,
      isLoyaltyEnabled: true,
      loyaltyAppliesToAbuAdel: true,
      loyaltyAppliesToSoulmate: false,
      loyaltyMotivationalMsg:
        "جمّع نقاط مع كل أوردر من حلواني أبو عادل واستمتع بهدايا وخصومات فورية 🎁🍰",
      shift1Name: "الوردية الأولى (الصباحية)",
      shift1Pin: "1111",
      shift2Name: "الوردية الثانية (المسائية)",
      shift2Pin: "2222",
      receiptFooterNotes: "حلواني أبو عادل — أصل الحلويات • الخط الساخن 15992",
    },
    create: {
      id: "default-settings",
      brandNameAr: "حلواني أبو عادل",
      brandNameEn: "Abu Adel Patisserie",
      cafeAddress: "حدائق القبة - القاهرة",
      abuAdelPhone: "15992",
      hotline: "15992",
      whatsapp: "01018671000",
      instapayAccount: "abuadel@instapay",
      vodafoneCashNumber: "01018671000",
      deliveryFee: 20,
      preOrderDepositPercent: 30,
      isServiceChargeEnabled: false,
      isTaxEnabled: false,
      isLoyaltyEnabled: true,
      loyaltyAppliesToAbuAdel: true,
      loyaltyAppliesToSoulmate: false,
      loyaltyMotivationalMsg:
        "جمّع نقاط مع كل أوردر من حلواني أبو عادل واستمتع بهدايا وخصومات فورية 🎁🍰",
      shift1Name: "الوردية الأولى (الصباحية)",
      shift1Pin: "1111",
      shift2Name: "الوردية الثانية (المسائية)",
      shift2Pin: "2222",
      receiptFooterNotes: "حلواني أبو عادل — أصل الحلويات • الخط الساخن 15992",
    },
  });

  // 2. Single Outlet: ABU_ADEL_PATISSERIE ONLY (No Soulmate, No Dining Tables!)
  const abuAdel = await prisma.outlet.upsert({
    where: { code: "ABU_ADEL_PATISSERIE" },
    update: {
      name: "حلواني أبو عادل (أصل الحلويات)",
      type: "PATISSERIE",
      address: "حدائق القبة - القاهرة",
      phone: "15992",
      whatsapp: "01018671000",
      logoUrl: "/abuadel-logo.svg",
      isActive: true,
    },
    create: {
      code: "ABU_ADEL_PATISSERIE",
      name: "حلواني أبو عادل (أصل الحلويات)",
      type: "PATISSERIE",
      address: "حدائق القبة - القاهرة",
      phone: "15992",
      whatsapp: "01018671000",
      logoUrl: "/abuadel-logo.svg",
      isActive: true,
    },
  });

  // 3. Pure Abu Adel Users (Owner, Branch Manager, Cashier)
  const users = [
    {
      username: "maestro",
      name: "أ / حمزة عباس (المايسترو - المالك)",
      passwordHash: "123456789",
      pin: "157230",
      role: "owner",
      outletId: abuAdel.id,
      phone: "01018671000",
      isActive: true,
    },
    {
      username: "manager-abuadel",
      name: "مدير فرع حلواني أبو عادل",
      passwordHash: "abuadel@2026",
      pin: "654321",
      role: "branch_manager",
      outletId: abuAdel.id,
      phone: "15992",
      isActive: true,
    },
    {
      username: "cashier-abuadel",
      name: "كاشير حلواني أبو عادل",
      passwordHash: "cashier@abuadel",
      pin: "1111",
      role: "cashier",
      outletId: abuAdel.id,
      phone: "15992",
      isActive: true,
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { username: u.username },
      update: u,
      create: u,
    });
  }

  // 4. Delivery Zones
  const zones = [
    { nameAr: "حدائق القبة والوايلي", fee: 20, estimatedTime: "25-35 دقيقة", sortOrder: 1 },
    { nameAr: "الزيتون وحلمية الزيتون", fee: 25, estimatedTime: "30-40 دقيقة", sortOrder: 2 },
    { nameAr: "العباسية والدمرداش", fee: 25, estimatedTime: "30-40 دقيقة", sortOrder: 3 },
    { nameAr: "مصر الجديدة والكوربة", fee: 35, estimatedTime: "35-45 دقيقة", sortOrder: 4 },
    { nameAr: "مدينة نصر", fee: 40, estimatedTime: "40-55 دقيقة", sortOrder: 5 },
    { nameAr: "شبرا وروض الفرج", fee: 35, estimatedTime: "35-45 دقيقة", sortOrder: 6 },
    { nameAr: "المطرية وعين شمس", fee: 30, estimatedTime: "35-45 دقيقة", sortOrder: 7 },
    { nameAr: "وسط البلد والزمالك", fee: 45, estimatedTime: "45-60 دقيقة", sortOrder: 8 },
  ];

  for (const z of zones) {
    const existing = await prisma.deliveryZone.findFirst({ where: { nameAr: z.nameAr } });
    if (!existing) {
      await prisma.deliveryZone.create({ data: { ...z, isActive: true } });
    }
  }

  // 5. Main Factory Supplier
  const existingFactory = await prisma.supplier.findFirst({
    where: { outletId: abuAdel.id, code: "MAIN_FACTORY" },
  });
  if (!existingFactory) {
    await prisma.supplier.create({
      data: {
        outletId: abuAdel.id,
        code: "MAIN_FACTORY",
        name: "معمل ومصنع حلواني أبو عادل الرئيسي",
        supplierType: "FACTORY",
        phone: "15992",
        contactPerson: "إدارة المعمل الرئيسي",
        notes: "المورد الرئيسي لتوريد الحلويات الشرقية والغربية والتورت والنواعم يومياً",
        isActive: true,
      },
    });
  }

  console.log("✅ Abu Adel Patisserie base entities seeded! Now run seed_real_abuadel_menu.ts.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
