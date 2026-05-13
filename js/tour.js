const ARTIFACTS_MAP = {
  "marker-tent": { name: "الخيمة العربية", src: "models/arabic_tent.glb", info: "تُعرف بـ 'بيت الشعر'، وهي تمثل التراث البدوي الأصيل." },
  "marker-dallah": { name: "الدلة السعودية", src: "models/saudi_dallah.glb", info: "الرمز الأبرز للضيافة والكرم في المملكة لتقديم القهوة العربية." },
  "marker-sword": { name: "السيف العربي", src: "models/arabic_sword.glb", info: "يُعد السيف رمزاً للشجاعة، ويحضر بقوة في المناسبات و'العرضة السعودية'." },
  "marker-mubkhara": { name: "المبخرة", src: "models/mubkhara.glb", info: "تعكس الكرم وحفاوة الاستقبال وطيب العود في الثقافة السعودية." }
};

let foundItems = new Set(); 
let isTransitioning = false;

// 💡 المكون البرمجي الرسمي والآمن لالتقاط الماركرات من جذورها (بدون الاعتماد على المتصفح)
AFRAME.registerComponent('marker-handler', {
  init: function () {
    this.el.addEventListener('markerFound', () => {
      if (isTransitioning) return;

      const markerId = this.el.id; // استخراج اسم الماركر الذي التقطته الكاميرا فوراً
      const art = ARTIFACTS_MAP[markerId];

      if (art) {
        isTransitioning = true;
        foundItems.add(markerId); 
        
        // تحديث العداد
        const discoveryCounter = document.getElementById('discovery-counter');
        const arabicNumbers = ['٠', '١', '٢', '٣', '٤'];
        discoveryCounter.innerText = `القطع المستكشفة: ${arabicNumbers[foundItems.size]} / ٤`;
        
        // إخفاء الكاميرا وعرض المجسم 360
        document.getElementById('arjs-scene-wrapper').style.display = 'none'; 
        document.getElementById('scan-ui').style.display = 'none';
        document.getElementById('model-360-view').style.display = 'flex';
        
        const mvElement = document.getElementById('mv-element');
        mvElement.style.visibility = 'hidden';
        document.getElementById('mv-loading').style.display = 'flex'; 
        document.getElementById('viewer-title').innerText = art.name;
        document.getElementById('viewer-info').innerText = art.info;
        mvElement.src = art.src;

        const btnNext = document.getElementById('btn-next');
        if (foundItems.size >= 4) {
          btnNext.innerText = "إنهاء الجولة";
        } else {
          btnNext.innerText = "متابعة البحث عن باقي القطع";
        }
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const uiWelcome = document.getElementById('welcome-screen');
  const uiScan = document.getElementById('scan-ui');
  const ui360 = document.getElementById('model-360-view');
  const uiDone = document.getElementById('done-screen');
  const mvElement = document.getElementById('mv-element');
  const mvLoading = document.getElementById('mv-loading');
  const arWrapper = document.getElementById('arjs-scene-wrapper');
  const btnNext = document.getElementById('btn-next');
  const discoveryCounter = document.getElementById('discovery-counter');

  // إخفاء التحميل عند ظهور المجسم 360
  mvElement.addEventListener('load', () => {
    mvLoading.style.display = 'none';
    mvElement.style.visibility = 'visible';
  });

  // زر البدء 
  document.getElementById('btn-start').addEventListener('click', () => {
    uiWelcome.style.display = 'none';
    uiScan.style.display = 'block';
    discoveryCounter.style.display = 'block';
    
    // 💡 تم إصلاح الماركرات (preset) وتمت إضافة الشريحة الذكية (marker-handler) بداخلها
    arWrapper.innerHTML = `
      <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;" vr-mode-ui="enabled: false">
        <a-marker id="marker-tent" preset="hiro" emitevents="true" marker-handler></a-marker>
        <a-marker id="marker-dallah" preset="kanji" emitevents="true" marker-handler></a-marker>
        <a-marker id="marker-sword" type="pattern" url="markers/pattern-letterA.patt" emitevents="true" marker-handler></a-marker>
        <a-marker id="marker-mubkhara" type="pattern" url="markers/pattern-mubkhara.patt" emitevents="true" marker-handler></a-marker>
        <a-entity camera></a-entity>
      </a-scene>
    `;
  });

  // أزرار التحكم والرجوع
  document.getElementById('btn-back-home').addEventListener('click', () => {
    window.location.reload(); 
  });

  document.getElementById('btn-back-scan').addEventListener('click', () => {
    ui360.style.display = 'none';
    mvElement.src = "";
    isTransitioning = false; 
    arWrapper.style.display = 'block';
    uiScan.style.display = 'block';
  });

  document.getElementById('btn-restart-tour').addEventListener('click', () => {
    location.reload();
  });

  btnNext.addEventListener('click', () => {
    ui360.style.display = 'none';
    mvElement.src = "";
    mvElement.style.visibility = 'hidden';
    isTransitioning = false; 
    
    if (foundItems.size >= 4) {
      uiDone.style.display = 'flex';
      discoveryCounter.style.display = 'none';
    } else {
      arWrapper.style.display = 'block'; 
      uiScan.style.display = 'block';
    }
  });
});