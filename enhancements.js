(function(){
  'use strict';
  var people={bride:{name:'Đàm Thị Mỹ Linh',bank:'BIDV · CN Thanh Xuân',account:'2224188738'},groom:{name:'Trần Văn Tuấn',bank:'Techcombank',account:'19030574192010'}};
  var dialog=document.getElementById('giftQRDialog');
  document.querySelectorAll('.gift-flip').forEach(function(button){button.addEventListener('click',function(){var flipped=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(flipped));button.setAttribute('aria-label',(flipped?'Lật về ảnh ':'Xem QR ')+people[button.dataset.person].name);});});
  document.querySelectorAll('[data-gift-copy]').forEach(function(button){button.addEventListener('click',async function(){var account=people[button.dataset.giftCopy].account;try{await navigator.clipboard.writeText(account);button.textContent='Đã sao chép';}catch(e){var field=document.createElement('textarea');field.value=account;document.body.appendChild(field);field.select();document.execCommand('copy');field.remove();button.textContent='Đã sao chép';}setTimeout(function(){button.textContent='Sao chép STK';},2000);});});
  document.querySelectorAll('[data-gift-view]').forEach(function(button){button.addEventListener('click',function(){var key=button.dataset.giftView,p=people[key];dialog.querySelector('h3').textContent=p.name;dialog.querySelector('.gift-bank').textContent=p.bank;dialog.querySelector('.gift-account').textContent=p.account;dialog.querySelector('.qr-crop').className='qr-crop '+key;dialog.querySelector('img').src='assets/qr/'+key+'.png';dialog.querySelector('img').alt='QR chuyển khoản '+p.name;dialog.querySelector('a').href='assets/qr/'+key+'.png';dialog.showModal();});});
  dialog.querySelector('button').addEventListener('click',function(){dialog.close();});
})();
