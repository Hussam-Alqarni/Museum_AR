// القاموس الشامل لكل نصوص المشروع
window.translations = {
  ar: {
    "page_title_index": "أثر — جولة ثقافة سعودية",
    "page_title_museum": "متحفك الخاص - AR",
    "tour_eyebrow": "جولة رقمية · ثقافة سعودية",
    "tour_h1": "قطع تراث أمام عدستك",
    "tour_lead": "أربع وقفات: <strong>خيمة</strong>، <strong>دلة</strong>، <strong>سيف</strong>، وأخيراً <strong>مبخرة</strong>.",
    "tour_steps_title": "قبل ما تفتح الكاميرا",
    "step_1": "جهّز الرموز الأربعة بأي ترتيب.",
    "step_2": "عند ظهور المجسم، ستنتقل لشاشة حرة لتكبيره.",
    "step_3": "يمكنك تخطي الجولة لبناء متحفك الخاص!",
    "btn_start_cam": "افتح الكاميرا وابدأ الجولة",
    "scan_hint": "ابحث عن أي ماركر لعرض القطعة...",
    "skip_tour": "تخطي وبناء متحفك الخاص",
    "back_to_marker": "العودة للماركر",
    "loading_model": "جاري تجهيز المجسم...",
    "continue_search": "متابعة البحث",
    "done_title": "اكتملت المجموعة!",
    "done_desc": "لقد استكشفت جميع القطع الأثرية بنجاح.",
    "enter_museum": "دخول المتحف الخاص",
    "restart_tour": "إعادة الجولة",
    "discovered": "القطع المستكشفة:",
    "tent": "الخيمة",
    "dallah": "الدلة",
    "sword": "السيف",
    "mubkhara": "المبخرة",
    "info_tent": "الخيمة العربية (بيت الشعر): الملاذ الآمن ورمز الكرم والضيافة في البادية.",
    "info_dallah": "الدلة السعودية: رمز الأصالة والضيافة العربية، ولا يخلو منها أي مجلس.",
    "info_sword": "السيف العربي: رمز الشجاعة والقوة والفروسية، وجزء أساسي من العرضة السعودية.",
    "info_mubkhara": "المبخرة: رمز الترحيب والطيب، تستخدم لتبخير الضيوف بأجود أنواع العود.",
    "btn_back": "العودة للرئيسية",
    "start_tour": "👁️ بدء التجول",
    "end_tour": "إنهاء التجول ✖",
    "cam_start": "اضغط تشغيل الكاميرا للبدء",
    "btn_custom_ar": "تشغيل كاميرا الواقع المعزز",
    "slider_label": "الارتفاع",
    "ar_loading": "جاري تجهيز القطعة...",
    "drop_model": "➕ إسقاط المجسم هنا",
    "thank_you_title": "شكراً لزيارتك",
    "thank_you_desc": "لقد قمت بتصميم مساحة تراثية رائعة.",
    "selected": "تم اختيار",
    "drop": "- اضغط إسقاط",
    "cam_down": "وجّه الكاميرا للأسفل واضغط زر الإسقاط",
    "height": "الارتفاع:",
    "instructions": "اسحب للتحريك، وضع المزيد، أو ابدأ التجول!"
  },
  en: {
    "page_title_index": "Ather — Saudi Culture AR",
    "page_title_museum": "Private Museum - AR",
    "tour_eyebrow": "Digital Tour · Saudi Culture",
    "tour_h1": "Heritage Artifacts Through Your Lens",
    "tour_lead": "Four stops: <strong>Tent</strong>, <strong>Dallah</strong>, <strong>Sword</strong>, and <strong>Mubkhara</strong>.",
    "tour_steps_title": "Before opening the camera",
    "step_1": "Prepare the 4 markers, printed or on screen.",
    "step_2": "When the model appears, you can freely scale and rotate it.",
    "step_3": "You can skip the tour anytime to build your private museum!",
    "btn_start_cam": "Open Camera & Start Tour",
    "scan_hint": "Search for any marker to view the artifact...",
    "skip_tour": "Skip & Build Private Museum",
    "back_to_marker": "Back to Marker",
    "loading_model": "Loading model...",
    "continue_search": "Continue Searching",
    "done_title": "Collection Complete!",
    "done_desc": "You have successfully explored all artifacts.",
    "enter_museum": "Enter Private Museum",
    "restart_tour": "Restart Tour",
    "discovered": "Discovered:",
    "tent": "Tent",
    "dallah": "Dallah",
    "sword": "Sword",
    "mubkhara": "Mubkhara",
    "info_tent": "Arabic Tent (Bayt Al-Sha'ar): A safe haven and symbol of generosity and hospitality in the desert.",
    "info_dallah": "Saudi Dallah: The symbol of authenticity and Arab hospitality, essential in any gathering.",
    "info_sword": "Arabic Sword: A symbol of courage, strength, and chivalry, and a core part of the Saudi Ardah.",
    "info_mubkhara": "Mubkhara: A symbol of welcoming, used to honor guests with the finest Oud.",
    "btn_back": "Back to Home",
    "start_tour": "👁️ Start Tour",
    "end_tour": "End Tour ✖",
    "cam_start": "Press Start Camera",
    "btn_custom_ar": "Start AR Camera",
    "slider_label": "Height",
    "ar_loading": "Loading model...",
    "drop_model": "➕ Drop Model Here",
    "thank_you_title": "Thank You",
    "thank_you_desc": "You have designed a wonderful virtual heritage space.",
    "selected": "Selected",
    "drop": "- Press Drop",
    "cam_down": "Point camera down and press Drop",
    "height": "Height:",
    "instructions": "Drag to move, place more, or start Tour!"
  }
};

// جلب اللغة المحفوظة
window.currentLang = localStorage.getItem('appLang') || 'ar';

// 1. تغيير الاتجاه فوراً (حتى لا يحدث وميض)
document.documentElement.lang = window.currentLang;
document.documentElement.dir = window.currentLang === 'ar' ? 'rtl' : 'ltr';

// 2. دالة الترجمة التي ستعمل بعد تحميل الصفحة
function applyTranslations() {
  // ترجمة جميع العناصر التي تحتوي على data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (window.translations[window.currentLang][key]) {
      el.innerHTML = window.translations[window.currentLang][key];
    }
  });
  
  // تحديث نصوص أزرار التبديل
  document.querySelectorAll('.lang-switch-btn').forEach(btn => {
    btn.innerText = window.currentLang === 'ar' ? 'English' : 'العربية';
  });
}

// 3. انتظار تحميل كامل الصفحة (DOM) ثم بدء الترجمة
document.addEventListener("DOMContentLoaded", () => {
  applyTranslations(); // الآن سيجد النصوص ويترجمها بنجاح!

  // تفعيل أزرار تغيير اللغة
  document.querySelectorAll('.lang-switch-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const newLang = window.currentLang === 'ar' ? 'en' : 'ar';
      localStorage.setItem('appLang', newLang);
      window.location.reload(); 
    });
  });
});