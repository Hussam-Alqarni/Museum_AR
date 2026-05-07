const ARTIFACTS = [
  { id: "tent", name: "الخيمة", src: "models/arabic_tent.glb", scale: "0.2 0.2 0.2" },
  { id: "dallah", name: "الدلة", src: "models/saudi_dallah.glb", scale: "0.1 0.1 0.1" },
  { id: "sword", name: "السيف", src: "models/arabic_sword.glb", scale: "0.2 0.2 0.2" }
];

document.addEventListener("DOMContentLoaded", () => {
  let selectedSrc = ARTIFACTS[0].src;
  let selectedScale = ARTIFACTS[0].scale;
  let activeModel = null; 

  const itemsRow = document.getElementById('museum-items');
  const instructionBadge = document.getElementById('ar-instruction');
  const bottomPanel = document.getElementById('bottom-panel');
  const btnCustomAr = document.getElementById('btn-custom-ar');
  const scene = document.querySelector('a-scene');
  const reticle = document.getElementById('reticle');
  
  // توليد الأزرار
  ARTIFACTS.forEach((art, index) => {
    const btn = document.createElement('div');
    btn.className = 'ar-item-btn' + (index === 0 ? ' active' : '');
    btn.innerHTML = `<span>${art.name}</span>`;
    
    btn.onclick = () => {
      document.querySelectorAll('.ar-item-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSrc = art.src;
      selectedScale = art.scale;
    };
    itemsRow.appendChild(btn);
  });

  // إخفاء زر الكاميرا الكبير وإظهار أدوات المتحف عند تشغيل الكاميرا
  scene.addEventListener('enter-vr', () => {
    btnCustomAr.style.display = 'none';
    bottomPanel.style.display = 'block';
    instructionBadge.style.display = 'block';
  });

  // تحديث التوجيهات
  setInterval(() => {
    if (scene.is('ar-mode')) {
      if (reticle.getAttribute('visible')) {
        instructionBadge.innerText = "اضغط على الشاشة لإضافة المجسم";
        instructionBadge.style.background = "rgba(212, 175, 55, 0.9)";
        instructionBadge.style.color = "black";
      } else {
        instructionBadge.innerText = "امسح الأرضية ببطء حتى تظهر الدائرة...";
        instructionBadge.style.background = "rgba(0, 0, 0, 0.6)";
        instructionBadge.style.color = "white";
      }
    }
  }, 500);

  // مكون الإسقاط والتحكم
  AFRAME.registerComponent('museum-controller', {
    init: function () {
      const el = this.el;

      el.addEventListener('click', (e) => {
        if (!el.is('ar-mode')) return;

        if (reticle.getAttribute('visible')) {
          const position = reticle.getAttribute('position');
          const model = document.createElement('a-entity');
          model.setAttribute('gltf-model', selectedSrc);
          model.setAttribute('position', position);
          model.setAttribute('scale', selectedScale);
          
          model.setAttribute('animation', {
            property: 'scale', from: '0 0 0', to: selectedScale, dur: 600, easing: 'easeOutElastic'
          });

          el.appendChild(model);
          activeModel = model; 
          
          instructionBadge.innerText = "اسحب يميناً/يساراً للتدوير، وبإصبعين للتكبير";
        }
      });

      // نظام التدوير والتكبير
      let startX = 0;
      let initialRot = 0;
      let initialPinchDist = 0;
      let initialScaleObj = {x:0, y:0, z:0};

      el.addEventListener('touchstart', (e) => {
        if (!activeModel) return;
        if (e.touches.length === 1) {
          startX = e.touches[0].pageX;
          initialRot = activeModel.object3D.rotation.y;
        } else if (e.touches.length === 2) {
          initialPinchDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
          initialScaleObj = activeModel.object3D.scale.clone();
        }
      });

      el.addEventListener('touchmove', (e) => {
        if (!activeModel) return;
        if (e.touches.length === 1) {
          const deltaX = e.touches[0].pageX - startX;
          activeModel.object3D.rotation.y = initialRot + deltaX * 0.01;
        } else if (e.touches.length === 2) {
          const dist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
          const scaleFactor = dist / initialPinchDist;
          activeModel.object3D.scale.set(
            initialScaleObj.x * scaleFactor, initialScaleObj.y * scaleFactor, initialScaleObj.z * scaleFactor
          );
        }
      });
    }
  });

  scene.setAttribute('museum-controller', '');
});