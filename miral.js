// 年号
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});

// カウンタ
const runCounter = (el) => {
  const end = Number(el.dataset.count || "0");
  const step = Math.max(1, Math.floor(end / 60));
  let cur = 0;
  const tick = () => {
    cur += step;
    if (cur >= end) cur = end;
    el.textContent = String(cur);
    if (cur < end) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const heroStats = document.querySelector(".hero-stats");
if (heroStats) {
  new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll(".count").forEach(runCounter);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 }).observe(heroStats);
}

// モバイルメニュー
const menuBtn = document.querySelector(".menu-toggle");
const nav = document.querySelector("[data-nav]");
const overlay = document.querySelector("[data-overlay]");

const setNav = (open) => {
  if (!nav) return;
  nav.classList.toggle("open", open);
  overlay?.classList.toggle("show", open);
  menuBtn?.setAttribute("aria-expanded", open ? "true" : "false");
  document.body.style.overflow = open ? "hidden" : "";
};

menuBtn?.addEventListener("click", () => setNav(!nav.classList.contains("open")));
overlay?.addEventListener("click", () => setNav(false));

// モバイル時：リンクタップ/ハッシュ変更/スクロール/リサイズで確実に閉じる
const closeOnMobile = () => { if (window.innerWidth <= 900) setNav(false); };
document.querySelectorAll("[data-nav] a").forEach(a => a.addEventListener("click", closeOnMobile, { passive: true }));
window.addEventListener("hashchange", closeOnMobile);
window.addEventListener("scroll", closeOnMobile, { passive: true });
window.addEventListener("resize", () => { if (window.innerWidth > 900) setNav(false); });
