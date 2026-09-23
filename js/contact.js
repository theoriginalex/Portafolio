/*
 * Contacto: validación del formulario, contador de caracteres,
 * envío mediante mailto y botón "copiar correo" con toast.
 */
(function () {
  const CONTACT_EMAIL = "alexcchica02@gmail.com";
  const toast = document.querySelector("[data-toast]");
  let toastTimer;

  /* ---------- Toast ---------- */
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  window.portfolioToast = showToast;

  /* ---------- Copiar correo ---------- */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Correo copiado: " + text);
    } catch (error) {
      showToast("No se pudo copiar. Escribe a " + text);
    }
  }

  window.portfolioCopyEmail = () => copyText(CONTACT_EMAIL);

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => copyText(button.dataset.copy));
  });

  /* ---------- Formulario ---------- */
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const statusEl = form.querySelector("[data-form-status]");
  const message = form.querySelector("#message");
  const counter = form.querySelector("[data-char-count]");
  const fields = Array.from(form.querySelectorAll(".input"));

  const messages = {
    name: {
      valueMissing: "Escribe tu nombre.",
      tooShort: "El nombre debe tener al menos 2 caracteres.",
    },
    email: {
      valueMissing: "Escribe tu correo.",
      typeMismatch: "Revisa el formato del correo (ejemplo: nombre@empresa.com).",
    },
    subject: {
      valueMissing: "Elige el motivo del mensaje.",
    },
    message: {
      valueMissing: "Escribe tu mensaje.",
      tooShort: "El mensaje debe tener al menos 20 caracteres.",
    },
  };

  function getError(field) {
    const validity = field.validity;
    const fieldMessages = messages[field.name] || {};
    // Los espacios en blanco no cuentan como contenido.
    if (field.required && field.value.trim() === "") return fieldMessages.valueMissing;
    if (validity.typeMismatch) return fieldMessages.typeMismatch;
    if (field.minLength > 0 && field.value.trim().length < field.minLength) return fieldMessages.tooShort;
    return "";
  }

  function validateField(field) {
    const error = getError(field);
    const errorEl = form.querySelector("#" + field.id + "-error");
    field.setAttribute("aria-invalid", String(Boolean(error)));
    if (errorEl) errorEl.textContent = error;
    return !error;
  }

  fields.forEach((field) => {
    // Valida al salir del campo y, si ya tenía error, mientras se corrige.
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });

  if (message && counter) {
    const updateCounter = () => { counter.textContent = message.value.length; };
    message.addEventListener("input", updateCounter);
    updateCounter();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const invalid = fields.filter((field) => !validateField(field));
    if (invalid.length) {
      statusEl.className = "form__status is-error";
      statusEl.textContent = `Revisa ${invalid.length === 1 ? "el campo marcado" : "los " + invalid.length + " campos marcados"}.`;
      invalid[0].focus();
      return;
    }

    const data = new FormData(form);
    const subject = `[Portafolio] ${data.get("subject")} — ${data.get("name").trim()}`;
    const body = `${data.get("message").trim()}\n\n— ${data.get("name").trim()} (${data.get("email").trim()})`;

    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    statusEl.className = "form__status is-success";
    statusEl.textContent = "¡Listo! Se abrió tu cliente de correo con el mensaje preparado.";
    form.reset();
    fields.forEach((field) => field.removeAttribute("aria-invalid"));
    if (counter) counter.textContent = "0";
  });
})();
