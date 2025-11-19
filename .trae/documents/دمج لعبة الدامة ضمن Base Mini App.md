## الهدف
- تجهيز مشروعك كـ Base Mini App وفق دليل "Create a Mini App" ليعمل بسلاسة داخل Base.

## ما سنضيفه
1) مسار إعدادات الميني-آب (Manifest)
- إضافة نقطة نهاية تُرجع إعدادات الميني-آب بصيغة JSON (شكل minikitConfig) على مسار مثل `/miniapp.json`.
- الحقول الأساسية: `version`, `name`, `subtitle`, `description`, `screenshotUrls`, `iconUrl`, `splashImageUrl`, `splashBackgroundColor`, `homeUrl`, `webhookUrl`, `primaryCategory`, `tags`, `heroImageUrl`, `tagline`, `ogTitle`, `ogDescription`, `ogImageUrl`.
- ترك `accountAssociation.header/payload/signature` فارغة حاليًا (تُملأ لاحقًا في خطوة الربط).

2) أصول ثابتة (Assets)
- إنشاء مجلد `public` ورفع صور: `blue-icon.png`, `blue-hero.png`, `screenshot-portrait.png`.
- خدمة هذه الأصول عبر `express.static` بحيث تصبح الروابط مثل: `ROOT_URL/blue-icon.png`.

3) تحديد `ROOT_URL`
- استخدام `process.env.ROOT_URL` إن وجد؛ افتراضيًا `http://localhost:3001` محليًا.
- ضبط `homeUrl` ليكون `ROOT_URL + '/game'`.

4) مسار ويبهوك
- إضافة `POST /api/webhook` لتلقي أحداث الميني-آب (Stub أولي يسجّل الحدث ويُرجع 200).

5) تعديلات خادم بسيطة
- إضافة `app.use(express.static('public'))`.
- إضافة مسار `/miniapp.json` يُولّد الكائن حسب القيم البيئية/الافتراضية.

6) التحقق
- فتح `http://localhost:3001/miniapp.json` والتأكد من صحة البنية.
- فتح `http://localhost:3001/game` والتأكد من عمل الصور ضمن الواجهة.
- تجربة إرسال `POST` لـ `/api/webhook` ببدن JSON بسيط للتحقق من التسجيل.

## ملاحظات
- لا أسرار في الكود؛ الربط بالحساب يتم لاحقًا بإضافة تواقيع ضمن `accountAssociation` وفق دليل Base.
- يمكننا تخصيص الاسم/التصنيف/العلامات حسب تفضيلاتك.

## التسليم
- تنفيذ التغييرات المطلوبة داخل الخادم، إضافة مجلد الأصول، وتمرير manifest وwebhook جاهزين للتكامل.