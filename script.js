// =====================================================
// 1. CONFIGURACIÓ GENERAL
// =====================================================

Chart.register(ChartDataLabels);

const chartContainer = document.getElementById("chartContainer");

const resizeObserver = new ResizeObserver(() => {
  if (chartInstance) {
    chartInstance.resize();
  }
});

resizeObserver.observe(chartContainer);



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
let activeMarker = null;




// =====================================================
// 2. COORDENADES AUTOMÀTIQUES
// =====================================================

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
  "Teatre Fortuny Reus":[41.15607655460499, 1.106775999069214],
  "CaixaForum Tarragona":[41.1189, 1.2445],
  "ECM Tarragona": [41.1178, 1.2556],
  "ECM Reus": [41.1537, 1.1068],
  "ECM Tortosa": [40.8120, 0.5210],
  "EAD Tarragona": [41.1189, 1.2445],
  "EAD Reus": [41.1537, 1.1068],
  "CEE Sant Rafael":[41.128037847775666, 1.2425225973129275],
  "Els Pallaresos":[41.1746, 1.2726 ],
  "Gratallops":[41.1936, 0.7752],
  "MAMT Tarragona":[41.11726404543777,1.25850185751915],
  "Olot":[ 42.1817, 2.4889],
  "Platja de l'Arrabassada":[41.1305, 1.2762],
  "Renau":[41.2245, 1.3112],
  "Reus":[41.1536585771981, 1.1068122088909151],
  "Reus i rodalies":[41.1536585771981, 1.1068122088909151],
  "MAMT Tarragona":[41.11726404543777, 1.25850185751915],
  "Sant Joan de Mediona":[41.4762, 1.6123],
  "Tarragona":[41.1189, 1.2445],
  "Vic":[41.9301, 2.2549],
  "Port de Tarragona":[41.1054, 1.2458]
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
    const poblacio = (row["poblacio"] || "").trim();

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
      poblacio,
      lat: coords[0],
      lng: coords[1]
    };
  });
}


// =====================================================
// 9. CÀRREGA GLOBAL D’ACTIVITATS
// =====================================================


