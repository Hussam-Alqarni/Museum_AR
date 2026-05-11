const ARTIFACTS = [
  { id: "tent", name: "الخيمة العربية", src: "models/arabic_tent.glb", info: "تُعرف بـ 'بيت الشعر'، وهي تمثل التراث البدوي الأصيل." },
  { id: "dallah", name: "الدلة السعودية", src: "models/saudi_dallah.glb", info: "الرمز الأبرز للضيافة والكرم في المملكة لتقديم القهوة العربية." },
  { id: "sword", name: "السيف العربي", src: "models/arabic_sword.glb", info: "يُعد السيف رمزاً للشجاعة، ويحضر بقوة في المناسبات و'العرضة السعودية'." },
  { id: "mubkhara", name: "المبخرة", src: "models/mubkhara.glb", info: "تعكس الكرم وحفاوة الاستقبال وطيب العود في الثقافة السعودية." }
];

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
  
  // متغير العداد
  const discoveryCounter = document.getElementById('discovery-counter');

  // دالة لتحديث نص العداد
  function updateCounter() {
    // تحويل الأرقام الإنجليزية إلى عربية لتناسب التصميم
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤'];
    discoveryCounter.innerText = `القطع المستكشفة: ${arabicNumbers[foundItems.size]} / ٤`;
  }

  mvElement.addEventListener('load', () => {
    mvLoading.style.display = 'none';
    mvElement.style.visibility = 'visible';
  });

  document.getElementById('btn-start').addEventListener('click', () => {
    uiWelcome.style.display = 'none';
    uiScan.style.display = 'flex';
    discoveryCounter.style.display = 'block'; // إظهار العداد
    updateCounter();
    
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
            if (!isTransitioning) {
              isTransitioning = true;
              foundItems.add(i); 
              updateCounter(); // تحديث العداد فور إيجاد القطعة
              
              arWrapper.style.display = 'none'; 
              uiScan.style.display = 'none';
              ui360.style.display = 'flex';
              
              mvElement.style.visibility = 'hidden';
              mvLoading.style.display = 'flex'; 
              mvTitle.innerText = art.name;
              mvInfo.innerText = art.info;
              mvElement.src = art.src;

              if (foundItems.size >= ARTIFACTS.length) {
                btnNext.innerText = "إنهاء الجولة";
              } else {
                btnNext.innerText = "متابعة البحث عن باقي القطع";
              }
            }
          });
        }
      });
    }, 1000);
  });

  document.getElementById('btn-back-home').addEventListener('click', () => {
    arWrapper.innerHTML = ''; 
    uiScan.style.display = 'none';
    uiWelcome.style.display = 'flex';
    discoveryCounter.style.display = 'none'; // إخفاء العداد
    foundItems.clear(); 
    updateCounter();
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

  btnNext.addEventListener('click', () => {
    ui360.style.display = 'none';
    mvElement.src = "";
    mvElement.style.visibility = 'hidden';
    isTransitioning = false; 
    
    if (foundItems.size >= ARTIFACTS.length) {
      uiDone.style.display = 'flex';
      discoveryCounter.style.display = 'none'; // إخفاء العداد في شاشة النهاية
    } else {
      arWrapper.style.display = 'block'; 
      uiScan.style.display = 'flex';
    }
  });
});