//الأحجام الجديدة  :
const ARTIFACTS = [
  { id: "tent", name: "الخيمة", src: "models/arabic_tent.glb", scale: "18 18 18" }, 
  { id: "dallah", name: "الدلة", src: "models/saudi_dallah.glb", scale: "0.5 0.5 0.5" }, 
  { id: "sword", name: "السيف", src: "models/arabic_sword.glb", scale: "0.05 0.05 0.05" },
  { id: "mubkhara", name: "المبخرة", src: "models/mubkhara.glb", scale: "0.05 0.05 0.05" }
];
document.addEventListener("DOMContentLoaded", () => {
  let selectedSrc = ARTIFACTS[0].src;
  let selectedScale = ARTIFACTS[0].scale;
  let activeModel = null; 

  const itemsRow = document.getElementById('museum-items');
  const instructionBadge = document.getElementById('ar-instruction');
  const bottomPanel = document.getElementById('bottom-panel');
  const btnCustomAr = document.getElementById('btn-custom-ar');
  const btnPlaceModel = document.getElementById('btn-place-model');
  const arLoading = document.getElementById('ar-loading');
  const scene = document.querySelector('a-scene');
  const cameraEl = document.querySelector('a-camera');
  
  // توليد الأزرار
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
        instructionBadge.innerText = `تم اختيار ${art.name} - اضغط إسقاط`;
      }
    };
    itemsRow.appendChild(btn);
  });

  scene.addEventListener('enter-vr', () => {
    if (scene.is('ar-mode')) {
      btnCustomAr.style.display = 'none'; 
      bottomPanel.style.display = 'block'; 
      btnPlaceModel.style.display = 'block'; 
      
      instructionBadge.style.display = 'block';
      instructionBadge.innerText = "وجّه الكاميرا للأسفل واضغط زر الإسقاط";
      instructionBadge.style.background = "rgba(0, 0, 0, 0.7)";
      instructionBadge.style.color = "var(--sand)";
    }
  });

  // دالة الإسقاط المباشر (أمام المستخدم فوراً)
  btnPlaceModel.addEventListener('click', (e) => {
    e.stopPropagation();

    arLoading.style.display = 'block';
    btnPlaceModel.style.display = 'none';

    // حساب الإسقاط ليكون أمام الكاميرا بمسافة 1.2 متر
    const camera3D = cameraEl.object3D;
    const direction = new AFRAME.THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(camera3D.quaternion);
    direction.y = 0; 
    direction.normalize();

    const spawnPos = new AFRAME.THREE.Vector3();
    spawnPos.copy(camera3D.position).add(direction.multiplyScalar(1.2)); 
    spawnPos.y = 0; // وضعه على مستوى الأرض

    const targetModel = document.createElement('a-entity');
    targetModel.setAttribute('gltf-model', selectedSrc);
    targetModel.setAttribute('position', `${spawnPos.x} 0 ${spawnPos.z}`);
    targetModel.setAttribute('scale', '0 0 0'); 
    
    targetModel.addEventListener('model-loaded', () => {
      arLoading.style.display = 'none';
      btnPlaceModel.style.display = 'block';
      targetModel.setAttribute('animation', {
        property: 'scale', to: selectedScale, dur: 600, easing: 'easeOutElastic'
      });
      instructionBadge.innerText = "تحريك: إصبع. تدوير وتكبير: إصبعين.";
      instructionBadge.style.background = "rgba(212, 175, 55, 0.9)";
      instructionBadge.style.color = "black";
    });

    scene.appendChild(targetModel);
    activeModel = targetModel; 
  });

  // --- نظام الحركة: تحريك (إصبع)، تدوير وتكبير (إصبعين) ---
  let startX = 0, startY = 0;
  let initialRot = 0;
  let initialPinchDist = 0, initialAngle = 0;
  let initialScaleObj = {x:0, y:0, z:0};
  let initialPosObj = {x:0, y:0, z:0};

  window.addEventListener('touchstart', (e) => {
    if (!activeModel || e.target.closest('button') || e.target.closest('.ar-item-btn') || e.target.closest('a')) return;
    
    if (e.touches.length === 1) {
      startX = e.touches[0].pageX;
      startY = e.touches[0].pageY;
      initialPosObj = activeModel.object3D.position.clone();
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0], t2 = e.touches[1];
      initialPinchDist = Math.hypot(t1.pageX - t2.pageX, t1.pageY - t2.pageY);
      initialAngle = Math.atan2(t2.pageY - t1.pageY, t2.pageX - t1.pageX);
      initialScaleObj = activeModel.object3D.scale.clone();
      initialRot = activeModel.object3D.rotation.y; 
    }
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (!activeModel || e.target.closest('button') || e.target.closest('.ar-item-btn') || e.target.closest('a')) return;
    e.preventDefault(); 

    if (e.touches.length === 1) {
      const deltaX = (e.touches[0].pageX - startX) * 0.004;
      const deltaY = (e.touches[0].pageY - startY) * 0.004;

      const camHeading = cameraEl.object3D.rotation.y;
      const moveX = Math.cos(camHeading) * deltaX + Math.sin(camHeading) * deltaY;
      const moveZ = -Math.sin(camHeading) * deltaX + Math.cos(camHeading) * deltaY;

      activeModel.object3D.position.x = initialPosObj.x + moveX;
      activeModel.object3D.position.z = initialPosObj.z + moveZ;
      
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0], t2 = e.touches[1];
      const dist = Math.hypot(t1.pageX - t2.pageX, t1.pageY - t2.pageY);
      const angle = Math.atan2(t2.pageY - t1.pageY, t2.pageX - t1.pageX);

      const scaleFactor = dist / initialPinchDist;
      activeModel.object3D.scale.set(
        initialScaleObj.x * scaleFactor, initialScaleObj.y * scaleFactor, initialScaleObj.z * scaleFactor
      );

      const angleDiff = angle - initialAngle;
      activeModel.object3D.rotation.y = initialRot - angleDiff;
    }
  }, { passive: false });
});