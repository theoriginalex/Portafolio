/*
 * Design System: muestra el valor real de cada token de color
 * (leído del CSS, se actualiza al cambiar de tema) y hace
 * interactivas las demos de chips y toast.
 */
(function () {
  const valueEls = document.querySelectorAll("[data-token]");

  function paintTokenValues() {
    const styles = getComputedStyle(document.documentElement);
    valueEls.forEach((el) => {
      el.textContent = styles.getPropertyValue(el.dataset.token).trim();
    });
  }

  paintTokenValues();
  document.addEventListener("themechange", paintTokenValues);

  /* ---------- Demo de chips ---------- */
  const chipGroup = document.querySelector("[data-ds-chips]");
  if (chipGroup) {
    chipGroup.addEventListener("click", (event) => {
      const chip = event.target.closest(".chip");
      if (!chip) return;
      chipGroup.querySelectorAll(".chip").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === chip));
      });
    });
  }

  /* ---------- Demo de toast ---------- */
  const toastButton = document.querySelector("[data-ds-toast]");
  if (toastButton) {
    toastButton.addEventListener("click", () => {
      if (window.portfolioToast) window.portfolioToast("Así se ve una notificación toast.");
    });
  }

  /* ---------- Demo de formulario: no se envía ---------- */
  const demoForm = document.querySelector("[data-ds-form]");
  if (demoForm) {
    demoForm.addEventListener("submit", (event) => event.preventDefault());
  }
})();
