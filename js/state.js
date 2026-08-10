// =====================================================
// ESTAT GLOBAL DE L'APLICACIÓ
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


// -----------------------------------------------------
// Estat de l'aplicació
// -----------------------------------------------------

const state = {

  // dades originals
  activities: [],

  // activitats després d'aplicar filtres
  filteredActivities: [],

  // marcadors Leaflet
  markers: [],

  // marcador seleccionat
  activeMarker: null,

  // instància del gràfic
  chart: null

};


// -----------------------------------------------------
// Filtres actius
// -----------------------------------------------------

const filters = {

  center: "all",

  // iteració 2
  search: "",

  // iteració 3
  year: null,
  month: null

};


// -----------------------------------------------------
// Referències globals
// -----------------------------------------------------

const refs = {

  map: null,

  markerLayer: null,

  heatLayer: null,

  chartContainer: document.getElementById("chartContainer")

};


// -----------------------------------------------------
// Resize automàtic del gràfic
// -----------------------------------------------------

const resizeObserver = new ResizeObserver(() => {

  if (state.chart) {
    state.chart.resize();
  }

});

resizeObserver.observe(refs.chartContainer);


// -----------------------------------------------------
// Registrar Chart.js
// -----------------------------------------------------

Chart.register(ChartDataLabels);
