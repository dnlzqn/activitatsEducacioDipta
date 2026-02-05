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


// =====================================================
// 4. DADES D’ACTIVITATS
// =====================================================

const activities = [

  // --- EAD TARRAGONA ---

  { title: "Taller de fotografia aèria", place: "Platja de l'Arrabassada", date: "Octubre 2024", center: "EAD Tarragona", lat: 41.1305, lng: 1.2762 },
  { title: "Visita a Fotollibre", place: "Els Pallaresos", date: "Octubre 2024", center: "EAD Tarragona", lat: 41.1746, lng: 1.2726 },
  { title: "Premis Eva Toldrà", place: "Olot", date: "Octubre 2024", center: "EAD Tarragona", lat: 42.1817, lng: 2.4889 },

  { title: "Conferència Alba G. Corral", place: "EADT Tarragona", date: "8 nov 2024", center: "EAD Tarragona", lat: 41.131663874360456, lng: 1.24307781457901 },
  { title: "Festival SCAN – sortida", place: "Tarragona", date: "nov 2024", center: "EAD Tarragona", lat: 41.1189, lng: 1.2445 },
  { title: "Taller modelat amb fang", place: "EADT Tarragona", date: "nov 2024", center: "EAD Tarragona", lat: 41.131663874360456, lng: 1.24307781457901 },
  { title: "Visita exposició SCAN", place: "MAMT Tarragona", date: "22 nov 2024", center: "EAD Tarragona", lat: 41.11726404543777, lng: 1.25850185751915 },
  { title: "Visita espai fotogràfic", place: "Renau", date: "21 nov 2024", center: "EAD Tarragona", lat: 41.2245, lng: 1.3112 },
  { title: "Exposicions SCAN", place: "Port de Tarragona", date: "29 nov 2024", center: "EAD Tarragona", lat: 41.1054, lng: 1.2458 },
  { title: "Exposició joieria", place: "Gratallops", date: "nov 2024", center: "EAD Tarragona", lat: 41.1936, lng: 0.7752 },

  { title: "Taller de dibuix amb model", place: "EADT Tarragona", date: "18 des 2024", center: "EAD Tarragona", lat: 41.131663874360456, lng: 1.24307781457901 },
  { title: "Visita CaixaForum", place: "CaixaForum Tarragona", date: "19 des 2024", center: "EAD Tarragona", lat: 41.1189, lng: 1.2445 },
  { title: "Visita estudi Bildi", place: "Sant Joan de Mediona", date: "3 des 2024", center: "EAD Tarragona", lat: 41.4762, lng: 1.6123 },
  { title: "Visita impremta", place: "Tarragona", date: "des 2024", center: "EAD Tarragona", lat: 41.1189, lng: 1.2445 },
  { title: "Fireta de la Pilarin", place: "Vic", date: "20 des 2024", center: "EAD Tarragona", lat: 41.9301, lng: 2.2549 },

  { title: "Exposició Antiga Audiència", place: "Tarragona", date: "abril 2025", center: "EAD Tarragona", lat: 41.1189, lng: 1.2445 },
  { title: "Mural Institut Martí Franquès", place: "Tarragona", date: "abril 2025", center: "EAD Tarragona", lat: 41.1189, lng: 1.2445 },
  { title: "Exposició fotogràfica", place: "Teatre de Tarragona", date: "3 abril 2025", center: "EAD Tarragona", lat: 41.1189, lng: 1.2445 },
  { title: "Exposició a Renau", place: "Renau", date: "abril 2025", center: "EAD Tarragona", lat: 41.2245, lng: 1.3112 },
  { title: "Visita Folch + Vasava", place: "Barcelona", date: "22 abril 2025", center: "EAD Tarragona", lat: 41.3874, lng: 2.1686 },

  // --- EAD REUS ---

  { title: "Sortides programades al carrer", place: "Reus i rodalies", date: "Novembre 2024", center: "EAD Reus", lat: 41.1536585771981, lng: 1.1068122088909151 },
  { title: "Sortides per dibuixar del natural", place: "Reus i rodalies", date: "Novembre 2024", center: "EAD Reus", lat: 41.1536585771981, lng: 1.1068122088909151 },
  { title: "Sortida fotogràfica per Reus", place: "Reus", date: "Novembre 2024", center: "EAD Reus", lat: 41.1536585771981, lng: 1.1068122088909151 },
  { title: "Projecte Dbambú", place: "Online", date: "Octubre-Maig 2024-2025", center: "EAD Reus", lat: 41.1536585771981, lng: 1.1068122088909151 },
  { title: "Premis Habitácola 2025", place: "Barcelona", date: "7 novembre 2024", center: "EAD Reus", lat: 41.3874, lng: 2.1686 },
  { title: "Sortida Barcelona exposicions i aparadors", place: "Barcelona", date: "6 març 2025", center: "EAD Reus", lat: 41.3874, lng: 2.1686 },
  { title: "Jornades de disseny Yazoo 2025", place: "EAD Reus", date: "12-14 març 2025", center: "EAD Reus", lat: 41.1536585771981, lng: 1.1068122088909151 },
  { title: "Taller modelatge 3D amb Rubén Borràs", place: "EAD Reus", date: "26-28 març 2025", center: "EAD Reus", lat: 41.1536585771981, lng: 1.1068122088909151 },
  { title: "Taller modelatge 3D amb Rubén Borràs", place: "EAD Reus", date: "2 abril 2025", center: "EAD Reus", lat: 41.1536585771981, lng: 1.1068122088909151 },
  { title: "Xerrada AMOO Studio", place: "EAD Reus", date: "23 gener 2025", center: "EAD Reus", lat: 41.1536585771981, lng: 1.1068122088909151 },
  { title: "Conferència COAC Tarragona", place: "Tarragona", date: "23 gener 2025", center: "EAD Reus", lat: 41.1189, lng: 1.2445 }
];

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
// 8. CREACIÓ DELS MARCADORS
// =====================================================

const allMarkers = [];

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

// Afegir clusters al mapa per defecte
map.addLayer(markers);


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

updateCenterCounts();
