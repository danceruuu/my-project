/* GHUKASI STUDIO EDITION: subtle progressive enhancement. All site content stays readable with JS disabled. */
(() => {
  "use strict";
  const progress = document.querySelector(".page-progress");
  const updateProgress = () => {
    if (!progress) return;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (height <= 0 ? 100 : Math.min(100, Math.max(0, window.scrollY * 100 / height))) + "%";
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  updateProgress();

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced && "IntersectionObserver" in window) {
    const targets = [
      ...document.querySelectorAll(".social-hub .platform"),
      ...document.querySelectorAll("#featured .featured"),
      ...document.querySelectorAll(".sams-story-panel"),
      ...document.querySelectorAll("#catalog .section-head"),
      ...document.querySelectorAll("#bio .artist-art"),
      ...document.querySelectorAll("#bio .bio-cols h2"),
      ...document.querySelectorAll("#video .video-card"),
    ];
    const observer = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -45px 0px", threshold: 0.05 });
    for (const target of targets) {
      target.classList.add("reveal");
      observer.observe(target);
    }
    document.documentElement.classList.add("js-motion");
  }

  if (!reduced && window.matchMedia("(pointer:fine) and (min-width:901px)").matches) {
    const hero = document.querySelector(".hero-visual");
    if (hero) {
      let frame = 0;
      let x = 0, y = 0;
      hero.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();
        x = (event.clientX - rect.left - rect.width / 2) / rect.width * 16;
        y = (event.clientY - rect.top - rect.height / 2) / rect.height * 13;
        if (frame) return;
        frame = requestAnimationFrame(() => {
          hero.style.setProperty("--px", x.toFixed(1) + "px");
          hero.style.setProperty("--py", y.toFixed(1) + "px");
          frame = 0;
        });
      }, { passive: true });
      hero.addEventListener("pointerleave", () => {
        hero.style.setProperty("--px", "0px");
        hero.style.setProperty("--py", "0px");
      });
    }
  }
})();