const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const crypto = require('node:crypto');
initializeApp();
const db = getFirestore();
const hashCode = (code) => crypto.createHash('sha256').update(String(code).trim().toUpperCase()).digest('hex');
const requireUser = (request) => { if (!request.auth) throw new HttpsError('unauthenticated','سجّل الدخول أولًا.'); return request.auth.uid; };

// Admin-only: issue codes from a trusted admin session with custom claim admin=true.
exports.createActivationCode = onCall(async (request) => {
  requireUser(request);
  if (request.auth.token.admin !== true) throw new HttpsError('permission-denied','هذه العملية للإدارة فقط.');
  const plan = request.data?.plan;
  const daysByPlan = {trial:7,monthly:30,annual:365};
  if (!Object.hasOwn(daysByPlan, plan)) throw new HttpsError('invalid-argument','خطة غير معروفة.');
  const rawCode = `HX-${crypto.randomBytes(4).toString('hex')}-${crypto.randomBytes(4).toString('hex')}`.toUpperCase();
  const id = hashCode(rawCode);
  await db.collection('activationCodes').doc(id).create({plan,days:daysByPlan[plan],createdAt:FieldValue.serverTimestamp(),createdBy:request.auth.uid,redeemed:false});
  return {code:rawCode,plan,days:daysByPlan[plan]};
});

exports.redeemActivationCode = onCall(async (request) => {
  const uid = requireUser(request);
  const code = String(request.data?.code || '').trim().toUpperCase();
  if (!/^HX-[A-F0-9]{8}-[A-F0-9]{8}$/.test(code)) throw new HttpsError('invalid-argument','صيغة كود التفعيل غير صحيحة.');
  const codeRef = db.collection('activationCodes').doc(hashCode(code));
  const licenseRef = db.collection('licenses').doc(uid);
  const result = await db.runTransaction(async tx => {
    const codeSnap = await tx.get(codeRef);
    if (!codeSnap.exists) throw new HttpsError('permission-denied','الكود غير صالح.');
    const c = codeSnap.data();
    if (c.redeemed) throw new HttpsError('already-exists','تم استخدام هذا الكود من قبل.');
    const licSnap = await tx.get(licenseRef);
    const now = Timestamp.now();
    const currentExpiry = licSnap.exists && licSnap.data().expiresAt?.toMillis() > now.toMillis() ? licSnap.data().expiresAt : now;
    const expiresAt = Timestamp.fromMillis(currentExpiry.toMillis() + c.days*24*60*60*1000);
    tx.update(codeRef,{redeemed:true,redeemedBy:uid,redeemedAt:FieldValue.serverTimestamp()});
    tx.set(licenseRef,{uid,plan:c.plan,active:true,expiresAt,updatedAt:FieldValue.serverTimestamp()});
    return {plan:c.plan,expiresAt:expiresAt.toDate().toISOString()};
  });
  return {message:'تم تفعيل الاشتراك بنجاح.',...result};
});

exports.getMyLicenseStatus = onCall(async request => {
  const uid = requireUser(request);
  const snap = await db.collection('licenses').doc(uid).get();
  if (!snap.exists) return {active:false};
  const data = snap.data();
  const active = data.active === true && data.expiresAt?.toMillis() > Date.now();
  return {active,plan:data.plan || null,expiresAt:data.expiresAt?.toDate().toISOString() || null};
});
