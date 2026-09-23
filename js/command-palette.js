/*
 * Paleta de comandos (Ctrl/⌘ + K): navegación rápida por teclado
 * a secciones y acciones. Pensada para quien revisa rápido.
 */
(function () {
  const palette = document.querySelector("[data-palette]");
  if (!palette || typeof palette.showModal !== "function") return;

  const input = palette.querySelector("[data-palette-input]");
  const list = palette.querySelector("[data-palette-list]");
  const onHome = Boolean(document.querySelector("#inicio"));
  const home = onHome ? "" : "index.html";

  const commands = [
    { label: "Inicio", type: "Sección", href: home + "#inicio", keywords: "home presentación ficha" },
    { label: "Sobre mí", type: "Sección", href: home + "#sobre-mi", keywords: "perfil formación universidad" },
    { label: "Skills", type: "Sección", href: home + "#skills", keywords: "habilidades tecnologías stack" },
    { label: "Proyectos", type: "Sección", href: home + "#proyectos", keywords: "trabajos portfolio repos" },
    { label: "Contacto", type: "Sección", href: home + "#contacto", keywords: "email formulario mensaje" },
    { label: "Design System", type: "Página", href: "design-system.html", keywords: "componentes colores tipografía" },
    { label: "Cambiar tema claro/oscuro", type: "Acción", run: () => window.portfolioTheme && window.portfolioTheme.toggle(), keywords: "dark light modo" },
    { label: "Copiar correo", type: "Acción", run: () => window.portfolioCopyEmail && window.portfolioCopyEmail(), keywords: "email mail" },
    { label: "Abrir GitHub", type: "Enlace", href: "https://github.com/theoriginalex", external: true, keywords: "código repositorios" },
    { label: "Abrir LinkedIn", type: "Enlace", href: "https://www.linkedin.com/in/%C3%ADndigo-ac-18b755331", external: true, keywords: "perfil profesional" },
  ];

  let results = commands;
  let activeIndex = 0;

  function normalize(text) {
    return text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  }

  function render() {
    list.replaceChildren();

    if (!results.length) {
      const empty = document.createElement("li");
      empty.className = "palette__empty";
      empty.textContent = "Sin resultados.";
      list.append(empty);
      input.removeAttribute("aria-activedescendant");
      return;
    }

    results.forEach((command, index) => {
      const option = document.createElement("li");
      option.className = "palette__option";
      option.id = "palette-option-" + index;
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(index === activeIndex));

      const label = document.createElement("span");
      label.textContent = command.label;
      const type = document.createElement("span");
      type.className = "palette__option-type";
      type.textContent = command.type;

      option.append(label, type);
      option.addEventListener("click", () => execute(command));
      option.addEventListener("mousemove", () => {
        if (activeIndex !== index) {
          activeIndex = index;
          updateSelection();
        }
      });
      list.append(option);
    });

    updateSelection();
  }

  function updateSelection() {
    Array.from(list.children).forEach((option, index) => {
      option.setAttribute("aria-selected", String(index === activeIndex));
    });
    const active = list.children[activeIndex];
    if (active && active.id) {
      input.setAttribute("aria-activedescendant", active.id);
      active.scrollIntoView({ block: "nearest" });
    }
  }

  function filter() {
    const query = normalize(input.value.trim());
    results = commands.filter((command) =>
      normalize(command.label + " " + command.type + " " + command.keywords).includes(query)
    );
    activeIndex = 0;
    render();
  }

  function execute(command) {
    palette.close();
    if (command.run) {
      command.run();
    } else if (command.external) {
      window.open(command.href, "_blank", "noopener");
    } else {
      window.location.href = command.href;
    }
  }

  function open() {
    input.value = "";
    filter();
    palette.showModal();
    input.focus();
  }

  input.addEventListener("input", filter);

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!results.length) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      activeIndex = (activeIndex + step + results.length) % results.length;
      updateSelection();
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      execute(results[activeIndex]);
    }
  });

  palette.addEventListener("click", (event) => {
    if (event.target === palette) palette.close();
  });

  document.querySelectorAll("[data-palette-open]").forEach((button) => {
    button.addEventListener("click", open);
  });

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (palette.open) palette.close();
      else open();
    }
  });
})();
