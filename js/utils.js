// =====================================================
// FUNCIONS AUXILIARS
// =====================================================


// -----------------------------------------------------
// COLORS
// -----------------------------------------------------

function getCenterColor(center) {
  return centerColors[center] || "#666";
}



// -----------------------------------------------------
// NORMALITZACIÓ DE TEXT
// (s'utilitzarà a la cerca)
// -----------------------------------------------------

function normalizeText(text) {

  if (!text) return "";

  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

}



// -----------------------------------------------------
// CONVERSIÓ DE DATES
// -----------------------------------------------------

function parseDate(dateStr) {

  if (!dateStr) return new Date(0);

  const months = {

    gener:0,
    enero:0,

    febrer:1,
    febrero:1,

    març:2,
    marzo:2,

    abril:3,

    maig:4,
    mayo:4,

    juny:5,
    junio:5,

    juliol:6,
    julio:6,

    agost:7,
    agosto:7,

    setembre:8,
    septiembre:8,

    octubre:9,

    novembre:10,
    noviembre:10,

    desembre:11,
    diciembre:11

  };

  const parts = dateStr
    .toLowerCase()
    .trim()
    .split(/\s+/);

  // exemple:
  // 21 març 2026

  if (parts.length === 3 && !isNaN(parts[0])) {

    return new Date(

      parseInt(parts[2]),
      months[parts[1]] ?? 0,
      parseInt(parts[0])

    );

  }

  // exemple:
  // març 2026

  if (parts.length === 2) {

    return new Date(

      parseInt(parts[1]),
      months[parts[0]] ?? 0,
      1

    );

  }

  return new Date(0);

}



// -----------------------------------------------------
// ORDENACIÓ
// -----------------------------------------------------

function sortActivitiesByDate(list) {

  return [...list].sort((a,b)=>{

    return parseDate(b.date) - parseDate(a.date);

  });

}



// -----------------------------------------------------
// COORDENADES D'UNA ACTIVITAT
// -----------------------------------------------------

function getActivityCoordinates(activity){

  if(activity.poblacio){

    const coords = placeCoordinates[activity.poblacio.trim()];

    if(coords) return coords;

  }

  if(activity.center){

    const coords = centerCoordinates[activity.center];

    if(coords) return coords;

  }

  return [41.1189,1.2445];

}



// -----------------------------------------------------
// COMPTADOR
// -----------------------------------------------------

function countBy(list,key){

  const counts = {};

  list.forEach(item=>{

    const value = item[key];

    counts[value] = (counts[value] || 0) + 1;

  });

  return counts;

}



// -----------------------------------------------------
// FORMAT DE TEXT
// -----------------------------------------------------

function safeText(value){

  if(value===undefined) return "";

  if(value===null) return "";

  return value.toString();

}
