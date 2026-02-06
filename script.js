// =====================================================
// 1. CONFIGURACIÓ GENERAL
// =====================================================

// Colors per centre
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
let allMarkers = [];


// =====================================================
// 2. COORDENADES AUTOMÀTIQUES
// =====================================================

// Coordenades per lloc
const placeCoordinates = {
  "Conservatori Tarragona": [41.1178, 1.2556],
  "Auditori Diputació": [41.1180, 1.2451],
  "Teatre Tarragona": [41.1143, 1.2557],
  "Biblioteca pública": [41.1138, 1.2500],
  "Camp de Mart": [41.1200, 1.2560],
  "Conservatori Reus": [41.1537, 1.1068],
  "Auditori Higini Anglès": [41.1537, 1.1068],
  "Barcelona": [41.3874, 2.1686]
};

// Coordenades per centre (fallback)
const centerCoordinates = {
  "ECM Tarragona": [41.1178, 1.2556],
  "ECM Reus": [41.1537, 1.1068],
  "ECM Tortosa": [40.8120, 0.5210],
  "EAD Tarragona": [41.1189, 1.2445],
  "EAD Reus": [41.1537, 1.1068]
};


// =====================================================
// 3. CREACIÓ DEL MAPA BASE
// =====================================================

const map = L.map('map').setView([41.1189, 1.2445], 9);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
  .addTo(map);


// =====================================================
// 4. CLUSTERS PERSONALITZATS
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
// 5. HEATMAP
// =====================================================

const heatLayer = L.heatLayer([], {
  radius: 25,
  blur: 20,
  maxZoom: 12
});


// =====================================================
// 6. ICONA DE MARCADOR
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
// 7. CÀRREGA CSV SENSE COORDENADES
// =====================================================

async function loadCSV(path) {
  const response = await fetch(path);
  const text = await response.text();

  const lines = text.split("\n").slice(1);

  return lines
    .filter(line => line.trim() !== "")
    .map(line => {
      const parts = line.split(";");

      const title = parts[0];
      const place = parts[1];
      const date = parts[2];
      const center = parts[3];

      let coords = placeCoordinates[place];

      if (!coords) {
        coords = centerCoordinates[center];
      }

      if (!coords) {
        console.warn("Sense coordenades:", place, center);
        return null;
      }

      return {
        title,
        place,
        date,
        center,
        lat: coords[0],
        lng: coords[1]
      };
    })
    .filter(item => item !== null);
}


// =====================================================
// 8. CONSTRUCCIÓ DEL MAPA
// =====================================================

function initMap() {

  markers.clearLayers();
  allMarkers.length = 0;

  const heatPoints = activities.map(act => [
    act.lat,
    act.lng,
    1
  ]);
  heatLayer.setLatLngs(heatPoints);

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
      <strong>${act.title}</strong><br>
      Centre: ${act.center}<br>
      Lloc: ${act.place}<br>
      Data: ${act.date}
    `);

    markers.addLayer(marker);
    allMarkers.push(marker);
  });

  map.addLayer(markers);
}


// =====================================================
// 9. CÀRREGA GLOBAL D’ACTIVITATS
// =====================================================

async function loadAllActivities() {

  const tgn = await loadCSV(
    "https://dnlzqn.github.io/activitatsEducacioDipta/data/ECMTarragona.csv"
  );

  activities = [
    ...tgn
  ];

  initMap();
}


// =====================================================
// INICI
// =====================================================

loadAllActivities();
