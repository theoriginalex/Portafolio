
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

  const toastButton = document.querySelector("[data-ds-toast]");
  if (toastButton) {
    toastButton.addEventListener("click", () => {
      if (window.portfolioToast) window.portfolioToast("Así se ve una notificación toast.");
    });
  }

  const demoForm = document.querySelector("[data-ds-form]");
  if (demoForm) {
    demoForm.addEventListener("submit", (event) => event.preventDefault());
  }
})();
