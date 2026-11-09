function initDragDrop() {
  const zones = document.querySelectorAll(".dropzone");

  zones.forEach(function (zone) {
    zone.addEventListener("dragstart", function (event) {
      const card = event.target.closest(".card");
      if (!card) {
        return;
      }
      event.dataTransfer.setData("text/plain", card.dataset.id);
      event.dataTransfer.effectAllowed = "move";
    });

    zone.addEventListener("dragover", function (event) {
      // Without preventDefault the browser does not allow dropping
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      const currentZone = event.target.closest(".dropzone");
      if (currentZone) {
        currentZone.classList.add("drag-over");
      }
    });

    zone.addEventListener("dragleave", function (event) {
      // Ignore dragleave fired when moving over a child element
      if (!zone.contains(event.relatedTarget)) {
        zone.classList.remove("drag-over");
      }
    });

    zone.addEventListener("drop", function (event) {
      event.preventDefault();

      const dropZone = event.target.closest(".dropzone");
      if (!dropZone) {
        return;
      }
      dropZone.classList.remove("drag-over");

      const id = event.dataTransfer.getData("text/plain");
      if (!id) {
        return;
      }

      showBoardMessage("");
      const result = moveEvent(id, dropZone.dataset.status);
      if (!result.ok) {
        showBoardMessage(result.message);
      }
    });
  });
}