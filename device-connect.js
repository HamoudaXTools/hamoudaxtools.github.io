(() => {
  const byId = id => document.getElementById(id);
  const status = byId('hxt-device-status');
  const detail = byId('hxt-device-detail');
  const connect = byId('hxt-connect-btn');
  const choose = byId('hxt-choose-btn');
  const refresh = byId('hxt-refresh-btn');
  const actionGrid = byId('hxt-actions');
  const output = byId('hxt-device-output');

  if (!connect || !status || !detail) return;

  let selectedDevice = null;
  let deviceMeta = null;

  const setStatus = (title, description, state = 'idle') => {
    status.textContent = title;
    detail.textContent = description;
    status.dataset.state = state;
  };

  function showActions() {
    actionGrid.hidden = false;
    output.hidden = false;
    output.textContent = deviceMeta
      ? `تم اختيار الجهاز: ${deviceMeta.name}. نوع الاتصال: ${deviceMeta.transport}.\\nملاحظة: بيانات الموديل/الرقم التسلسلي قد لا تكون متاحة من MTP داخل المتصفح.`
      : 'تم اختيار الجهاز، لكن المتصفح لم يعرض بيانات تعريف كافية.';
    actionGrid.querySelectorAll('[data-device-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.deviceAction;
        const descriptions = {
          info: 'قراءة معلومات الجهاز: للحصول على الموديل وإصدار Android بشكل موثوق، شغّل برنامج Hamouda XTools Bridge على Windows مع موافقة المستخدم.',
          files: 'استعراض الملفات: MTP يسمح عادةً بنقل الملفات بعد فتح الهاتف واختيار File Transfer، لكن المتصفح لا يوفر واجهة MTP عامة موحدة. استخدم Windows Explorer أو Bridge الموثوق.',
          diagnostics: 'تشخيص USB: فحص MTP وحده لا يتيح قراءة سجلات ADB أو حالة Bootloader. استخدم Bridge وتعريفات USB المناسبة بعد موافقة المستخدم.',
          firmware: 'فحص السوفت وير: يمكن رفع ملف Firmware إلى الموقع لتحليله. التفليش الفعلي يتطلب برنامج Windows وأدوات الشركة والتوافق الصحيح.',
          backup: 'النسخ الاحتياطي: لا يبدأ الموقع نسخًا تلقائيًا. يلزم اختيار الملفات أو استخدام أداة موثوقة مع تأكيد المستخدم.',
          disconnect: 'يمكنك فصل الهاتف بأمان بعد إغلاق عمليات نقل الملفات.'
        };
        output.textContent = descriptions[action] || 'العملية المختارة تتطلب دعمًا من برنامج Windows المساعد.';
      });
    });
  }

  async function requestUsbDevice() {
    if (!('usb' in navigator)) {
      setStatus('المتصفح لا يدعم WebUSB', 'استخدم Chrome أو Edge على Windows. حتى مع WebUSB، أجهزة MTP غالبًا لا تكشف بياناتها بهذه الواجهة؛ الاتصال الكامل يحتاج Bridge.', 'warn');
      return;
    }
    try {
      setStatus('اختر جهاز USB', 'ستظهر نافذة المتصفح لاختيار جهاز. لن يتم الوصول إلى بيانات الجهاز قبل موافقتك.', 'pending');
      const device = await navigator.usb.requestDevice({ filters: [] });
      selectedDevice = device;
      deviceMeta = {
        name: [device.manufacturerName, device.productName].filter(Boolean).join(' ') || 'USB device',
        transport: 'WebUSB',
        vendorId: device.vendorId,
        productId: device.productId
      };
      setStatus('تم اكتشاف جهاز USB', `الاسم: ${deviceMeta.name} — VID: ${deviceMeta.vendorId.toString(16).padStart(4,'0')} — PID: ${deviceMeta.productId.toString(16).padStart(4,'0')}. هذا لا يضمن أن MTP أو أوامر الصيانة متاحة.`, 'ok');
      showActions();
    } catch (error) {
      if (error && error.name === 'NotFoundError') {
        setStatus('لم يتم اختيار جهاز', 'افتح الهاتف، اختر نقل الملفات (MTP)، ثم جرّب مرة أخرى.', 'idle');
      } else {
        setStatus('تعذر الاتصال', error?.message || 'لم يسمح المتصفح بالوصول إلى الجهاز.', 'warn');
      }
    }
  }

  async function requestSerialDevice() {
    if (!('serial' in navigator)) {
      setStatus('Web Serial غير متاح', 'قد يلزم Chrome أو Edge على Windows. هذا الخيار للأجهزة التسلسلية المتوافقة، وليس بديلًا عامًا لـ MTP.', 'warn');
      return;
    }
    try {
      const port = await navigator.serial.requestPort();
      const info = port.getInfo ? port.getInfo() : {};
      deviceMeta = { name: 'USB Serial device', transport: 'Web Serial', vendorId: info.usbVendorId, productId: info.usbProductId };
      selectedDevice = port;
      setStatus('تم اختيار منفذ USB Serial', 'تم اختيار المنفذ فقط؛ لم يتم إرسال أي أوامر للجهاز.', 'ok');
      showActions();
    } catch (error) {
      setStatus('لم يتم اختيار منفذ', error?.message || 'تم إلغاء الاختيار.', 'idle');
    }
  }

  connect.addEventListener('click', requestUsbDevice);
  choose.addEventListener('click', requestSerialDevice);
  refresh.addEventListener('click', () => {
    selectedDevice = null; deviceMeta = null; actionGrid.hidden = true; output.hidden = true;
    setStatus('في انتظار توصيل الهاتف', 'وصّل الهاتف بكابل USB، افتح قفل الشاشة، ثم اختر نقل الملفات (MTP) من إشعار USB. اضغط «اكتشاف جهاز» للمتابعة.');
  });

  if (navigator.usb && navigator.usb.addEventListener) {
    navigator.usb.addEventListener('connect', () => setStatus('تم توصيل USB', 'اضغط «اكتشاف جهاز» واختر الهاتف من نافذة المتصفح.', 'pending'));
    navigator.usb.addEventListener('disconnect', () => {
      selectedDevice = null; deviceMeta = null; actionGrid.hidden = true; output.hidden = true;
      setStatus('تم فصل الجهاز', 'وصّل الهاتف مرة أخرى لإعادة الاتصال.', 'idle');
    });
  }
})();