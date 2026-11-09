function drawChart() {
  const canvas = document.getElementById("chart");
  if (!canvas) {
    return;
  }
  const ctx = canvas.getContext("2d");

  const events = getEvents();
  const todayCount = events.filter(function (event) {
    return event.status === "today";
  }).length;
  const pendingCount = events.filter(function (event) {
    return event.status === "pending";
  }).length;

  const bars = [
    { label: "Today", value: todayCount, color: "#4f8cff" },
    { label: "Pending", value: pendingCount, color: "#f5a623" }
  ];

  const width = canvas.width;
  const height = canvas.height;
  const topMargin = 40;
  const bottomMargin = 40;
  const chartHeight = height - topMargin - bottomMargin;
  const barWidth = 100;
  const gap = 60;
  const totalWidth = bars.length * barWidth + (bars.length - 1) * gap;
  const startX = (width - totalWidth) / 2;
  const baseY = height - bottomMargin;

  // Avoid dividing by 0 when there are no events
  const maxValue = Math.max(todayCount, pendingCount, 1);

  // Clear the canvas before drawing
  ctx.clearRect(0, 0, width, height);

  // Baseline
  ctx.strokeStyle = "#999999";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(startX - 20, baseY);
  ctx.lineTo(startX + totalWidth + 20, baseY);
  ctx.stroke();

  ctx.textAlign = "center";
  bars.forEach(function (bar, index) {
    const x = startX + index * (barWidth + gap);
    const barHeight = (bar.value / maxValue) * chartHeight;
    const y = baseY - barHeight;

    // Bar
    ctx.fillStyle = bar.color;
    ctx.fillRect(x, y, barWidth, barHeight);

    // Number above the bar
    ctx.fillStyle = "#222222";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText(String(bar.value), x + barWidth / 2, y - 8);

    // Label below the bar
    ctx.font = "16px sans-serif";
    ctx.fillText(bar.label, x + barWidth / 2, baseY + 24);
  });
}