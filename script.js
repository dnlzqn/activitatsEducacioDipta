// =====================================================
// 1. CONFIGURACIÓ GENERAL
// =====================================================

const centerColors = {
  "EAD Tarragona": "#e63946",
  "EAD Reus": "#1d3557",
  "ECM Tarragona": "#2a9d8f",
  "ECM Tortosa": "#ffb703",
  "ECM Reus": "#9b5de5",
  "CEE Sant Rafael": "#fb5607",
  "CEE Alba": "#3a86ff",
  "CEE Sant Jordi": "#6a994e"
};

let activities = [];
const allMarkers = [];


// =====================================================
// 2. CREACIÓ DEL MAPA BASE
// =====================================================

const map = L.map('map').setView([41.1189, 1.2445], 9);

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


// =====================================================
// 4. HEATMAP
// =====================================================

const heatLayer = L.heatLayer([], {
  radius: 25,
  blur: 20,
  maxZoom: 12
});


// =====================================================
// 5. FUNCIÓ D’ICONA DE MARCADOR
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
// 6. CÀRREGA DE CSV
// =====================================================

async function loadCSV(path, center, lat, lng) {
  const response = await fetch(path);
  const text = await response.text();

  const lines = text.split("\n").slice(1);

  return lines
    .filter(line => line.trim() !== "")
    .map(line => {
      const parts = line.split(";");

      return {
        title: parts[0],
        place: parts[1] || center,
        date: parts[2] || "",
        center: center,
        lat: lat,
        lng: lng
      };
    });
}


// =====================================================
// 7. CONSTRUCCIÓ DEL MAPA
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


// =====================================================
// 8. CÀRREGA GLOBAL D’ACTIVITATS
// =====================================================

async function loadAllActivities() {

  // Activitats fixes (EAD, etc.)
  const localActivities = [
    {
      title: "Conferència Alba G. Corral",
      place: "EADT Tarragona",
      date: "8 nov 2024",
      center: "EAD Tarragona",
      lat: 41.1189,
      lng: 1.2445
    }
  ];

  const reus = await loadCSV(
    "data/ECM Reus.csv",
    "ECM Reus",
    41.1537,
    1.1068
  );

  const tgn = await loadCSV(
    "data/ECM Tarragona.csv",
    "ECM Tarragona",
    41.1189,
    1.2445
  );

  activities = [
    ...localActivities,
    ...reus,
    ...tgn
  ];

  initMap();
}


// =====================================================
// 9. UI: PANELL I FILTRES
// =====================================================

const panel = document.getElementById("centerPanel");
const toggleBtn = document.getElementById("togglePanel");
const heatToggle = document.getElementById("heatToggle");

toggleBtn.addEventListener("click", () => {
  panel.style.display = panel.style.display === "block" ? "none" : "block";
});

const checkboxes = panel.querySelectorAll("input[type=checkbox]");
checkboxes.forEach(cb => {
  cb.addEventListener("change", updateFilters);
});


// =====================================================
// 10. FILTRE PER CENTRES
// =====================================================

function updateFilters() {

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
// 11. COMPTADOR D’ACTIVITATS
// =====================================================

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
// 12. TOGGLE HEATMAP
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


// =====================================================
// INICI
// =====================================================

loadAllActivities();
