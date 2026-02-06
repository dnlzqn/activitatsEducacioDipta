// =====================================================
// 1. CONFIGURACIÓ GENERAL
// =====================================================

// Colors per centre
const centerColors = {
  "EAD Tarragona": "#e63946",   // vermell intens
  "EAD Reus": "#1d3557",        // blau fosc
  "ECM Tarragona": "#2a9d8f",   // verd turquesa
  "ECM Tortosa": "#ffb703",     // groc intens
  "ECM Reus": "#9b5de5",        // violeta
  "CEE Sant Rafael": "#fb5607", // taronja fort
  "CEE Alba": "#3a86ff",        // blau elèctric
  "CEE Sant Jordi": "#6a994e"   // verd oliva
};

let activities = [];
let allMarkers = [];

// =====================================================
// 2. CREACIÓ DEL MAPA BASE
// =====================================================

const map = L.map('map').setView([41.1189, 1.2445], 9);

// Capa base OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
  .addTo(map);


// =====================================================
// 3. CLUSTERS PERSONALITZATS
// =====================================================

const markers = L.markerClusterGroup({
  iconCreateFunction: function (cluster) {

    const children = cluster.getAllChildMarkers();
    const countByCenter = {};

    children.forEach(marker => {
      const center = marker.options.center;
      countByCenter[center] = (countByCenter[center] || 0) + 1;
    });

    let dominantCenter = null;
    let max = 0;

    for (let center in countByCenter) {
      if (countByCenter[center] > max) {
        max = countByCenter[center];
        dominantCenter = center;
      }
    }

    const color = centerColors[dominantCenter] || "#666";
    const size = cluster.getChildCount();

    return L.divIcon({
      html: `
        <div style="
          background:${color};
          width:40px;
          height:40px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-weight:bold;
          border:3px solid white;
          box-shadow:0 0 6px rgba(0,0,0,0.4);
        ">
          ${size}
        </div>
      `,
      className: "custom-cluster",
      iconSize: [40, 40]
    });
  }
});



async function loadCSV(path) {
  const response = await fetch(path);
  const text = await response.text();

  const lines = text.split("\n").slice(1);

  return lines
    .filter(line => line.trim() !== "")
    .map(line => {
      const parts = line.split(";");

      const lat = parseFloat(parts[4]);
      const lng = parseFloat(parts[5]);

      if (isNaN(lat) || isNaN(lng)) {
        return null;
      }

      return {
        title: parts[0],
        place: parts[1],
        date: parts[2],
        center: parts[3],
        lat: lat,
        lng: lng
      };
    })
    .filter(item => item !== null);
}






async function loadAllActivities() {

  const tgn = await loadCSV(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTOCPgqmpXlmIgw6mP_BCttJS5wp_YrGvUq-C1yZGG6T89fioT5zTYSoYcoGWA1Km8mkSlIoumhdwfM/pub?output=csv"
  );

  activities = [
    ...tgn
  ];

  initMap();
}

// =====================================================
// CONSTRUCCIÓ DEL MAPA
// =====================================================

function initMap() {

  markers.clearLayers();
  allMarkers.length = 0;

  // Actualitzar heatmap
  const heatPoints = activities.map(act => [
    act.lat,
    act.lng,
    1
  ]);
  heatLayer.setLatLngs(heatPoints);

  // Crear marcadors
  activities.forEach(act => {

    const color = centerColors[act.center] || "#666";

    const marker = L.marker(
      [act.lat, act.lng],
      {
        icon: getMarkerIcon(color),
        center: act.center
      }
    );

    marker.bindPopup(`
      <strong>${act.title || "Activitat"}</strong><br>
      Centre: ${act.center || "—"}<br>
      Lloc: ${act.place || "—"}<br>
      Data: ${act.date || "—"}
    `);

    markers.addLayer(marker);
    allMarkers.push(marker);
  });

  map.addLayer(markers);

  updateCenterCounts();
  updateFilters();
}



// ===============================
// 5. COMPTADOR D’ACTIVITATS PER CENTRE
// ===============================

function updateCenterCounts() {

  const counts = {};

  activities.forEach(act => {
    counts[act.center] = (counts[act.center] || 0) + 1;
  });

  const items = document.querySelectorAll(".center-item");

  items.forEach(item => {
    const checkbox = item.querySelector("input[type=checkbox]");
    const center = checkbox.value;
    const countEl = item.querySelector(".center-count");

    if (countEl) {
      countEl.textContent = `(${counts[center] || 0})`;
    }
  });
}



// =====================================================
// 6. HEATMAP
// =====================================================

const heatPoints = activities.map(act => [
  act.lat,
  act.lng,
  1
]);

const heatLayer = L.heatLayer(heatPoints, {
  radius: 25,
  blur: 20,
  maxZoom: 12
});


// =====================================================
// 7. FUNCIÓ D’ICONA DE MARCADOR
// =====================================================

function getMarkerIcon(color) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background:${color};"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
}





// =====================================================
// 9. UI: PANELL I FILTRES
// =====================================================

const panel = document.getElementById("centerPanel");
const toggleBtn = document.getElementById("togglePanel");
const heatToggle = document.getElementById("heatToggle");

// Obrir / tancar panell
toggleBtn.addEventListener("click", () => {
  panel.style.display = panel.style.display === "block" ? "none" : "block";
});

// Checkboxes de centres
const checkboxes = panel.querySelectorAll("input[type=checkbox]");

checkboxes.forEach(cb => {
  cb.addEventListener("change", updateFilters);
});


// =====================================================
// 10. FILTRE PER CENTRES
// =====================================================

function updateFilters() {

  // Si heatmap actiu, no fer res
  if (heatToggle.checked) return;

  const activeCenters = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  markers.clearLayers();

  allMarkers.forEach(marker => {
    if (activeCenters.includes(marker.options.center)) {
      markers.addLayer(marker);
    }
  });
}


// =====================================================
// 11. TOGGLE MAPA DE CALOR
// =====================================================

heatToggle.checked = false;

heatToggle.addEventListener("change", () => {

  if (heatToggle.checked) {
    map.removeLayer(markers);
    map.addLayer(heatLayer);

  } else {
    map.removeLayer(heatLayer);
    map.addLayer(markers);
    updateFilters();
  }
});

loadAllActivities();


