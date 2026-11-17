(()=>{'use strict';
const all=[...document.querySelectorAll('#trackgrid .track')];
const input=document.querySelector('#search');
const year=document.querySelector('#year');
const filters=[...document.querySelectorAll('.filters button')];
const result=document.querySelector('#results');
const more=document.querySelector('#load-more-tracks');
const showing=document.querySelector('#catalog-showing');
const batch=12;
let kind='all',limit=batch,matches=[];
function draw(){
 if(!all.length)return;
 const visible=Math.min(limit,matches.length);
 const allowed=new Set(matches.slice(0,visible));
 for(const el of all)el.hidden=!allowed.has(el);
 result.textContent=matches.length+' TRACKS FOUND';
 showing.textContent=matches.length?'Showing '+visible+' of '+matches.length+' tracks':'No tracks found';
 const left=matches.length-visible;
 more.hidden=left<=0;
 if(left>0)more.innerHTML='SHOW '+Math.min(batch,left)+' MORE <span aria-hidden="true">↓</span>';
 window.GHUKASI_I18N?.updateDynamic?.();
}
function filter(){
 const q=input.value.trim().toLocaleLowerCase(),y=year.value;
 matches=all.filter(el=>(kind==='all'||el.dataset.kind===kind)&&(y==='all'||el.dataset.year===y)&&(!q||el.dataset.title.includes(q)));
 limit=batch;
 draw();
}
if(input&&year&&more&&result&&showing){
 input.addEventListener('input',filter);
 year.addEventListener('change',filter);
 for(const b of filters)b.addEventListener('click',()=>{
  kind=b.dataset.type;
  for(const other of filters){const selected=other===b;other.classList.toggle('active',selected);other.setAttribute('aria-pressed',String(selected));}
  filter();
 });
 more.addEventListener('click',()=>{limit+=batch;draw();});
 filter();
}
const progress=document.querySelector('.progress');
let pending=false;
function trackScroll(){
 if(pending)return;
 pending=true;
 requestAnimationFrame(()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight;
  if(progress)progress.style.width=(max<=0?100:100*Math.max(0,Math.min(1,window.scrollY/max)))+'%';
  pending=false;
 });
}
addEventListener('scroll',trackScroll,{passive:true});
addEventListener('resize',trackScroll,{passive:true});
trackScroll();
const nav=document.querySelector('.mobile-menu');
if(nav){
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.open=false));
 document.addEventListener('click',ev=>{if(nav.open&&!nav.contains(ev.target))nav.open=false;});
}
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(!reduced&&'IntersectionObserver'in window){
 const candidates=[...document.querySelectorAll('.platform-section .section-tag,.platform,.releases-head,.release-lead,.release-tile,.statement h2,.catalog-head,.about-art,.about-copy,.watch-card')];
 const observer=new IntersectionObserver((entries,obs)=>{
  for(const entry of entries){
   if(!entry.isIntersecting)continue;
   entry.target.classList.add('is-visible');
   obs.unobserve(entry.target);
  }
 },{threshold:0.06,rootMargin:'0px 0px -35px 0px'});
 candidates.forEach(el=>{el.classList.add('reveal');observer.observe(el);});
 document.documentElement.classList.add('js-motion');
}
})();