// Entry point: starts every module once the page is loaded

document.addEventListener("DOMContentLoaded", function () {
  initAgenda();
  initDragDrop();
  initGeolocation();
  drawChart();
});