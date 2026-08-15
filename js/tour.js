const t = window.translations[window.currentLang];

// ربط المعرفات بمؤشرات ملف الـ targets.mind من 0 إلى 3
const ARTIFACTS_MAP = {
  "marker0": { id: "tent", name: t.tent, info: t.info_tent, src: "models/arabic_tent.glb" },
  "marker1": { id: "dallah", name: t.dallah, info: t.info_dallah, src: "models/saudi_dallah.glb" },
  "marker2": { id: "sword", name: t.sword, info: t.info_sword, src: "models/arabic_sword.glb" },
  "marker3": { id: "mubkhara", name: t.mubkhara, info: t.info_mubkhara, src: "models/mubkhara.glb" }
};

let discoveredCount = 0;
const discoveredIds = new Set();

const welcomeScreen = document.getElementById('welcome-screen');
const scanUi = document.getElementById('scan-ui');
const model360View = document.getElementById('model-360-view');
const doneScreen = document.getElementById('done-screen');
const counterBadge = document.getElementById('discovery-counter');
const arjsWrapper = document.getElementById('arjs-scene-wrapper');

document.getElementById('btn-start').addEventListener('click', startTour);
document.getElementById('btn-back-scan').addEventListener('click', backToScan);
document.getElementById('btn-next').addEventListener('click', backToScan);
document.getElementById('btn-restart-tour').addEventListener('click', restartTour);

const artifactPicker = document.getElementById('artifact-picker');
document.getElementById('btn-no-marker').addEventListener('click', () => {
  artifactPicker.style.display = 'flex';
});
document.getElementById('btn-picker-close').addEventListener('click', () => {
  artifactPicker.style.display = 'none';
});
document.querySelectorAll('.picker-item').forEach(btn => {
  btn.addEventListener('click', () => {
    artifactPicker.style.display = 'none';
    onMarkerFound(btn.dataset.marker);
  });
});

function updateCounterUI() {
  counterBadge.innerText = `${t.discovered} ${discoveredCount} / 4`;
  if (discoveredCount > 0) counterBadge.style.display = 'block';
}
updateCounterUI();

function startTour() {
  welcomeScreen.style.display = 'none';
  scanUi.style.display = 'flex';
  
  const langBtn = document.querySelector('.welcome-lang-btn');
  if (langBtn) langBtn.style.display = 'none';
  
  counterBadge.style.display = 'block';
  initAR();
}

function initAR() {
  // حقن مشهد MindAR واستدعاء ملف targets.mind الذي يجمع الصور الأربع
  arjsWrapper.innerHTML = `
    <a-scene mindar-image="imageTargetSrc: markers/targets.mind; autoStart: true; uiScanning: no;" color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false">
      <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
      
      <a-entity mindar-image-target="targetIndex: 0" id="marker0"></a-entity>
      <a-entity mindar-image-target="targetIndex: 1" id="marker1"></a-entity>
      <a-entity mindar-image-target="targetIndex: 2" id="marker2"></a-entity>
      <a-entity mindar-image-target="targetIndex: 3" id="marker3"></a-entity>
    </a-scene>
  `;
  
  setTimeout(() => {
    Object.keys(ARTIFACTS_MAP).forEach(markerId => {
      const markerEl = document.getElementById(markerId);
      if (markerEl) {
        // في MindAR الحدث اسمه targetFound بدلاً من markerFound
        markerEl.addEventListener('targetFound', () => onMarkerFound(markerId));
      }
    });
  }, 1000);
}

function onMarkerFound(markerId) {
  const artifact = ARTIFACTS_MAP[markerId];
  if (!discoveredIds.has(artifact.id)) {
    discoveredIds.add(artifact.id);
    discoveredCount++;
    updateCounterUI();
  }
  show360View(artifact);
}

function show360View(artifact) {
  scanUi.style.display = 'none';
  arjsWrapper.style.display = 'none';
  model360View.style.display = 'flex';
  
  document.getElementById('viewer-title').innerText = artifact.name;
  document.getElementById('viewer-info').innerText = artifact.info;
  
  const mvElement = document.getElementById('mv-element');
  const mvLoading = document.getElementById('mv-loading');
  
  mvElement.style.visibility = 'hidden';
  mvLoading.style.display = 'flex';
  mvElement.src = artifact.src;
  
  mvElement.addEventListener('load', () => {
    mvLoading.style.display = 'none';
    mvElement.style.visibility = 'visible';
  }, { once: true });
}

function backToScan() {
  if (discoveredCount >= 4) {
    model360View.style.display = 'none';
    doneScreen.style.display = 'flex';
    counterBadge.style.display = 'none';
  } else {
    model360View.style.display = 'none';
    scanUi.style.display = 'flex';
    arjsWrapper.style.display = 'block';
  }
}

function restartTour() {
  discoveredCount = 0;
  discoveredIds.clear();
  updateCounterUI();
  doneScreen.style.display = 'none';
  scanUi.style.display = 'flex';
  arjsWrapper.style.display = 'block';
  counterBadge.style.display = 'block';
}