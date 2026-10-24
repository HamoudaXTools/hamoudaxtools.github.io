// Reuse the Firebase app initialized by the original site's compat SDK.
const note = document.getElementById('gateNote');
const licensePanel = document.getElementById('firebaseLicensePanel');
const licenseStatus = document.getElementById('licenseStatus');
const setNote = (message) => { if (note) note.textContent = message; };
const friendlyError = (e) => ({
 'auth/invalid-credential':'بيانات الدخول غير صحيحة.', 'auth/email-already-in-use':'هذا البريد مسجل بالفعل.',
 'auth/weak-password':'كلمة المرور ضعيفة؛ استخدم 6 أحرف على الأقل.', 'auth/invalid-email':'صيغة البريد الإلكتروني غير صحيحة.',
 'auth/popup-closed-by-user':'تم إغلاق نافذة Google قبل إكمال الدخول.', 'auth/unauthorized-domain':'أضف نطاق الموقع إلى Authorized domains في Firebase.',
 'functions/not-found':'خدمة التفعيل غير منشورة بعد.', 'functions/permission-denied':'هذا الكود غير صالح أو غير مخصص لحسابك.',
 'functions/failed-precondition':'إعدادات الخدمة غير مكتملة.'}[e?.code] || e?.message || 'حدث خطأ غير متوقع.');
if (!window.firebase || !firebase.apps.length) {
 setNote('تعذر تحميل Firebase SDK. تحقق من الإنترنت ثم حدّث الصفحة.');
} else {
 const auth = firebase.auth();
 let functions = null;
 try { if (firebase.functions) functions = firebase.app().functions(); } catch (_) {}
 let currentUser = auth.currentUser;
 const showPanel = user => { if (licensePanel) licensePanel.hidden = !user; };
 async function refreshLicense() {
   currentUser = auth.currentUser;
   if (!currentUser || !functions) { if (licenseStatus) licenseStatus.textContent='انشر Cloud Functions لعرض حالة الترخيص.'; return; }
   licenseStatus.textContent='جارٍ التحقق من الاشتراك…';
   try { const result = await functions.httpsCallable('getMyLicenseStatus')({}); const d = result.data || {};
     licenseStatus.textContent = d.active ? `الاشتراك نشط — ينتهي في ${new Date(d.expiresAt).toLocaleString('ar-EG')}` : 'لا يوجد اشتراك نشط. اختر خطة واطلب كود تفعيل من الإدارة.';
   } catch(e) { licenseStatus.textContent='تعذر جلب الحالة: '+friendlyError(e); }
 }
 auth.onAuthStateChanged(user => { currentUser=user; showPanel(user); if(user) refreshLicense(); });
 document.getElementById('refreshLicense')?.addEventListener('click',refreshLicense);
 document.getElementById('redeemLicenseForm')?.addEventListener('submit',async e=>{
   e.preventDefault(); currentUser=auth.currentUser;
   if(!currentUser || !functions){licenseStatus.textContent='سجّل الدخول وانشر Cloud Functions أولًا.';return;}
   const input=document.getElementById('licenseCode'); licenseStatus.textContent='جارٍ تفعيل الكود…';
   try { const res=await functions.httpsCallable('redeemActivationCode')({code:input.value.trim()}); licenseStatus.textContent=res.data?.message||'تم تفعيل الاشتراك.'; input.value=''; await refreshLicense(); }
   catch(err){licenseStatus.textContent=friendlyError(err);}
 });
 // The original site's Firebase email/Google/phone OTP flows remain intact.
}
