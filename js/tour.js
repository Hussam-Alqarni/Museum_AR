const ARTIFACTS = [
  { id: "tent", name: "الخيمة", src: "models/arabic_tent.glb", scale: "0.2 0.2 0.2" },
  { id: "dallah", name: "الدلة", src: "models/saudi_dallah.glb", scale: "0.1 0.1 0.1" },
  { id: "sword", name: "السيف", src: "models/arabic_sword.glb", scale: "0.2 0.2 0.2" }
];

document.addEventListener("DOMContentLoaded", () => {
  let currentStep = 0;

  const uiWelcome = document.getElementById('welcome-screen');
  const uiScan = document.getElementById('scan-ui');
  const ui360 = document.getElementById('model-360-view');
  const uiDone = document.getElementById('done-screen');
  const mvElement = document.getElementById('mv-element');
  const mvTitle = document.getElementById('viewer-title');
  const arWrapper = document.getElementById('arjs-scene-wrapper');

  document.getElementById('btn-start').addEventListener('click', () => {
    uiWelcome.style.display = 'none';
    uiScan.style.display = 'flex';
    
    // حقن مشهد الماركرات
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
            if (currentStep === i) {
              arWrapper.style.display = 'none'; // إخفاء الكاميرا
              uiScan.style.display = 'none';
              ui360.style.display = 'flex';
              mvElement.src = art.src;
              mvTitle.innerText = art.name;
            }
          });
        }
      });
    }, 1000);
  });

  document.getElementById('btn-next').addEventListener('click', () => {
    ui360.style.display = 'none';
    mvElement.src = "";
    currentStep++;
    
    if (currentStep >= ARTIFACTS.length) {
      uiDone.style.display = 'flex';
    } else {
      arWrapper.style.display = 'block'; // إعادة الكاميرا
      uiScan.style.display = 'flex';
    }
  });
});