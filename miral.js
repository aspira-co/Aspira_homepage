// 年号
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});

// カウンタ（見えたら起動）
const counters = document.querySelectorAll(".count");
const runCounter = (el) => {
  const end = Number(el.dataset.count || "0");
  const step = Math.max(1, Math.floor(end / 60));
  let cur = 0;
  const tick = () => {
    cur += step;
    if (cur >= end) { cur = end; }
    el.textContent = String(cur);
    if (cur < end) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const onVisible = (entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll(".count").forEach(runCounter);
      obs.unobserve(e.target);
    }
  });
};
const heroStats = document.querySelector(".hero-stats");
if (heroStats) new IntersectionObserver(onVisible, { threshold: 0.4 }).observe(heroStats);

// メールコピー
const copyBtn = document.getElementById("copyEmail");
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("contact@aspira-corporate.jp");
      copyBtn.textContent = "コピーしました";
      setTimeout(()=> copyBtn.textContent = "メールアドレスをコピー", 1500);
    } catch {
      window.location.href = "mailto:contact@aspira-corporate.jp";
    }
  });
}

// モバイルナビ
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
window.addEventListener("resize", () => { if (window.innerWidth > 900) setNav(false); });
