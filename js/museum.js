const ARTIFACTS = [
  { id: "tent", name: "الخيمة", src: "models/arabic_tent.glb", scale: "0.2 0.2 0.2" },
  { id: "dallah", name: "الدلة", src: "models/saudi_dallah.glb", scale: "0.1 0.1 0.1" },
  { id: "sword", name: "السيف", src: "models/arabic_sword.glb", scale: "0.2 0.2 0.2" }
];

document.addEventListener("DOMContentLoaded", () => {
  let selectedSrc = ARTIFACTS[0].src;
  let selectedScale = ARTIFACTS[0].scale;
  let activeModel = null; // تتبع المجسم الحالي للتحكم به

  const itemsRow = document.getElementById('museum-items');
  const instructionBadge = document.getElementById('ar-instruction');
  const scene = document.querySelector('a-scene');
  const reticle = document.getElementById('reticle');
  
  // 1. توليد قائمة المجسمات (Carousel)
  ARTIFACTS.forEach((art, index) => {
    const btn = document.createElement('div');
    btn.className = 'ar-item-btn' + (index === 0 ? ' active' : '');
    btn.innerHTML = `<span>${art.name}</span>`;
    
    btn.onclick = () => {
      // إزالة التفعيل من الكل وتفعيل الزر المضغوط
      document.querySelectorAll('.ar-item-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSrc = art.src;
      selectedScale = art.scale;
    };
    itemsRow.appendChild(btn);
  });

  // 2. تحديث التوجيهات الذكية بناءً على حالة الكاميرا
  scene.addEventListener('enter-vr', () => {
    instructionBadge.innerText = "امسح الأرضية ببطء حتى تظهر الدائرة...";
  });

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

  // 3. مكون الإسقاط والتحكم (IKEA Style)
  AFRAME.registerComponent('museum-controller', {
    init: function () {
      const el = this.el;

      // عند النقر على الشاشة لإسقاط المجسم
      el.addEventListener('click', (e) => {
        if (!el.is('ar-mode')) return;

        if (reticle.getAttribute('visible')) {
          const position = reticle.getAttribute('position');
          
          const model = document.createElement('a-entity');
          model.setAttribute('gltf-model', selectedSrc);
          model.setAttribute('position', position);
          model.setAttribute('scale', selectedScale);
          
          // إضافة تأثير ظهور جمالي (Pop up)
          model.setAttribute('animation', {
            property: 'scale',
            from: '0 0 0',
            to: selectedScale,
            dur: 600,
            easing: 'easeOutElastic'
          });

          el.appendChild(model);
          activeModel = model; // جعل هذا المجسم هو النشط للتدوير والتكبير
          
          instructionBadge.innerText = "اسحب يميناً/يساراً للتدوير، وبإصبعين للتكبير";
        }
      });

      // --- نظام التدوير والتكبير للمجسم النشط ---
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
          // تدوير المجسم (إصبع واحد)
          const deltaX = e.touches[0].pageX - startX;
          activeModel.object3D.rotation.y = initialRot + deltaX * 0.01;
        } else if (e.touches.length === 2) {
          // تكبير المجسم (إصبعين)
          const dist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
          const scaleFactor = dist / initialPinchDist;
          activeModel.object3D.scale.set(
            initialScaleObj.x * scaleFactor,
            initialScaleObj.y * scaleFactor,
            initialScaleObj.z * scaleFactor
          );
        }
      });
    }
  });

  scene.setAttribute('museum-controller', '');
});