// الأحجام الجديدة: الخيمة ضخمة، الدلة متوسطة، السيف صغير ومنطقي
const ARTIFACTS = [
  { id: "tent", name: "الخيمة", src: "models/arabic_tent.glb", scale: "4 4 4" }, 
  { id: "dallah", name: "الدلة", src: "models/saudi_dallah.glb", scale: "0.5 0.5 0.5" }, 
  { id: "sword", name: "السيف", src: "models/arabic_sword.glb", scale: "0.06 0.06 0.06" } 
];

document.addEventListener("DOMContentLoaded", () => {
  let selectedSrc = ARTIFACTS[0].src;
  let selectedScale = ARTIFACTS[0].scale;
  let activeModel = null; 

  const itemsRow = document.getElementById('museum-items');
  const instructionBadge = document.getElementById('ar-instruction');
  const bottomPanel = document.getElementById('bottom-panel');
  const btnCustomAr = document.getElementById('btn-custom-ar');
  
  const actionButtons = document.getElementById('action-buttons');
  const btnPlaceModel = document.getElementById('btn-place-model');
  const btnMoveModel = document.getElementById('btn-move-model');
  const arLoading = document.getElementById('ar-loading');
  
  const scene = document.querySelector('a-scene');
  const reticle = document.getElementById('reticle');
  
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
        instructionBadge.innerText = `تم اختيار ${art.name}`;
      }
    };
    itemsRow.appendChild(btn);
  });

  scene.addEventListener('enter-vr', () => {
    if (scene.is('ar-mode')) {
      btnCustomAr.style.display = 'none'; 
      bottomPanel.style.display = 'block'; 
      actionButtons.style.display = 'flex'; 
      instructionBadge.style.display = 'block';
    }
  });

  // تحديث الإرشادات ومراقبة الأسطح
  setInterval(() => {
    if (scene.is('ar-mode')) {
      if (reticle.getAttribute('visible')) {
        instructionBadge.style.background = "rgba(212, 175, 55, 0.9)";
        instructionBadge.style.color = "black";
        if (!activeModel) {
           instructionBadge.innerText = "السطح جاهز! اضغط إسقاط جديد";
        } else {
           instructionBadge.innerText = "بإصبع للتدوير، وبإصبعين للتكبير";
        }
      } else {
        instructionBadge.innerText = "امسح الأرض أو الجدار ببطء لتظهر الدائرة...";
        instructionBadge.style.background = "rgba(0, 0, 0, 0.6)";
        instructionBadge.style.color = "var(--sand)";
      }
    }
  }, 500);

  // دالة الإسقاط وإلصاق المجسم بالسطح (طاولة، جدار، أرض)
  function placeModelAtReticle(isMove = false) {
    if (!reticle.getAttribute('visible')) return;

    const pos = reticle.getAttribute('position');
    const rot = reticle.getAttribute('rotation'); // يأخذ زاوية الجدار أو الطاولة

    let targetModel;
    
    if (isMove && activeModel) {
      // إذا كان نقل: نستخدم المجسم النشط
      targetModel = activeModel;
      targetModel.setAttribute('position', pos);
      targetModel.setAttribute('rotation', rot);
    } else {
      // إذا كان جديد: ننشئ مجسم جديد
      arLoading.style.display = 'block';
      targetModel = document.createElement('a-entity');
      targetModel.setAttribute('gltf-model', selectedSrc);
      targetModel.setAttribute('position', pos);
      targetModel.setAttribute('rotation', rot);
      targetModel.setAttribute('scale', '0 0 0'); 
      
      targetModel.addEventListener('model-loaded', () => {
        arLoading.style.display = 'none';
        targetModel.setAttribute('animation', {
          property: 'scale', to: selectedScale, dur: 600, easing: 'easeOutElastic'
        });
        btnMoveModel.style.display = 'inline-block'; // إظهار زر النقل
      });

      scene.appendChild(targetModel);
      activeModel = targetModel; 
    }
  }

  // ربط الأزرار بالدوال
  btnPlaceModel.addEventListener('click', (e) => { e.stopPropagation(); placeModelAtReticle(false); });
  btnMoveModel.addEventListener('click', (e) => { e.stopPropagation(); placeModelAtReticle(true); });

  // --- نظام الحركة: تدوير وتكبير ---
  let startX = 0;
  let initialRot = 0;
  let initialPinchDist = 0, initialAngle = 0;
  let initialScaleObj = {x:0, y:0, z:0};

  window.addEventListener('touchstart', (e) => {
    if (!activeModel || e.target.closest('button') || e.target.closest('.ar-item-btn') || e.target.closest('a')) return;
    
    if (e.touches.length === 1) {
      startX = e.touches[0].pageX;
      initialRot = activeModel.object3D.rotation.y;
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0], t2 = e.touches[1];
      initialPinchDist = Math.hypot(t1.pageX - t2.pageX, t1.pageY - t2.pageY);
      initialAngle = Math.atan2(t2.pageY - t1.pageY, t2.pageX - t1.pageX);
      initialScaleObj = activeModel.object3D.scale.clone();
      initialRot = activeModel.object3D.rotation.y; // إذا أراد المستخدم التدوير بإصبعين
    }
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (!activeModel || e.target.closest('button') || e.target.closest('.ar-item-btn') || e.target.closest('a')) return;
    e.preventDefault();

    if (e.touches.length === 1) {
      // تمرير بإصبع واحد للتدوير السلس (بدلاً من التحريك العشوائي)
      const deltaX = e.touches[0].pageX - startX;
      activeModel.object3D.rotation.y = initialRot + (deltaX * 0.01);
      
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0], t2 = e.touches[1];
      const dist = Math.hypot(t1.pageX - t2.pageX, t1.pageY - t2.pageY);
      const angle = Math.atan2(t2.pageY - t1.pageY, t2.pageX - t1.pageX);

      // التكبير
      const scaleFactor = dist / initialPinchDist;
      activeModel.object3D.scale.set(
        initialScaleObj.x * scaleFactor, initialScaleObj.y * scaleFactor, initialScaleObj.z * scaleFactor
      );

      // التدوير بإصبعين
      const angleDiff = angle - initialAngle;
      activeModel.object3D.rotation.y = initialRot - angleDiff;
    }
  }, { passive: false });
});