// =====================================================
// CHART.JS
// =====================================================


// -----------------------------------------------------
// Canvas
// -----------------------------------------------------

const chartCanvas = document.getElementById("chartView");



// =====================================================
// OBTENIR DADES
// =====================================================

function getActivitiesByPlace(activities) {

    const counts = {};

    activities.forEach(activity => {

        const place = activity.poblacio || "Sense població";

        counts[place] = (counts[place] || 0) + 1;

    });

    return counts;

}



// =====================================================
// CONVERTIR A FORMAT CHART
// =====================================================

function buildChartData() {

    const entries = Object.entries(

        getActivitiesByPlace(state.filteredActivities)

    )

    .sort((a,b)=>b[1]-a[1]);


    return {

        labels: entries.map(item=>item[0]),

        values: entries.map(item=>item[1])

    };

}



// =====================================================
// DESTRUIR
// =====================================================

function destroyChart(){

    if(state.chart){

        state.chart.destroy();

        state.chart = null;

    }

}



// =====================================================
// RENDER
// =====================================================

function renderChart(){

    const {

        labels,

        values

    } = buildChartData();


    destroyChart();


    state.chart = new Chart(

        chartCanvas,

        {

            type:"bar",

            data:{

                labels,

                datasets:[{

                    label:"Activitats",

                    data:values

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                animation:{

                    duration:800,

                    easing:"easeOutQuart"

                },

                layout:{

                    padding:20

                },

                plugins:{

                    legend:{

                        display:false

                    },

                    datalabels:{

                        anchor:"end",

                        align:"top",

                        color:"#111",

                        font:{

                            size:12,

                            weight:"bold"

                        }

                    }

                },

                scales:{

                    x:{

                        ticks:{

                            autoskip:false,

                            maxRotation:90,

                            minRotation:45,

                            color:"#111",

                            font:{

                                size:12

                            }

                        },

                        grid:{

                            display:false

                        }

                    },

                    y:{

                        beginAtZero:true,

                        ticks:{

                            precision:0,

                            color:"#111",

                            font:{

                                size:12

                            }

                        },

                        grid:{

                            color:"rgba(0,0,0,.08)"

                        }

                    }

                }

            }

        }

    );

}
