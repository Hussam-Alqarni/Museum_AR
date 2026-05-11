const ARTIFACTS = [
  { id: "tent", name: "الخيمة العربية", src: "models/arabic_tent.glb", info: "تُعرف بـ 'بيت الشعر'، وهي تمثل التراث البدوي الأصيل." },
  { id: "dallah", name: "الدلة السعودية", src: "models/saudi_dallah.glb", info: "الرمز الأبرز للضيافة والكرم في المملكة لتقديم القهوة العربية." },
  { id: "sword", name: "السيف العربي", src: "models/arabic_sword.glb", info: "يُعد السيف رمزاً للشجاعة، ويحضر بقوة في المناسبات و'العرضة السعودية'." },
  { id: "mubkhara", name: "المبخرة", src: "models/mubkhara.glb", info: "تعكس الكرم وحفاوة الاستقبال وطيب العود في الثقافة السعودية." }
];

document.addEventListener("DOMContentLoaded", () => {
  let currentStep = 0;
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

  // إخفاء التحميل عند اكتمال المجسم
  mvElement.addEventListener('load', () => {
    mvLoading.style.display = 'none';
    mvElement.style.visibility = 'visible';
  });

  // زر البدء
  document.getElementById('btn-start').addEventListener('click', () => {
    uiWelcome.style.display = 'none';
    uiScan.style.display = 'flex';
    
    arWrapper.innerHTML = `
      <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;" vr-mode-ui="enabled: false">
        <a-marker id="m-0" type="pattern" url="markers/patt.hiro" emitevents="true"></a-marker>
        <a-marker id="m-1" type="pattern" url="markers/patt.kanji" emitevents="true"></a-marker>
        <a-marker id="m-2" type="pattern" url="markers/pattern-letterA.patt" emitevents="true"></a-marker>
        <a-marker id="m-3" type="pattern" url="markers/pattern-mubkhara.patt" emitevents="true"></a-marker>
        <a-entity camera></a-entity>
      </a-scene>
    `;

    setTimeout(() => {
      ARTIFACTS.forEach((art, i) => {
        const marker = document.getElementById('m-' + i);
        if (marker) {
          marker.addEventListener('markerFound', () => {
            if (currentStep === i && !isTransitioning) {
              isTransitioning = true;
              arWrapper.style.display = 'none'; 
              uiScan.style.display = 'none';
              ui360.style.display = 'flex';
              
              mvElement.style.visibility = 'hidden';
              mvLoading.style.display = 'flex'; // إظهار التحميل
              mvTitle.innerText = art.name;
              mvInfo.innerText = art.info;
              mvElement.src = art.src;
            }
          });
        }
      });
    }, 1000);
  });

  // أزرار الرجوع
  document.getElementById('btn-back-home').addEventListener('click', () => {
    arWrapper.innerHTML = ''; // إغلاق الكاميرا
    uiScan.style.display = 'none';
    uiWelcome.style.display = 'flex';
  });

  document.getElementById('btn-back-scan').addEventListener('click', () => {
    ui360.style.display = 'none';
    mvElement.src = "";
    isTransitioning = false;
    arWrapper.style.display = 'block';
    uiScan.style.display = 'flex';
  });

  document.getElementById('btn-restart-tour').addEventListener('click', () => {
    location.reload();
  });

  // زر التالي
  document.getElementById('btn-next').addEventListener('click', () => {
    ui360.style.display = 'none';
    mvElement.src = "";
    mvElement.style.visibility = 'hidden';
    
    currentStep++;
    isTransitioning = false; 
    
    if (currentStep >= ARTIFACTS.length) {
      uiDone.style.display = 'flex';
    } else {
      arWrapper.style.display = 'block'; 
      uiScan.style.display = 'flex';
    }
  });
});