(function(){
  'use strict';
  var people={bride:{name:'Đàm Thị Mỹ Linh',bank:'BIDV · CN Thanh Xuân',account:'2224188738'},groom:{name:'Trần Văn Tuấn',bank:'Techcombank',account:'19030574192010'}};
  var dialog=document.getElementById('giftQRDialog');
  document.querySelectorAll('.gift-flip').forEach(function(button){button.addEventListener('click',function(){var flipped=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(flipped));button.setAttribute('aria-label',(flipped?'Lật về ảnh ':'Xem QR ')+people[button.dataset.person].name);});});
  document.querySelectorAll('[data-gift-copy]').forEach(function(button){button.addEventListener('click',async function(){var account=people[button.dataset.giftCopy].account;try{await navigator.clipboard.writeText(account);button.textContent='Đã sao chép';}catch(e){var field=document.createElement('textarea');field.value=account;document.body.appendChild(field);field.select();document.execCommand('copy');field.remove();button.textContent='Đã sao chép';}setTimeout(function(){button.textContent='Sao chép STK';},2000);});});
  document.querySelectorAll('[data-gift-view]').forEach(function(button){button.addEventListener('click',function(){var key=button.dataset.giftView,p=people[key];dialog.querySelector('h3').textContent=p.name;dialog.querySelector('.gift-bank').textContent=p.bank;dialog.querySelector('.gift-account').textContent=p.account;dialog.querySelector('.qr-crop').className='qr-crop '+key;dialog.querySelector('img').src='/assets/qr/'+key+'-qr.png';dialog.querySelector('img').alt='QR chuyển khoản '+p.name;dialog.querySelector('a').href='/assets/qr/'+key+'.png';dialog.showModal();});});
  dialog.querySelector('button').addEventListener('click',function(){dialog.close();});
})();

/* Slow slideshow that pauses for touch, scrolling, and the full-screen viewer. */
(function(){
  'use strict';
  var track=document.getElementById('albumTrack');
  if(!track)return;
  var slides=Array.from(track.querySelectorAll('.album-slide'));
  var counter=document.getElementById('albumCount');
  var progress=document.getElementById('albumProgress');
  var toggle=document.getElementById('albumAuto');
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var current=0,automatic=!reduced,visible=false,touching=false,pausedUntil=0,frame=0;
  var viewer=document.getElementById('photoViewer');
  function fit(){
    var s=slides[current];
    if(s&&s.offsetHeight)track.style.height=s.offsetHeight+'px';
  }
  slides.forEach(function(sl){
    var im=sl.querySelector('img');
    if(!im)return;
    function ratio(){
      if(im.naturalWidth&&im.naturalHeight){sl.style.aspectRatio=im.naturalWidth+'/'+im.naturalHeight;fit();}
    }
    if(im.complete)ratio();else im.addEventListener('load',ratio);
  });
  window.addEventListener('resize',fit);
  function update(){
    var width=track.clientWidth;
    if(!width)return;
    current=Math.max(0,Math.min(slides.length-1,Math.round(track.scrollLeft/width)));
    fit();
    counter.textContent=String(current+1).padStart(2,'0')+' / '+slides.length;
    progress.style.width=((current+1)/slides.length*100)+'%';
  }
  function manualPause(){pausedUntil=Date.now()+12000;}
  function move(index,manual){
    if(manual)manualPause();
    var next=(index+slides.length)%slides.length;
    track.scrollTo({left:next*track.clientWidth,behavior:reduced?'auto':'smooth'});
  }
  function syncToggle(){
    toggle.setAttribute('aria-pressed',String(automatic));
    toggle.textContent=automatic?'Tạm dừng':'Tự động chuyển ảnh';
    toggle.setAttribute('aria-label',automatic?'Tạm dừng chuyển ảnh tự động':'Bật chuyển ảnh tự động');
  }
  document.getElementById('albumPrev').addEventListener('click',function(){move(current-1,true);});
  document.getElementById('albumNext').addEventListener('click',function(){move(current+1,true);});
  toggle.addEventListener('click',function(){automatic=!automatic;manualPause();syncToggle();});
  track.addEventListener('scroll',function(){if(!frame)frame=requestAnimationFrame(function(){frame=0;update();});},{passive:true});
  track.addEventListener('pointerdown',function(){touching=true;manualPause();},{passive:true});
  window.addEventListener('pointerup',function(){if(touching){touching=false;manualPause();}},{passive:true});
  window.addEventListener('pointercancel',function(){touching=false;manualPause();},{passive:true});
  track.addEventListener('wheel',manualPause,{passive:true});
  track.addEventListener('focusin',manualPause);
  track.addEventListener('click',manualPause);
  track.addEventListener('keydown',function(event){
    if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
      event.preventDefault();move(current+(event.key==='ArrowRight'?1:-1),true);
    }
  });
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(entries){visible=entries[0].intersectionRatio>=.5;},{threshold:[0,.5,1]}).observe(track);
  }
  var resize=window.ResizeObserver?new ResizeObserver(function(){track.scrollTo({left:current*track.clientWidth,behavior:'auto'});}):null;
  if(resize)resize.observe(track);
  setInterval(function(){
    if(automatic&&visible&&!touching&&!document.hidden&&Date.now()>pausedUntil&&(!viewer||!viewer.open)&&!track.matches(':hover')){
      move(current+1,false);
    }
  },6000);
  // Touch paging also works while viewing an enlarged original.
  if(viewer){
    var startX=0,startY=0;
    viewer.addEventListener('touchstart',function(event){if(event.touches.length===1){startX=event.touches[0].clientX;startY=event.touches[0].clientY;}else{startX=null;}},{passive:true});
    viewer.addEventListener('touchend',function(event){
      if(startX===null||!event.changedTouches.length)return;
      var dx=event.changedTouches[0].clientX-startX,dy=event.changedTouches[0].clientY-startY;
      if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)document.getElementById(dx<0?'viewerNext':'viewerPrev').click();
      startX=null;
    },{passive:true});
  }
  syncToggle();update();
})();

/* Background music: starts when the guest opens the card, toggle button afterwards. */
(function(){
  'use strict';
  var go=document.getElementById('goBtn');
  if(!go)return;
  var bgm=document.createElement('audio');
  bgm.src='/music.mp3?v=20261119';bgm.loop=true;bgm.preload='auto';
  var btn=document.createElement('button');
  btn.type='button';btn.className='mus';btn.setAttribute('aria-label','Bật/tắt nhạc');
  btn.innerHTML='<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9 18.2V5.6l11-2.4v12.6a3.2 3.2 0 1 1-1.8-2.9V7.1L10.8 8.7v9.5A3.2 3.2 0 1 1 9 15.3Z"/></svg>';
  document.body.appendChild(bgm);document.body.appendChild(btn);
  function sync(){btn.classList.toggle('on',!bgm.paused);}
  function play(){bgm.volume=.7;var p=bgm.play();if(p&&p.then)p.then(sync,sync);else sync();}
  btn.addEventListener('click',function(){if(bgm.paused)play();else{bgm.pause();sync();}});
  bgm.addEventListener('play',sync);bgm.addEventListener('pause',sync);
  document.addEventListener('visibilitychange',function(){
    if(document.hidden&&!bgm.paused){bgm.pause();bgm.dataset.resume='1';}
    else if(!document.hidden&&bgm.dataset.resume){delete bgm.dataset.resume;play();}
  });
  go.addEventListener('click',function(){play();btn.classList.add('show');});
})();
