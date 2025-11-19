## التشخيص
- الخادم يعمل على `http://localhost:3001` ويخدم:
  - `GET /game` واجهة اللعبة
  - `GET /health` فحص الصحة
  - `GET /miniapp.json` إعدادات الـ Mini App
- شاشة "Service is unavailable" تظهر لأن المتصفح يفتح منفذًا مختلفًا (`localhost:49232` أو `localhost:49341`) لا يقدّم خدمتك.

## التغييرات المقترحة
1) ضبط عناوين التطوير
- تعيين `ROOT_URL` إلى `http://localhost:3001` في بيئة التطوير لضمان أن روابط `miniapp.json` تشير إلى المضيف الصحيح.
- تعيين `OWNER_ADDRESS` إلى عنوانك على Base بدل القيمة الافتراضية.

2) تحسين سهولة الوصول
- إعادة توجيه `GET /` تلقائيًا إلى `/game` بدل رسالة JSON لتقليل الالتباس عند فتح الجذر.

3) التحقق من الأصول
- التأكد من وجود الأصول الثابتة ضمن `public`: `icon.svg` (512×512)، `hero.svg` (1200×630)، `screenshot-portrait.svg` (1080×1920).

## خطوات التحقق
- فتح `http://localhost:3001/game` للتأكد من واجهة اللعبة.
- فتح `http://localhost:3001/miniapp.json` ومراجعة الروابط (`iconUrl`, `heroImageUrl`, `screenshotUrls`) تعمل محليًا.
- تجربة `POST /api/webhook` ببدن JSON بسيط للتأكد من الاستجابة `{ ok: true }`.

## النشر لاحقًا
- عند النشر، حدّث `ROOT_URL` إلى نطاقك الفعلي.
- أكمل خطوة ربط الحساب بإضافة `accountAssociation.header/payload/signature` وفق دليل Base.

سأطبّق هذه التغييرات الآن إذا وافقت.