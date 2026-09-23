/*
 * Efectos y detalles: animaciones de aparición al hacer scroll,
 * año actual y reloj con la hora local del autor.
 */
(function () {
  // Zona horaria del autor: cámbiala por la tuya.
  const TIME_ZONE = "America/Guayaquil";

  /* ---------- Aparición al hacer scroll ---------- */
  const revealItems = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    revealItems.forEach((item) => observer.observe(item));
  }

  /* ---------- Año actual ---------- */
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = year; });

  /* ---------- Reloj local ---------- */
  const clocks = document.querySelectorAll("[data-clock]");
  if (clocks.length) {
    const formatter = new Intl.DateTimeFormat("es", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: TIME_ZONE,
      timeZoneName: "short",
    });

    const tick = () => {
      const now = new Date();
      clocks.forEach((clock) => {
        clock.textContent = formatter.format(now);
        clock.dateTime = now.toISOString();
      });
    };

    tick();
    setInterval(tick, 30000);
  }
})();
