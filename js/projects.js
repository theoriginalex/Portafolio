/*
 * Proyectos: filtro por tecnología y modal de detalles.
 * Los datos viven en el HTML (data-tags y <template>), así el
 * contenido sigue siendo visible e indexable sin JavaScript.
 */
(function () {
  const grid = document.querySelector("[data-projects]");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(".project-card"));
  const chips = Array.from(document.querySelectorAll("[data-filter]"));
  const status = document.querySelector("[data-filter-status]");
  const emptyState = document.querySelector("[data-empty-state]");

  /* ---------- Filtro ---------- */
  function applyFilter(filter) {
    let visible = 0;

    cards.forEach((card) => {
      const tags = card.dataset.tags.split(" ");
      const match = filter === "all" || tags.includes(filter);
      card.hidden = !match;
      if (match) visible += 1;
    });

    chips.forEach((chip) => {
      chip.setAttribute("aria-pressed", String(chip.dataset.filter === filter));
    });

    if (status) {
      status.textContent = `Mostrando ${visible} de ${cards.length} proyectos`;
    }
    if (emptyState) emptyState.hidden = visible > 0;
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => applyFilter(chip.dataset.filter));
  });

  /* ---------- Modal ---------- */
  const modal = document.querySelector("[data-project-modal]");
  if (!modal || typeof modal.showModal !== "function") return;

  const modalTitle = modal.querySelector("#modal-title");
  const modalImage = modal.querySelector("[data-modal-image]");
  const modalContent = modal.querySelector("[data-modal-content]");
  const modalLinks = modal.querySelector("[data-modal-links]");

  function openProject(card) {
    const title = card.querySelector(".project-card__title");
    const image = card.querySelector(".project-card__media img");
    const details = card.querySelector("template[data-project-details]");
    const problem = card.querySelector(".project-card__problem");
    const tags = card.querySelector(".tag-list");

    modalTitle.textContent = title.textContent;
    modalImage.src = image.getAttribute("src");
    modalImage.alt = image.alt;

    modalContent.replaceChildren();
    if (problem) modalContent.append(problem.cloneNode(true));
    if (details) modalContent.append(details.content.cloneNode(true));
    if (tags) modalContent.append(tags.cloneNode(true));

    modalLinks.replaceChildren(
      ...Array.from(card.querySelectorAll(".project-card__footer a")).map((link) => link.cloneNode(true))
    );

    modal.showModal();
    modal.scrollTop = 0;
  }

  grid.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-project-open]");
    if (trigger) openProject(trigger.closest(".project-card"));
  });

  modal.querySelector("[data-modal-close]").addEventListener("click", () => modal.close());

  // Clic fuera del panel (sobre el backdrop) cierra el modal.
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
})();
