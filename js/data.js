// =====================================================
// CÀRREGA DE DADES
// =====================================================


// -----------------------------------------------------
// Fonts de dades
// -----------------------------------------------------

const dataSources = [

  {
    center: "ECM Tarragona",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQM9_3hh4cmaap-esG8M69XanLMNLfjy8r8ifOTnR47ZcyFBLjLl7lT32q7wtML0aOZBe8vY6WvkY_v/pub?output=csv"
  },

  {
    center: "ECM Reus",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSVcE7byD4WyMLNz9koF-JmCNH5c88mtN3eHZggjBqwlB4JAcbfPhyKVOx0skPCnHKYm0WgvNG87Qdv/pub?output=csv"
  },

  {
    center: "EAD Tarragona",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwPWgHKEvVZHbxF1o-0z3UAaUOd3Tnmn959AsYLxLifdlpn8e8z3uENnJtun0nwktqkhV-4eZe1nIy/pub?output=csv"
  },

  {
    center: "EAD Reus",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQASlY9Y8uyzLDimZp0PB6IJ53r-ohTIffRQ-gCpdEiP8-RRH-CBvuu8CS3yzA59JXtPL4hVQ9z9yyH/pub?output=csv"
  },

  {
    center: "ECM Tortosa",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRscIasfqMQgtnJRDSF_OiPcV8wnAS02zrLsENIwKjwlyYzmww6aSA4Fb48tLz1genW-HMTL3XmqJDk/pub?output=csv"
  }

];



// =====================================================
// LLEGIR UN CSV
// =====================================================

async function loadCSV(url){

  const response = await fetch(url);

  const text = await response.text();

  const parsed = Papa.parse(text,{

    header:true,
    delimiter:",",
    skipEmptyLines:true

  });

  return parsed.data;

}



// =====================================================
// CONVERTIR FILA EN ACTIVITAT
// =====================================================

function parseActivity(row){

  const activity = {

    title:

      safeText(

        row.title ||

        row.Activitat

      ),

    place:

      safeText(

        row.place ||

        row.Lloc

      ).trim(),

    date:

      safeText(

        row.date ||

        row.Data

      ),

    center:

      safeText(

        row.center ||

        row.Centre

      ).trim(),

    poblacio:

      safeText(

        row.poblacio

      ).trim()

  };



  const coords = getActivityCoordinates(activity);

  activity.lat = coords[0];
  activity.lng = coords[1];

  activity.marker = null;

  return activity;

}



// =====================================================
// CARREGAR TOTES LES DADES
// =====================================================

async function loadAllActivities(){


  const loading = document.getElementById("loading");


  try{

    const datasets = await Promise.all(

      dataSources.map(source => loadCSV(source.url))

    );


    state.activities = datasets

      .flat()

      .map(parseActivity);


    console.log(

      `✔ ${state.activities.length} activitats carregades`

    );


  }

  catch(error){

    console.error(error);

    alert("No s'han pogut carregar les activitats.");

  }

  finally{

    if(loading){

      loading.style.display = "none";

    }

  }

}