async function loadAllActivities() {

  const [ecmtgn, ecmreus, eadtarragona, eadreus] = await Promise.all([
    loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vQM9_3hh4cmaap-esG8M69XanLMNLfjy8r8ifOTnR47ZcyFBLjLl7lT32q7wtML0aOZBe8vY6WvkY_v/pub?output=csv"),
    loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vSVcE7byD4WyMLNz9koF-JmCNH5c88mtN3eHZggjBqwlB4JAcbfPhyKVOx0skPCnHKYm0WgvNG87Qdv/pub?output=csv"),
    loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vTwPWgHKEvVZHbxF1o-0z3UAaUOd3Tnmn959AsYLxLifdlpn8e8z3uENnJtun0nwktqkhV-4eZe1nIy/pub?output=csv"),
    loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vQASlY9Y8uyzLDimZp0PB6IJ53r-ohTIffRQ-gCpdEiP8-RRH-CBvuu8CS3yzA59JXtPL4hVQ9z9yyH/pub?output=csv")
  ]);

  activities = [
    ...eadtarragona,
    ...eadreus,
    ...ecmtgn,
    ...ecmreus
  ];


  initMap();

  const loading = document.getElementById("loading");
  if (loading) loading.style.display = "none";
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

function getActiveMarkerIcon(color) {
  return L.divIcon({
    className: "custom-marker active-marker",
    html: `
      <div style="
        width:26px;
        height:26px;
        background:${color};
        border-radius:50%;
        border:3px solid black;
      "></div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
}







function parseDate(dateStr) {
  if (!dateStr) return new Date(0);

  const months = {
    gener: 0, enero: 0,
    febrer: 1, febrero: 1,
    març: 2, marzo: 2,
    abril: 3,
    maig: 4, mayo: 4,
    juny: 5, junio: 5,
    juliol: 6, julio: 6,
    agost: 7, agosto: 7,
    setembre: 8, septiembre: 8,
    octubre: 9,
    novembre: 10, noviembre: 10,
    desembre: 11, diciembre: 11
  };

  const parts = dateStr.toLowerCase().split(" ");

  // formato: "21 nov 2024"
  if (parts.length === 3 && !isNaN(parts[0])) {
    const day = parseInt(parts[0]);
    const month = months[parts[1]] ?? 0;
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  }

  // formato: "abril 2025"
  if (parts.length === 2) {
    const month = months[parts[0]] ?? 0;
    const year = parseInt(parts[1]);
    return new Date(year, month, 1);
  }

  return new Date(0);
}







// =====================================================
// 9. UI: PANELL I FILTRES
// =====================================================

const panel = document.getElementById("centerPanel");
const heatToggle = document.getElementById("heatToggle");



const centerSelect = document.getElementById("centerSelect");

centerSelect.addEventListener("change", updateFilters);


// =====================================================
// 10. FILTRE PER CENTRES
// =====================================================




function updateFilters() {

  markers.clearLayers();

  const visibleActivities = [];

  allMarkers.forEach((marker, index) => {

    const activity = activities[index];

    const show =
      selectedCenter === "all" ||
      activity.center === selectedCenter;

    if (show) {
      markers.addLayer(marker);
      visibleActivities.push(activity);
    }
  });

  renderActivityList(visibleActivities);
}



// =====================================================
// 11. TOGGLE MAPA DE CALOR
// =====================================================

// heatToggle.checked = false;

// heatToggle.addEventListener("change", () => {

//   if (heatToggle.checked) {
//     map.removeLayer(markers);
//     map.addLayer(heatLayer);

//   } else {
//     map.removeLayer(heatLayer);
//     map.addLayer(markers);
//     updateFilters();
//   }
// });










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

    act.marker = marker;


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
  renderActivityList(activities);


}


loadAllActivities();

function renderActivityList(filteredActivities) {

  const container = document.getElementById("activityList");
  container.innerHTML = "";

  // ordenar por fecha (más reciente arriba)
  const sorted = [...filteredActivities].sort((a, b) => {
    return parseDate(b.date) - parseDate(a.date);
  });

  sorted.forEach(act => {
    const div = document.createElement("div");
    div.className = "activity-item";
    div.style.cursor = "pointer";

div.addEventListener("click", () => {

  // quitar selección previa en lista
  document.querySelectorAll(".activity-item.active")
    .forEach(el => el.classList.remove("active"));

  div.classList.add("active");

  if (!act.marker) return;

  markers.zoomToShowLayer(act.marker, () => {

    

    // restaurar marcador anterior
    if (activeMarker) {
      const prevColor = centerColors[activeMarker.options.center] || "#666";
      activeMarker.setIcon(getMarkerIcon(prevColor));
    }

    // activar marcador actual
    const color = centerColors[act.center] || "#666";
    act.marker.setIcon(getActiveMarkerIcon(color));
    activeMarker = act.marker;

    act.marker.openPopup();
  });
});

    div.innerHTML = `
      <strong>${act.title}</strong>
      <span>${act.place}</span><br>
      <span>${act.date} · ${act.center}</span>
    `;

    container.appendChild(div);
  });
}





const toggleCenters = document.getElementById("toggleCenters");
const centersBlock = document.getElementById("centersBlock");

if (toggleCenters && centersBlock) {
  toggleCenters.addEventListener("click", () => {
    centersBlock.classList.toggle("collapsed");
    toggleCenters.classList.toggle("open");
  });
}


const customSelect = document.getElementById("centerSelect");
const selectDisplay = customSelect.querySelector(".select-display");
const selectOptions = customSelect.querySelectorAll(".select-option");

let selectedCenter = "all";

// abrir/cerrar menú
selectDisplay.addEventListener("click", () => {
  customSelect.classList.toggle("open");
});

// elegir opción
selectOptions.forEach(option => {
  option.addEventListener("click", () => {

    selectedCenter = option.dataset.value;
    selectDisplay.textContent = option.textContent;
    selectDisplay.dataset.value = selectedCenter;

    customSelect.classList.remove("open");
    updateFilters();
  });
});

// cerrar si se hace click fuera
document.addEventListener("click", (e) => {
  if (!customSelect.contains(e.target)) {
    customSelect.classList.remove("open");
  }
});






// gràfica de dades

let chartInstance = null;

function getActivitiesByPlace() {
  const counts = {};

  activities.forEach(act => {
    const poblacio = act.poblacio.trim();
    counts[poblacio] = (counts[poblacio] || 0) + 1;
  });

  return counts;
}

function renderChart() {

  const entries = Object.entries(getActivitiesByPlace())
    .sort((a, b) => b[1] - a[1]);

  const labels = entries.map(e => e[0]);
  const values = entries.map(e => e[1]);

  const ctx = document.getElementById("chartView").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Activitats per població",
        data: values
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 20
      },
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          anchor: "end",
          align: "top",
          color: "#111",
          font: {
            size: 12,
            weight: "bold"
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#111",
            font: {
              size: 12
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            color: "#111",
            font: {
              size: 12
            }
          },
          grid: {
            color: "rgba(0,0,0,0.1)"
          }
        }
      }
    }

  });
}



const mapDiv = document.getElementById("map");
const chartCanvas = document.getElementById("chartView");

document.getElementById("viewMap").addEventListener("click", () => {
  mapDiv.style.display = "block";
  chartCanvas.style.display = "none";
});

document.getElementById("viewChart").addEventListener("click", () => {
  mapDiv.style.display = "none";
  chartContainer.style.display = "block";
  renderChart();

  // fuerza adaptación al espacio visible
  setTimeout(() => chartInstance.resize(), 0);
});
