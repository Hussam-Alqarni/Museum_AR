const ARTIFACTS = [
  { id: "tent", name: "الخيمة", src: "models/arabic_tent.glb", scale: "0.2 0.2 0.2" },
  { id: "dallah", name: "الدلة", src: "models/saudi_dallah.glb", scale: "0.1 0.1 0.1" },
  { id: "sword", name: "السيف", src: "models/arabic_sword.glb", scale: "0.2 0.2 0.2" }
];

document.addEventListener("DOMContentLoaded", () => {
  let selectedSrc = ARTIFACTS[0].src;
  let selectedScale = ARTIFACTS[0].scale;

  const itemsRow = document.getElementById('museum-items');
  
  // توليد أزرار اختيار المجسمات
  ARTIFACTS.forEach((art, index) => {
    const btn = document.createElement('div');
    btn.className = 'item-icon' + (index === 0 ? ' active' : '');
    btn.innerText = art.name;
    btn.onclick = () => {
      document.querySelectorAll('.item-icon').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSrc = art.src;
      selectedScale = art.scale;
    };
    itemsRow.appendChild(btn);
  });

  // تسجيل مكون إسقاط المجسمات على الأسطح
  AFRAME.registerComponent('museum-spawner', {
    init: function () {
      const reticle = document.getElementById('reticle');
      const scene = this.el.sceneEl;

      scene.addEventListener('click', (e) => {
        // إذا كان المؤشر ظاهراً (أي تم التعرف على السطح)
        if (reticle.getAttribute('visible')) {
          const position = reticle.getAttribute('position');
          
          const model = document.createElement('a-entity');
          model.setAttribute('gltf-model', selectedSrc);
          model.setAttribute('position', position);
          model.setAttribute('scale', selectedScale);
          
          scene.appendChild(model);
        }
      });
    }
  });

  document.getElementById('webxr-scene').setAttribute('museum-spawner', '');
});