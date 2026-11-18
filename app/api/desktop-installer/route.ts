import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/desktop-installer
 * Dynamically generates a Windows .bat desktop-icon installer pointing to the
 * exact live deployed Abu Adel Patisserie URL!
 */
export async function GET(req: NextRequest) {
  const origin =
    req.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || "https://abuadel.vercel.app";
  const cleanOrigin = origin.replace(/\/+$/, "");

  const psScript = `
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$ws = New-Object -ComObject WScript.Shell
$d = [Environment]::GetFolderPath('Desktop')
$p = [Environment]::GetFolderPath('Programs')

$browser = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
if (-not (Test-Path $browser)) { $browser = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' }
if (-not (Test-Path $browser)) { $browser = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' }
if (-not (Test-Path $browser)) { $browser = 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe' }

$dirApp = Join-Path $env:LOCALAPPDATA 'AbuAdelPatisserieStandalone'
New-Item -ItemType Directory -Force -Path $dirApp | Out-Null
$icoApp = Join-Path $dirApp 'abuadel.ico'
try {
  Invoke-WebRequest -Uri '${cleanOrigin}/abuadel.ico' -OutFile $icoApp -UseBasicParsing
} catch {
  try { Invoke-WebRequest -Uri '${cleanOrigin}/favicon.ico' -OutFile $icoApp -UseBasicParsing } catch {}
}

$title = 'Abu Adel Patisserie'
$url = '${cleanOrigin}/login'

foreach ($folder in @($d, $p)) {
  $lnk = $ws.CreateShortcut((Join-Path $folder ($title + '.lnk')))
  if ($browser -and (Test-Path $browser)) {
    $lnk.TargetPath = $browser
    $lnk.Arguments = '--app=' + $url + ' --start-maximized'
  } else {
    $lnk.TargetPath = $url
  }
  if (Test-Path $icoApp) { $lnk.IconLocation = $icoApp + ',0' }
  $lnk.Description = 'حلواني أبو عادل - أصل الحلويات (تطوير شركة أوركا 01018671000)'
  $lnk.Save()
}

Write-Host ''
Write-Host '  [OK] تم تثبيت أيقونة حلواني أبو عادل على سطح المكتب بنجاح!' -ForegroundColor Green
Start-Process $browser -ArgumentList ('--app=' + $url + ' --start-maximized')
`;

  const encoded = Buffer.from(psScript, "utf16le").toString("base64");

  const batContent = [
    "@echo off",
    "chcp 65001 >nul",
    "title تثبيت منظومة حلواني أبو عادل",
    "echo.",
    "echo   جاري تثبيت أيقونة حلواني أبو عادل على سطح المكتب...",
    "echo.",
    `powershell -NoProfile -ExecutionPolicy Bypass -EncodedCommand ${encoded}`,
    "echo.",
    "timeout /t 3 >nul",
  ].join("\r\n");

  return new NextResponse(batContent, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="Install-AbuAdel-Desktop.bat"',
      "Cache-Control": "no-store",
    },
  });
}
