## الهدف
- إكمال متطلبات Base Mini App: manifest صحيح، أصول صور بالحجم المناسب، قيم env، وWebhook.

## ما سأضيفه
1) أصول ثابتة (public):
- icon.svg 512×512
- hero.svg 1200×630
- screenshot-portrait.svg 1080×1920
2) Manifest على `/miniapp.json`:
- تضمين `baseBuilder.ownerAddress` من `OWNER_ADDRESS`
- ضبط روابط الأصول إلى ملفات `public/*.svg`
- إضافة `noindex: true`
3) بيئة التشغيل:
- إضافة `ROOT_URL` و`OWNER_ADDRESS` في `render.yaml`
4) Webhook:
- مسار `POST /api/webhook` موجود ويعيد `{ok:true}`

## تحقق
- فتح `http://localhost:3001/miniapp.json` للتأكد من الحقول والقيم
- التأكد من خدمة الأصول عبر `express.static('public')`

سأبدأ بتنفيذ هذه الخطوات الآن.