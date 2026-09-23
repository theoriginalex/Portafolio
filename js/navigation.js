/*
 * Navegación: menú responsive, enlace activo según la sección
 * visible (scrollspy), sombra del header y botón "volver arriba".
 */
(function () {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const list = document.querySelector("[data-nav-list]");
  const backToTop = document.querySelector("[data-back-to-top]");
  const desktopQuery = window.matchMedia("(min-width: 56rem)");

  /* ---------- Menú responsive ---------- */
  function setMenu(open) {
    if (!toggle || !list) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    list.classList.toggle("is-open", open);
  }

  if (toggle && list) {
    toggle.addEventListener("click", () => {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    list.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && list.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (list.classList.contains("is-open") && !header.contains(event.target)) {
        setMenu(false);
      }
    });

    desktopQuery.addEventListener("change", () => setMenu(false));
  }

  /* ---------- Scrollspy ---------- */
  const sectionLinks = Array.from(document.querySelectorAll('.nav__link[href^="#"]'));
  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  function setActive(id) {
    sectionLinks.forEach((link) => {
      if (link.getAttribute("href") === "#" + id) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if (sections.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      // La "línea" de activación está a un 40 % desde arriba del viewport.
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
  }

  /* ---------- Header y "volver arriba" ---------- */
  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (backToTop) backToTop.hidden = y < window.innerHeight * 0.8;
  }

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0 });
      const skipTarget = document.querySelector(".brand");
      if (skipTarget) skipTarget.focus({ preventScroll: true });
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
