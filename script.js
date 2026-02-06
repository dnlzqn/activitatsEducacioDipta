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
const allMarkers = [];



// =====================================================
// 2. COORDENADES AUTOMÀTIQUES
// =====================================================

// Coordenades per lloc
const placeCoordinates = {
  "Conservatori de Tarragona": [41.1178, 1.2556],
  "Auditori de la Diputació": [41.1180, 1.2451],
  "Teatre Tarragona": [41.1143, 1.2557],
  "Biblioteca Pública de Tarragona": [41.1138, 1.2500],
  "Camp de Mart": [41.1200, 1.2560],
  "Conservatori Reus": [41.1537, 1.1068],
  "Auditori Higini Anglès": [41.15663998929609, 1.1067464947700503],
  "Barcelona": [41.3874, 2.1686],
  "Antiga Audiència": [41.11814707803434, 1.254943236708641],
  "Auditori de Barcelona":[41.39840739439517, 2.1856087446212773],
  "Barcelona":[41.3874, 2.1686],
  "Auditori de l'Hospitalet de l'Infant": [40.99415996586189, 0.9200754761695863],
  "Casa de colònies Ca Manxol":[41.00128166023987, 0.5998411774635316],
  "Plaça de la Llibertat":[41.158364392499614, 1.1060464382171633],
  "Plaça Prim":[41.15607655460499, 1.106775999069214],
  "Esglesia Sant Francesc a Reus":[41.15217135461001, 1.1083129048347475],
  "Auditori Josep Carreras a Vila-seca":[41.11184232865564, 1.1412671953439715],
  "Conservatori de Vila-seca":[41.11184232865564, 1.1412671953439715],
  "ESMUC":[41.39840739439517, 2.1856087446212773],
  "Biblioteca Xavier Amorós":[41.15399988234698, 1.0998934507369997],
  "Carrer Batan, Reus":[41.152775214670996, 1.1110863089561465],
  "Centre Amics de Reus": [41.152825704390665, 1.1092543601989748],
  "Conservatori Liceu Barcelona":[41.37612747376797, 2.170979976654053],
  "Conservatori municipal de Barcelona":[41.39585330637651, 2.167833745479584],
  "Escola Música Alcanar":[40.54037622078401, 0.4798364639282227],
  "Godall":[40.654694573023946, 0.4691505432128907],
  "Museu Salvador Vilaseca":[41.156370793327184, 1.110396981239319],
  "Palau Bofarull": [41.15663998929609, 1.1067464947700503],
  "Saló Noble Palau Bofarull": [41.15663998929609, 1.1067464947700503],
  "Prioral de Sant Pere":[41.154320990302566, 1.1097398400306704],
  "Teatre Fortuny Reus":[41.15607655460499, 1.106775999069214]

};

  //41.11781265862017, 1.2556017190217974 conservatori tarragona
  //41.11808140668262, 1.2451156228780749 auditori diputació
  //41.1143339894775, 1.2557391822338104 teatre tarragona
  //40.99415996586189, 0.9200754761695863 auditori hospitalet de l'infant
  //41.11376614971102, 1.2500233948230746 biblioteca pública
  //41.11184232865564, 1.1412671953439715 conservatori vila-seca
  //41.120072734921166, 1.2560476362705233 camp de mart
  //41.00128166023987, 0.5998411774635316 ca manxol rasquera
  //41.116530533356126, 1.2579768151044848 pretori
  //41.394394932221026, 1.0973225533962252 emm espluga de francolí
  //41.98108928026134, 2.8220231831073765 conservatori de girona

// Coordenades per centre (fallback)
const centerCoordinates = {
  "ECM Tarragona": [41.1178, 1.2556],
  "ECM Reus": [41.1537, 1.1068],
  "ECM Tortosa": [40.8120, 0.5210],
  "EAD Tarragona": [41.1189, 1.2445],
  "EAD Reus": [41.1537, 1.1068],
  "CEE Sant Rafael":[41.128037847775666, 1.2425225973129275],
};


// =====================================================
// 3. CREACIÓ DEL MAPA BASE
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
// 7. CÀRREGA CSV SENSE COORDENADES
// =====================================================

async function loadCSV(path) {
  const response = await fetch(path);
  const text = await response.text();

  const parsed = Papa.parse(text, {
    header: true,
    delimiter: ",",
    skipEmptyLines: true
  });

  return parsed.data.map(row => {
    const title = row["title"] || row["Activitat"] || "";
    const place = row["place"] || row["Lloc"] || "";
    const date = row["date"] || row["Data"] || "";
    const center = (row["center"] || row["Centre"] || "").trim();

    let coords = placeCoordinates[place];

    if (!coords) {
      coords = centerCoordinates[center];
    }

    if (!coords) {
      coords = [41.1189, 1.2445];
    }

    return {
      title,
      place,
      date,
      center,
      lat: coords[0],
      lng: coords[1]
    };
  });
}


// =====================================================
// 9. CÀRREGA GLOBAL D’ACTIVITATS
// =====================================================

async function loadAllActivities() {

  const ecmtgn = await loadCSV(
    //"https://dnlzqn.github.io/activitatsEducacioDipta/data/ECMTarragona.csv"
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQM9_3hh4cmaap-esG8M69XanLMNLfjy8r8ifOTnR47ZcyFBLjLl7lT32q7wtML0aOZBe8vY6WvkY_v/pub?output=csv"
  );

  const ecmreus = await loadCSV(
    "https://dnlzqn.github.io/activitatsEducacioDipta/data/ECMReus.csv"
  );

  activities = [
    ...ecmtgn,
    //...ecmreus
  ];

  initMap();

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
    html: `
      <div style="
        width:20px;
        height:20px;
        background:${color};
        border-radius:50%;
        border:2px solid white;
      "></div>
    `,
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
const checkboxes = panel.querySelectorAll(".center-item input[type=checkbox]");

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
  updateCenterCounts();
  updateFilters();

  activities.forEach(act => {
  console.log(act.center);
});


}


loadAllActivities();
