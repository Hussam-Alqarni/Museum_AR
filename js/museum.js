const ARTIFACTS = [
  { id: "tent", name: "الخيمة", src: "models/arabic_tent.glb", scale: "0.2 0.2 0.2" },
  { id: "dallah", name: "الدلة", src: "models/saudi_dallah.glb", scale: "0.1 0.1 0.1" },
  { id: "sword", name: "السيف", src: "models/arabic_sword.glb", scale: "0.2 0.2 0.2" }
];

document.addEventListener("DOMContentLoaded", () => {
  let selectedSrc = ARTIFACTS[0].src;
  let selectedScale = ARTIFACTS[0].scale;
  let activeModel = null; // المجسم القابل للتحريك والتدوير حالياً

  const itemsRow = document.getElementById('museum-items');
  const instructionBadge = document.getElementById('ar-instruction');
  const bottomPanel = document.getElementById('bottom-panel');
  const btnCustomAr = document.getElementById('btn-custom-ar');
  const btnPlaceModel = document.getElementById('btn-place-model');
  const scene = document.querySelector('a-scene');
  const cameraEl = document.querySelector('a-camera');
  
  // 1. توليد أزرار المجسمات في الشريط السفلي
  ARTIFACTS.forEach((art, index) => {
    const btn = document.createElement('div');
    btn.className = 'ar-item-btn' + (index === 0 ? ' active' : '');
    btn.innerHTML = `<span>${art.name}</span>`;
    
    btn.onclick = (e) => {
      e.stopPropagation();
      document.querySelectorAll('.ar-item-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      selectedSrc = art.src;
      selectedScale = art.scale;
      
      if(scene.is('ar-mode')) {
        instructionBadge.innerText = `تم اختيار ${art.name} - اضغط "إسقاط المجسم"`;
      }
    };
    itemsRow.appendChild(btn);
  });

  // 2. تحديث الواجهة عند فتح الكاميرا بنجاح
  scene.addEventListener('enter-vr', () => {
    if (scene.is('ar-mode')) {
      btnCustomAr.style.display = 'none'; // إخفاء زر التشغيل
      bottomPanel.style.display = 'block'; // إظهار قائمة المجسمات
      btnPlaceModel.style.display = 'block'; // إظهار زر الإسقاط
      
      instructionBadge.style.display = 'block';
      instructionBadge.innerText = "وجّه الكاميرا أمامك واضغط على زر الإسقاط";
      instructionBadge.style.background = "rgba(0, 0, 0, 0.7)";
      instructionBadge.style.color = "var(--sand)";
    }
  });

  // 3. دالة الإسقاط الفوري (عند الضغط على زر ➕ الإسقاط)
  btnPlaceModel.addEventListener('click', (e) => {
    e.stopPropagation();

    // حساب النقطة على بعد 1.5 متر أمام المستخدم
    const camera3D = cameraEl.object3D;
    const direction = new AFRAME.THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(camera3D.quaternion);
    direction.y = 0; // إبقاء الاتجاه أفقياً
    direction.normalize();

    const distance = 1.5; // المسافة بالأمتار
    const spawnPos = new AFRAME.THREE.Vector3();
    spawnPos.copy(camera3D.position).add(direction.multiplyScalar(distance));
    spawnPos.y = 0; // تثبيت المجسم على الأرض

    // إنشاء المجسم وإضافته للمشهد
    const model = document.createElement('a-entity');
    model.setAttribute('gltf-model', selectedSrc);
    model.setAttribute('position', `${spawnPos.x} 0 ${spawnPos.z}`);
    
    // تأثير حركي لظهور المجسم بشكل جميل
    model.setAttribute('scale', '0 0 0');
    model.setAttribute('animation', {
      property: 'scale', to: selectedScale, dur: 800, easing: 'easeOutElastic'
    });

    scene.appendChild(model);
    
    // جعل هذا المجسم هو "النشط" للتدوير والتكبير
    activeModel = model; 
    
    instructionBadge.innerText = "تمت الإضافة! اسحب الشاشة للتدوير أو أضف مجسماً آخر";
  });

  // 4. نظام التدوير والتكبير للمجسم النشط
  let startX = 0;
  let initialRot = 0;
  let initialPinchDist = 0;
  let initialScaleObj = {x:0, y:0, z:0};

  scene.addEventListener('touchstart', (e) => {
    if (!activeModel || e.target.closest('button') || e.target.closest('.ar-item-btn')) return;
    
    if (e.touches.length === 1) {
      startX = e.touches[0].pageX;
      initialRot = activeModel.object3D.rotation.y;
    } else if (e.touches.length === 2) {
      initialPinchDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
      initialScaleObj = activeModel.object3D.scale.clone();
    }
  });

  scene.addEventListener('touchmove', (e) => {
    if (!activeModel || e.target.closest('button') || e.target.closest('.ar-item-btn')) return;
    
    if (e.touches.length === 1) {
      // تدوير
      const deltaX = e.touches[0].pageX - startX;
      activeModel.object3D.rotation.y = initialRot + deltaX * 0.01;
    } else if (e.touches.length === 2) {
      // تكبير / تصغير
      const dist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
      const scaleFactor = dist / initialPinchDist;
      activeModel.object3D.scale.set(
        initialScaleObj.x * scaleFactor, initialScaleObj.y * scaleFactor, initialScaleObj.z * scaleFactor
      );
    }
  });
});