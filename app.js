'use strict';
const menu = document.querySelector('#mobile-menu');
const toggle = document.querySelector('.menu-toggle');
if (menu && toggle) {
  toggle.addEventListener('click', () => { menu.showModal(); toggle.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; });
  const closeMenu = () => { menu.close(); };
  menu.querySelector('.menu-close').addEventListener('click', closeMenu);
  menu.addEventListener('close', () => { toggle.setAttribute('aria-expanded','false'); document.body.style.overflow = ''; toggle.focus(); });
  window.matchMedia('(min-width: 701px)').addEventListener('change', event => { if(event.matches && menu.open) closeMenu(); });
}
const filters = document.querySelectorAll('[data-filter]');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  let count = 0;
  document.querySelectorAll('[data-category]').forEach(card => { card.hidden = button.dataset.filter !== 'alla' && card.dataset.category !== button.dataset.filter; if (!card.hidden) count++; });
  document.querySelector('#filter-count').textContent = count + ' projekt';
}));
const thoughts = {
  farg: ['En ton att bygga vidare på.','Färgsättningen binder ihop rummets delar. Jag hjälper dig hitta toner som samspelar med ljuset, möblerna och känslan du vill åt.',['#293e33','#8b9b81','#c0b8a4','#eee9df']],
  form: ['När delarna hittar varandra.','Mjuka textilier, tydliga former och träets struktur. Genom moodboards och möbleringsförslag blir det lättare att se hur delarna kan bilda en helhet.',['#af775b','#bc997b','#d5cbbf','#414c42']],
  funktion: ['Ett vackert rum ska också fungera.','Hur rör du dig i rummet? Var vill du arbeta, mötas eller vila? Dina behov och rummets förutsättningar hjälper oss att hitta rätt möblering och ljus.',['#334b55','#7c9797','#b3c0bb','#ddd9cf']]
};
const tabs = [...document.querySelectorAll('[data-material]')];
function setMaterial(button) {
  const data = thoughts[button.dataset.material];
  tabs.forEach(b => { b.setAttribute('aria-selected', String(b===button)); b.tabIndex = b===button ? 0 : -1; });
  const panel = document.querySelector('#material-panel'); panel.setAttribute('aria-labelledby',button.id);
  panel.querySelector('h3').textContent=data[0]; panel.querySelector('p').textContent=data[1];
  document.querySelectorAll('.material-swatches span').forEach((s,i)=>s.style.backgroundColor=data[2][i]);
}
tabs.forEach((button,index) => {
 button.addEventListener('click',()=>setMaterial(button));
 button.addEventListener('keydown', event=> {
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
  event.preventDefault(); let next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
  tabs[next].focus(); setMaterial(tabs[next]);
 });
});
const form = document.querySelector('#enquiry');
if(form) {
 const query=new URLSearchParams(location.search); const interest=document.querySelector('#interest');
 if([...interest.options].some(o=>o.value===query.get('intresse'))) interest.value=query.get('intresse');
 if(query.has('projekt')) document.querySelector('#message').value='Jag blev inspirerad av projektet '+query.get('projekt').replaceAll('-',' ')+'. Jag skulle vilja ha hjälp med ';
 let draft='';
 form.addEventListener('submit',event=> {
  event.preventDefault(); if(!form.reportValidity()) return;
  const data=new FormData(form);draft=`Hej Kajsa!\n\nJag vill ha hjälp med: ${data.get('interest')}\n\n${String(data.get('message')).trim()}\n\nVänliga hälsningar,\n${String(data.get('name')).trim()}\n${data.get('email')}`;
  document.querySelector('#draft-text').value=draft;document.querySelector('#form-result').hidden=false;
  const a=document.createElement('a'); a.href='mailto:info@kajsainreder.se?subject='+encodeURIComponent('Förfrågan om inredning – '+data.get('interest'))+'&body='+encodeURIComponent(draft);a.click();
 });
 document.querySelector('#copy-enquiry').addEventListener('click',async(event)=> {
  const button=event.currentTarget;
  try { await navigator.clipboard.writeText(draft);button.textContent='Meddelandet är kopierat'; }
  catch { const area=document.querySelector('#draft-text');area.focus();area.select();document.querySelector('#copy-enquiry').textContent='Texten är markerad – kopiera den manuellt'; }
 });
}
