## ما سنقوم به الآن
1) إعداد متغيرات البيئة محليًا
- ضبط ROOT_URL إلى http://localhost:3001
- ضبط OWNER_ADDRESS إلى عنوانك على Base (0x...)

2) تعديل توجيه الجذر
- تحديث مسار GET / ليعيد توجيهًا إلى /game بدل JSON

3) التحقق محليًا
- فتح /game و/miniapp.json للتأكد من الروابط تعمل على 3001
- فحص /api/webhook بإرسال JSON بسيط

4) التحضير للنشر
- عند النشر، تغيير ROOT_URL إلى نطاقك العام
- إكمال accountAssociation (header/payload/signature) وفق دليل Base

## تفاصيل التنفيذ المقترحة (جاهزة للتطبيق)
- Windows PowerShell:
- `$env:ROOT_URL = 'http://localhost:3001'`
- `$env:OWNER_ADDRESS = '0xYourBaseAddress'`
- ثم تشغيل: `npm start`

- تعديل الجذر في index.js:
- استبدال معالج GET / ليكون: `res.redirect('/game')`

- بعد التأكد محليًا، نضبط render.yaml بقيم production (ROOT_URL لنطاقك، OWNER_ADDRESS لعنوانك)، ثم نكمل ربط الحساب.

أوافق على تنفيذ هذه الخطوات الآن؟