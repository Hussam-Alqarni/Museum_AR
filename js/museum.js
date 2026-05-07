const ARTIFACTS = [
  { id: "tent", name: "الخيمة", src: "models/arabic_tent.glb", scale: "0.2 0.2 0.2" },
  { id: "dallah", name: "الدلة", src: "models/saudi_dallah.glb", scale: "0.1 0.1 0.1" },
  { id: "sword", name: "السيف", src: "models/arabic_sword.glb", scale: "0.2 0.2 0.2" }
];

document.addEventListener("DOMContentLoaded", () => {
  let selectedSrc = ARTIFACTS[0].src;
  let selectedScale = ARTIFACTS[0].scale;
  let activeModel = null; // يمثل آخر مجسم تم وضعه للتحكم به

  const itemsRow = document.getElementById('museum-items');
  const instructionBadge = document.getElementById('ar-instruction');
  const bottomPanel = document.getElementById('bottom-panel');
  const btnCustomAr = document.getElementById('btn-custom-ar');
  const scene = document.querySelector('a-scene');
  
  // توليد أزرار المجسمات
  ARTIFACTS.forEach((art, index) => {
    const btn = document.createElement('div');
    btn.className = 'ar-item-btn' + (index === 0 ? ' active' : '');
    btn.innerHTML = `<span>${art.name}</span>`;
    
    btn.onclick = (e) => {
      e.stopPropagation(); // يمنع وضع مجسم عند الضغط على الزر
      document.querySelectorAll('.ar-item-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      selectedSrc = art.src;
      selectedScale = art.scale;
      
      instructionBadge.innerText = `تم اختيار ${art.name} - اضغط الشاشة للإضافة`;
    };
    itemsRow.appendChild(btn);
  });

  // إظهار الأدوات عند تشغيل الكاميرا
  scene.addEventListener('enter-vr', () => {
    if (scene.is('ar-mode')) {
      btnCustomAr.style.display = 'none';
      bottomPanel.style.display = 'block';
      instructionBadge.style.display = 'block';
      instructionBadge.innerText = "اضغط على أي مكان في الشاشة للإسقاط فوراً";
      instructionBadge.style.background = "rgba(212, 175, 55, 0.9)";
      instructionBadge.style.color = "black";
    }
  });

  // مكون الإسقاط الفوري المتعدد
  AFRAME.registerComponent('museum-controller', {
    init: function () {
      const el = this.el;
      const cameraEl = document.querySelector('a-camera');

      // عند لمس الشاشة، نسقط مجسماً جديداً أمام الكاميرا فوراً
      el.addEventListener('click', (e) => {
        if (!el.is('ar-mode')) return;

        // حساب النقطة التي تقع على بعد 1.5 متر أمام المستخدم
        const camera3D = cameraEl.object3D;
        const direction = new AFRAME.THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(camera3D.quaternion);
        direction.y = 0; // إبقاء الاتجاه أفقياً
        direction.normalize();

        const distance = 1.5;
        const spawnPos = new AFRAME.THREE.Vector3();
        spawnPos.copy(camera3D.position).add(direction.multiplyScalar(distance));
        spawnPos.y = 0; // تثبيت المجسم على الأرض دائماً (Y=0)

        // إنشاء المجسم الجديد (بدون حذف القديم)
        const model = document.createElement('a-entity');
        model.setAttribute('gltf-model', selectedSrc);
        model.setAttribute('position', `${spawnPos.x} 0 ${spawnPos.z}`);
        
        // تأثير ظهور جمالي
        model.setAttribute('scale', '0 0 0');
        model.setAttribute('animation', {
          property: 'scale', to: selectedScale, dur: 800, easing: 'easeOutElastic'
        });

        el.appendChild(model);
        
        // جعل المجسم الجديد هو "النشط" للتدوير والتكبير
        activeModel = model; 
        
        instructionBadge.innerText = "تمت الإضافة! اسحب للتدوير، أو اختر قطعة أخرى";
        instructionBadge.style.background = "rgba(0, 0, 0, 0.7)";
        instructionBadge.style.color = "var(--sand)";
      });

      // نظام التدوير والتكبير لآخر مجسم تم إضافته
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