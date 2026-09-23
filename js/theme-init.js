/*
 * Se carga de forma síncrona en <head>: aplica el tema guardado
 * (o el del sistema) antes de pintar, para evitar un parpadeo.
 */
(function () {
  var root = document.documentElement;
  var stored = null;

  try {
    stored = localStorage.getItem("theme");
  } catch (error) {
    stored = null;
  }

  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = stored || (prefersDark ? "dark" : "light");
  root.classList.add("js");
})();
