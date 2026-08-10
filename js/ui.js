// =====================================================
// INTERFÍCIE D'USUARI
// =====================================================


// -----------------------------------------------------
// Elements
// -----------------------------------------------------

const ui = {

    panel: document.getElementById("centerPanel"),

    activityList: document.getElementById("activityList"),

    centerSelect: document.getElementById("centerSelect"),

    selectDisplay: document.querySelector("#centerSelect .select-display"),

    selectOptions: document.querySelectorAll("#centerSelect .select-option"),

    btnMap: document.getElementById("viewMap"),

    btnChart: document.getElementById("viewChart"),

    map: document.getElementById("map"),

    chartContainer: document.getElementById("chartContainer")

};




// =====================================================
// SELECTOR DE CENTRES
// =====================================================

function initCenterSelector(){

    ui.selectOptions.forEach(option=>{

        const dot = document.createElement("span");

        dot.className = "color-dot";

        dot.style.background =

            getCenterColor(option.dataset.value);

        option.prepend(dot);

    });


    ui.selectDisplay.addEventListener("click",()=>{

        ui.centerSelect.classList.toggle("open");

    });


    ui.selectOptions.forEach(option=>{

        option.addEventListener("click",()=>{

            filters.center = option.dataset.value;

            updateCenterSelector();

            refreshUI();

        });

    });


    document.addEventListener("click",event=>{

        if(!ui.centerSelect.contains(event.target)){

            ui.centerSelect.classList.remove("open");

        }

    });

}




// =====================================================
// ACTUALITZAR SELECTOR
// =====================================================

function updateCenterSelector(){

    ui.centerSelect.classList.remove("open");


    if(filters.center==="all"){

        ui.selectDisplay.innerHTML = `

            <span
                class="color-dot"
                style="background:#666">
            </span>

            Tots els centres educatius

        `;

        return;

    }


    const color = getCenterColor(filters.center);

    ui.selectDisplay.innerHTML = `

        <span
            class="color-dot"
            style="background:${color}">
        </span>

        Centre educatiu: ${filters.center}

    `;

}




// =====================================================
// LLISTA D'ACTIVITATS
// =====================================================

function renderActivityList(){

    ui.activityList.innerHTML = "";


    const activities =

        sortActivitiesByDate(

            state.filteredActivities

        );


    activities.forEach(activity=>{

        const div = document.createElement("div");

        div.className = "activity-item";


        div.innerHTML = `

            <strong>

                ${activity.title}

            </strong>

            <span>

                ${activity.place}

            </span>

            <br>

            <span>

                ${activity.date}
                ·
                ${activity.center}

            </span>

        `;


        div.addEventListener("click",()=>{

            document

                .querySelectorAll(".activity-item.active")

                .forEach(item=>{

                    item.classList.remove("active");

                });


            div.classList.add("active");


            selectMarker(activity);

        });


        ui.activityList.appendChild(div);

    });

}




// =====================================================
// CANVI DE VISTA
// =====================================================

function initViewButtons(){

    ui.btnMap.addEventListener("click",showMap);

    ui.btnChart.addEventListener("click",showChart);

}




// =====================================================
// MOSTRAR MAPA
// =====================================================

function showMap(){

    ui.map.style.display = "block";

    ui.chartContainer.style.display = "none";


    ui.btnMap.classList.add("active");

    ui.btnChart.classList.remove("active");

}




// =====================================================
// MOSTRAR GRÀFIC
// =====================================================

function showChart(){

    ui.map.style.display = "none";

    ui.chartContainer.style.display = "block";


    ui.btnChart.classList.add("active");

    ui.btnMap.classList.remove("active");


    requestAnimationFrame(()=>{

        renderChart();

    });

}




// =====================================================
// COMPTADOR PER CENTRES
// =====================================================

function updateCenterCounts(){

    const counts =

        countBy(

            state.activities,

            "center"

        );


    document

        .querySelectorAll(".center-item")

        .forEach(item=>{

            const checkbox =

                item.querySelector("input");


            if(!checkbox) return;


            const count =

                item.querySelector(".center-count");


            if(count){

                count.textContent =

                    `(${counts[checkbox.value] || 0})`;

            }

        });

}




// =====================================================
// INICIALITZACIÓ
// =====================================================

function initUI(){

    initCenterSelector();

    initViewButtons();

    updateCenterSelector();

}
