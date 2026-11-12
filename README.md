# Neon Assault — نسخه‌ی release برای مایکت

> مهم: مخزن گیت‌هاب را حتماً **Private** بسازید. فایل کلید امضا و APK به‌عنوان Artifact ذخیره می‌شوند
> و در مخزن عمومی برای همه‌ی کاربران گیت‌هاب قابل دانلود هستند.

## مرحله‌ی ۱: آپلود پروژه
یک مخزن Private بسازید و همه‌ی فایل‌های این پوشه را آپلود کنید (Add file ← Upload files).
پوشه‌ی `.github` مخفی است. مطمئن شوید این دو فایل در مخزن هستند:
`.github/workflows/build-apk.yml` و `.github/workflows/create-keystore.yml`
(اگر نبودند: Add file ← Create new file، مسیر را در کادر نام تایپ کنید و محتوا را بچسبانید).

## مرحله‌ی ۲: ساخت کلید امضا (فقط یک بار در عمر برنامه)
1. تب **Actions** ← «Create Keystore (run once)» ← **Run workflow**.
2. بعد از اتمام، از بخش Artifacts فایل `keystore-KEEP-PRIVATE` را دانلود کنید.
3. سه فایل داخلش هست: `release.jks`، `keystore_base64.txt`، `secrets_info.txt`.
4. **از این سه فایل جای امن نسخه‌ی پشتیبان بگیرید.** اگر کلید را گم کنید، دیگر نمی‌توانید
   نسخه‌ی جدید همان برنامه را در مایکت منتشر کنید.

## مرحله‌ی ۳: ثبت Secrets
Settings ← Secrets and variables ← Actions ← New repository secret. چهار Secret بسازید:

| نام | مقدار |
|---|---|
| `KEYSTORE_BASE64` | کل متن داخل `keystore_base64.txt` |
| `KEYSTORE_PASSWORD` | مقدار KEYSTORE_PASSWORD در `secrets_info.txt` |
| `KEY_ALIAS` | `neon` |
| `KEY_PASSWORD` | مقدار KEY_PASSWORD در `secrets_info.txt` |

## مرحله‌ی ۴: ساخت APK
Actions ← «Build Release APK» ← Run workflow. بعد از ۵ تا ۱۰ دقیقه از Artifacts فایل
`neon-assault-release-apk` را دانلود کنید. داخلش `neon-assault-v1.0.N.apk` است (امضاشده و آماده‌ی آپلود).

هر بار که ساخت اجرا شود، شماره‌ی نسخه (`versionCode`) خودکار بالا می‌رود، پس هر APK جدید برای
به‌روزرسانی در مایکت معتبر است.

## مرحله‌ی ۵: آپلود در مایکت
در پنل توسعه‌دهندگان مایکت برنامه‌ی جدید بسازید و همین APK را آپلود کنید. تصاویر تبلیغاتی و لوگو را
از پوشه‌ی `neon-assault-promo` استفاده کنید.

## نکته‌ها
- شناسه‌ی برنامه (`appId`) و نام برنامه در `capacitor.config.json` است. قبل از اولین انتشار،
  `com.neonassault.game` را به شناسه‌ی یکتای خودتان تغییر دهید. بعد از انتشار دیگر عوضش نکنید.
- بازی در `www/index.html` است. با هر تغییر و آپلود مجدد، APK جدید ساخته می‌شود.
- آیکون برنامه از `assets/icon-only.png` (۱۰۲۴×۱۰۲۴) ساخته می‌شود.
