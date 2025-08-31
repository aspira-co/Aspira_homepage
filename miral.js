// year
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});

// IntersectionObserver for reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Count-up numbers (once when hero is visible)
let counted = false;
function countUp() {
  if (counted) return;
  counted = true;
  const nums = document.querySelectorAll(".count");
  nums.forEach(n => {
    const to = parseFloat(n.dataset.count || "0");
    const dur = 1100 + Math.random()*500;
    const start = performance.now();
    function tick(t0){
      const p = Math.min(1, (t0 - start) / dur);
      const val = Math.floor(to * (0.2 + 0.8 * p*p));
      n.textContent = val.toString();
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
const hero = document.querySelector(".hero");
if (hero) {
  const io2 = new IntersectionObserver((entries)=>{
    entries.forEach(e => { if (e.isIntersecting) { countUp(); io2.disconnect(); }});
  }, {threshold: 0.3});
  io2.observe(hero);
}

// Tilt + glow for cards
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
if (!reduceMotion && !isTouch) {
  document.querySelectorAll(".card.tilt").forEach(card => {
    let rx = 0, ry = 0, rafId = 0;
    const max = 7; // deg
    function onMove(e){
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const nx = (x - 0.5) * 2;
      const ny = (y - 0.5) * 2;
      rx = (-ny) * max;
      ry = (nx) * max;
      card.style.setProperty("--mx", `${x*100}%`);
      card.style.setProperty("--my", `${y*100}%`);
      if (!rafId) rafId = requestAnimationFrame(apply);
    }
    function apply(){
      rafId = 0;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
    function onLeave(){
      card.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
      card.style.removeProperty("--mx");
      card.style.removeProperty("--my");
    }
    card.addEventListener("mousemove", onMove, {passive:true});
    card.addEventListener("mouseleave", onLeave);
  });
}

// Button ripple + magnet
function addRipple(btn){
  btn.addEventListener("click", (e)=>{
    const s = document.createElement("span");
    s.className = "ripple";
    s.style.left = `${e.offsetX}px`;
    s.style.top = `${e.offsetY}px`;
    btn.appendChild(s);
    setTimeout(()=>s.remove(), 600);
  });
}
document.querySelectorAll(".btn").forEach(addRipple);

function addMagnet(btn){
  let rId = 0, tx=0, ty=0;
  const strength = 14;
  function onMove(e){
    const b = btn.getBoundingClientRect();
    const x = (e.clientX - b.left - b.width/2);
    const y = (e.clientY - b.top - b.height/2);
    tx = Math.max(-strength, Math.min(strength, x*0.12));
    ty = Math.max(-strength, Math.min(strength, y*0.12));
    if (!rId) rId = requestAnimationFrame(apply);
  }
  function apply(){
    rId = 0;
    btn.style.transform = `translate(${tx}px, ${ty}px)`;
  }
  function reset(){ btn.style.transform = ""; }
  btn.addEventListener("mousemove", onMove, {passive:true});
  btn.addEventListener("mouseleave", reset);
}
document.querySelectorAll(".magnet").forEach(addMagnet);

// Scroll progress + parallax orbs
const progress = document.querySelector(".scroll-progress span");
const orbs = document.querySelectorAll(".orb");
let ticking = false;
function onScroll(){
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(()=>{
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
    if (progress) progress.style.width = `${scrolled*100}%`;
    // parallax
    const y = h.scrollTop;
    orbs.forEach((o, i)=>{
      const k = (i+1) * 0.05;
      o.style.transform = `translate3d(0, ${y*k}px, 0)`;
    });
    ticking = false;
  });
}
document.addEventListener("scroll", onScroll, {passive:true});
onScroll();

// Copy email
const copyBtn = document.getElementById("copyEmail");
if (copyBtn){
  copyBtn.addEventListener("click", async ()=>{
    const addr = "contact@aspira-co.jp";
    try{
      await navigator.clipboard.writeText(addr);
      const txt = copyBtn.textContent;
      copyBtn.textContent = "コピーしました";
      setTimeout(()=> copyBtn.textContent = txt, 1500);
    }catch(e){
      window.prompt("以下をコピーしてください:", addr);
    }
  });
}


// Mobile drawer menu
(function(){
  const btn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('[data-nav]');
  const overlay = document.querySelector('[data-overlay]');
  if (!btn || !nav || !overlay) return;
  function open(){
    btn.classList.add('active');
    btn.setAttribute('aria-expanded','true');
    nav.classList.add('open');
    overlay.classList.add('show');
    document.documentElement.style.overflow='hidden';
  }
  function close(){
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded','false');
    nav.classList.remove('open');
    overlay.classList.remove('show');
    document.documentElement.style.overflow='';
  }
  btn.addEventListener('click', ()=>{
    if (nav.classList.contains('open')) close(); else open();
  });
  overlay.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a=> a.addEventListener('click', close));
})();
