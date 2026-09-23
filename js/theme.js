/*
 * Tema claro/oscuro con persistencia en localStorage.
 * Si el usuario nunca eligió, se sigue la preferencia del sistema.
 */
(function () {
  const STORAGE_KEY = "theme";
  const root = document.documentElement;
  const toggles = document.querySelectorAll("[data-theme-toggle]");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const systemQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;

    const nextLabel = theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro";
    toggles.forEach((button) => button.setAttribute("aria-label", nextLabel));

    if (themeColorMeta) {
      const background = getComputedStyle(root).getPropertyValue("--color-background").trim();
      themeColorMeta.setAttribute("content", background);
    }

    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
  }

  function toggleTheme() {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      /* Sin almacenamiento disponible: el cambio dura solo esta visita. */
    }
    applyTheme(next);
  }

  toggles.forEach((button) => button.addEventListener("click", toggleTheme));

  systemQuery.addEventListener("change", (event) => {
    if (!getStoredTheme()) {
      applyTheme(event.matches ? "dark" : "light");
    }
  });

  applyTheme(root.dataset.theme || "light");

  // Expuesto para la paleta de comandos.
  window.portfolioTheme = { toggle: toggleTheme };
})();
