function initGeolocation() {
  const output = document.getElementById("location");
  if (!output) {
    return;
  }

  // Browser without geolocation support
  if (!("geolocation" in navigator)) {
    output.textContent = "Location unavailable.";
    return;
  }

  output.textContent = "Locating...";

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude.toFixed(4);
      const longitude = position.coords.longitude.toFixed(4);
      output.textContent = latitude + ", " + longitude;
    },
    function () {
      // Permission denied, position unavailable or timeout
      output.textContent = "Location unavailable.";
    },
    { timeout: 10000 }
  );
}