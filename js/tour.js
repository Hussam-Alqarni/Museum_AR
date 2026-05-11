// خريطة دقيقة تربط معرّف الماركر (ID) بالقطعة الخاصة به بشكل قاطع
const MARKER_MAP = {
  "marker-hiro": { id: "tent", name: "الخيمة العربية", src: "models/arabic_tent.glb", info: "تُعرف بـ 'بيت الشعر'، وهي تمثل التراث البدوي الأصيل." },
  "marker-kanji": { id: "dallah", name: "الدلة السعودية", src: "models/saudi_dallah.glb", info: "الرمز الأبرز للضيافة والكرم في المملكة لتقديم القهوة العربية." },
  "marker-letterA": { id: "sword", name: "السيف العربي", src: "models/arabic_sword.glb", info: "يُعد السيف رمزاً للشجاعة، ويحضر بقوة في المناسبات و'العرضة السعودية'." },
  "marker-mubkhara": { id: "mubkhara", name: "المبخرة", src: "models/mubkhara.glb", info: "تعكس الكرم وحفاوة الاستقبال وطيب العود في الثقافة السعودية." }
};

document.addEventListener("DOMContentLoaded", () => {
  let foundItems = new Set(); 
  let isTransitioning = false; 

  const uiWelcome = document.getElementById('welcome-screen');
  const uiScan = document.getElementById('scan-ui');
  const ui360 = document.getElementById('model-360-view');
  const uiDone = document.getElementById('done-screen');
  
  const mvElement = document.getElementById('mv-element');
  const mvTitle = document.getElementById('viewer-title');
  const mvInfo = document.getElementById('viewer-info');
  const mvLoading = document.getElementById('mv-loading');
  const arWrapper = document.getElementById('arjs-scene-wrapper');
  const btnNext = document.getElementById('btn-next');
  const discoveryCounter = document.getElementById('discovery-counter');

  function updateCounter() {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤'];
    discoveryCounter.innerText = `القطع المستكشفة: ${arabicNumbers[foundItems.size]} / ٤`;
  }

  mvElement.addEventListener('load', () => {
    mvLoading.style.display = 'none';
    mvElement.style.visibility = 'visible';
  });

  // الاستماع المباشر للكاميرا للتعرف على أي ماركر بأي ترتيب
  window.addEventListener('markerFound', (e) => {
    if (isTransitioning) return; // منع التكرار اللحظي السريع

    const markerId = e.target.id;
    const art = MARKER_MAP[markerId]; // جلب المجسم الخاص بالماركر الصحيح 100%

    if (art) {
      isTransitioning = true;
      foundItems.add(markerId); // حفظه في العداد
      updateCounter();
      
      arWrapper.style.display = 'none'; 
      uiScan.style.display = 'none';
      ui360.style.display = 'flex';
      
      mvElement.style.visibility = 'hidden';
      mvLoading.style.display = 'flex'; 
      mvTitle.innerText = art.name;
      mvInfo.innerText = art.info;
      mvElement.src = art.src;

      if (foundItems.size >= Object.keys(MARKER_MAP).length) {
        btnNext.innerText = "إنهاء الجولة";
      } else {
        btnNext.innerText = "متابعة البحث عن باقي القطع";
      }
    }
  });

  document.getElementById('btn-start').addEventListener('click', () => {
    uiWelcome.style.display = 'none';
    uiScan.style.display = 'block';
    discoveryCounter.style.display = 'block';
    updateCounter();
    
    // وضع جميع الماركرات دفعة واحدة وإعطائها IDs متطابقة مع الخريطة
    arWrapper.innerHTML = `
      <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;" vr-mode-ui="enabled: false">
        <a-marker id="marker-hiro" type="pattern" url="markers/patt.hiro" emitevents="true"></a-marker>
        <a-marker id="marker-kanji" type="pattern" url="markers/patt.kanji" emitevents="true"></a-marker>
        <a-marker id="marker-letterA" type="pattern" url="markers/pattern-letterA.patt" emitevents="true"></a-marker>
        <a-marker id="marker-mubkhara" type="pattern" url="markers/pattern-mubkhara.patt" emitevents="true"></a-marker>
        <a-entity camera></a-entity>
      </a-scene>
    `;
  });

  // حل مشكلة زر الرجوع للرئيسية عبر إعادة تحميل الصفحة لمنع بقاء الكاميرا معلقة
  document.getElementById('btn-back-home').addEventListener('click', () => {
    window.location.reload(); 
  });

  document.getElementById('btn-back-scan').addEventListener('click', () => {
    ui360.style.display = 'none';
    mvElement.src = "";
    isTransitioning = false; // السماح للكاميرا بالتقاط الماركر مجدداً (حتى لو كان مكرراً)
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
    
    if (foundItems.size >= Object.keys(MARKER_MAP).length) {
      uiDone.style.display = 'flex';
      discoveryCounter.style.display = 'none';
    } else {
      arWrapper.style.display = 'block'; 
      uiScan.style.display = 'block';
    }
  });
});