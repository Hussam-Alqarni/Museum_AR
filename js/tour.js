// البيانات المحدثة مع المعلومات التاريخية
const ARTIFACTS = [
  { 
    id: "tent", name: "الخيمة العربية", src: "models/arabic_tent.glb", 
    info: "تُعرف بـ 'بيت الشعر'، وهي تمثل التراث البدوي الأصيل. صُممت لتتحمل قسوة الصحراء، وكانت مركزاً للكرم والضيافة والاجتماعات القبلية."
  },
  { 
    id: "dallah", name: "الدلة السعودية", src: "models/saudi_dallah.glb", 
    info: "الرمز الأبرز للضيافة والكرم في المملكة. تُستخدم لإعداد وتقديم القهوة العربية الممزوجة بالهيل والزعفران للضيوف كعلامة على الترحيب."
  },
  { 
    id: "sword", name: "السيف العربي", src: "models/arabic_sword.glb", 
    info: "يُعد السيف رمزاً للشجاعة، الفروسية، والفخر. يحضر بقوة في المناسبات الوطنية والأفراح، وخاصة في أداء 'العرضة السعودية'."
  }
];

document.addEventListener("DOMContentLoaded", () => {
  let currentStep = 0;
  let isTransitioning = false; // لمنع تكرار قراءة الماركر بسرعة

  const uiWelcome = document.getElementById('welcome-screen');
  const uiScan = document.getElementById('scan-ui');
  const ui360 = document.getElementById('model-360-view');
  const uiDone = document.getElementById('done-screen');
  
  const mvElement = document.getElementById('mv-element');
  const mvTitle = document.getElementById('viewer-title');
  const mvInfo = document.getElementById('viewer-info');
  const arWrapper = document.getElementById('arjs-scene-wrapper');

  // دالة إظهار المجسم بعد اكتمال تحميله (لمنع البطء وظهور المجسم القديم)
  mvElement.addEventListener('load', () => {
    mvElement.style.visibility = 'visible';
  });

  document.getElementById('btn-start').addEventListener('click', () => {
    uiWelcome.style.display = 'none';
    uiScan.style.display = 'flex';
    
    arWrapper.innerHTML = `
      <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;" vr-mode-ui="enabled: false">
        <a-marker id="m-0" type="pattern" url="markers/patt.hiro" emitevents="true"></a-marker>
        <a-marker id="m-1" type="pattern" url="markers/patt.kanji" emitevents="true"></a-marker>
        <a-marker id="m-2" type="pattern" url="markers/pattern-letterA.patt" emitevents="true"></a-marker>
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
              
              arWrapper.style.display = 'none'; // إخفاء كاميرا الماركرات
              uiScan.style.display = 'none';
              ui360.style.display = 'flex';
              
              // تحديث البيانات (المجسم سيكون مخفياً حتى يكتمل تحميله)
              mvElement.style.visibility = 'hidden';
              mvTitle.innerText = art.name;
              mvInfo.innerText = art.info;
              mvElement.src = art.src;
            }
          });
        }
      });
    }, 1000);
  });

  document.getElementById('btn-next').addEventListener('click', () => {
    ui360.style.display = 'none';
    
    // تفريغ المجسم فوراً لمنع ظهوره في الخطوة التالية
    mvElement.src = "";
    mvElement.style.visibility = 'hidden';
    
    currentStep++;
    isTransitioning = false; // فك القفل للخطوة التالية
    
    if (currentStep >= ARTIFACTS.length) {
      uiDone.style.display = 'flex';
    } else {
      arWrapper.style.display = 'block'; 
      uiScan.style.display = 'flex';
    }
  });
});