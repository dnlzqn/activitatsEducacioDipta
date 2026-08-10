// =====================================================
// MAPA
// =====================================================


// -----------------------------------------------------
// Crear mapa
// -----------------------------------------------------

function createMap() {

    refs.map = L.map("map").setView(
        [41.1189, 1.2445],
        9
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    ).addTo(refs.map);

    refs.markerLayer = createMarkerLayer();

    refs.map.addLayer(refs.markerLayer);

    refs.heatLayer = L.heatLayer([], {
        radius: 25,
        blur: 20,
        maxZoom: 12
    });

}



// -----------------------------------------------------
// Cluster Layer
// -----------------------------------------------------

function createMarkerLayer() {

    return L.markerClusterGroup({

        iconCreateFunction(cluster) {

            const children = cluster.getAllChildMarkers();

            const counts = {};

            children.forEach(marker => {

                const center = marker.options.center;

                counts[center] = (counts[center] || 0) + 1;

            });

            let dominant = null;

            let max = 0;

            Object.entries(counts).forEach(([center, count]) => {

                if (count > max) {

                    dominant = center;

                    max = count;

                }

            });

            return L.divIcon({

                className: "custom-cluster",

                iconSize: [40, 40],

                html: `

                    <div
                        style="
                            background:${getCenterColor(dominant)};
                            width:40px;
                            height:40px;
                            border-radius:50%;
                            display:flex;
                            justify-content:center;
                            align-items:center;
                            color:white;
                            font-weight:bold;
                            border:3px solid white;
                        "
                    >

                        ${children.length}

                    </div>

                `

            });

        }

    });

}



// -----------------------------------------------------
// Icona normal
// -----------------------------------------------------

function createMarkerIcon(color){

    return L.divIcon({

        className:"custom-marker",

        iconSize:[20,20],

        iconAnchor:[10,10],

        html:`

            <div
                style="
                    background:${color};
                    width:20px;
                    height:20px;
                    border-radius:50%;
                    border:2px solid white;
                ">
            </div>

        `

    });

}



// -----------------------------------------------------
// Icona seleccionada
// -----------------------------------------------------

function createActiveMarkerIcon(color){

    return L.divIcon({

        className:"custom-marker",

        iconSize:[26,26],

        iconAnchor:[13,13],

        html:`

            <div
                style="
                    background:${color};
                    width:26px;
                    height:26px;
                    border-radius:50%;
                    border:3px solid black;
                ">
            </div>

        `

    });

}



// -----------------------------------------------------
// Crear marcadors
// -----------------------------------------------------

function buildMarkers(){

    refs.markerLayer.clearLayers();

    state.markers = [];

    const heatPoints = [];


    state.activities.forEach(activity=>{

        heatPoints.push([

            activity.lat,

            activity.lng,

            1

        ]);


        const marker = L.marker(

            [

                activity.lat,

                activity.lng

            ],

            {

                center:activity.center,

                icon:createMarkerIcon(

                    getCenterColor(activity.center)

                )

            }

        );


        marker.bindPopup(`

            <strong>${activity.title}</strong><br>

            Centre: ${activity.center}<br>

            Lloc: ${activity.place}<br>

            Data: ${activity.date}

        `);


        activity.marker = marker;

        state.markers.push(marker);

    });


    refs.heatLayer.setLatLngs(heatPoints);

}



// -----------------------------------------------------
// Mostrar marcadors visibles
// -----------------------------------------------------

function drawMarkers(){

    refs.markerLayer.clearLayers();

    state.filteredActivities.forEach(activity=>{

        refs.markerLayer.addLayer(activity.marker);

    });

}



// -----------------------------------------------------
// Seleccionar marcador
// -----------------------------------------------------

function selectMarker(activity){

    if(!activity.marker) return;


    refs.markerLayer.zoomToShowLayer(

        activity.marker,

        ()=>{

            if(state.activeMarker){

                state.activeMarker.setIcon(

                    createMarkerIcon(

                        getCenterColor(

                            state.activeMarker.options.center

                        )

                    )

                );

            }


            activity.marker.setIcon(

                createActiveMarkerIcon(

                    getCenterColor(activity.center)

                )

            );


            state.activeMarker = activity.marker;

            activity.marker.openPopup();

        }

    );

}
