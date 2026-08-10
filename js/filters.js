// =====================================================
// FILTRES
// =====================================================


// -----------------------------------------------------
// Aplica tots els filtres
// -----------------------------------------------------

function applyFilters() {

    state.filteredActivities = state.activities.filter(activity => {

        // -----------------------------
        // Centre
        // -----------------------------

        if (

            filters.center !== "all" &&

            activity.center !== filters.center

        ) {

            return false;

        }


        // -----------------------------
        // Cerca (iteració 2)
        // -----------------------------

        if (filters.search) {

            const haystack = normalizeText(

    [

        activity.title,

        activity.place,

        activity.poblacio,

        activity.center

    ].join(" ")

);

const search = normalizeText(filters.search);


            if (!haystack.includes(search)) {

                return false;

            }

        }


        // -----------------------------
        // Any (iteració 3)
        // -----------------------------

        if (filters.year) {

            const year = parseDate(activity.date).getFullYear();

            if (year !== filters.year) {

                return false;

            }

        }


        // -----------------------------
        // Mes (iteració 3)
        // -----------------------------

        if (filters.month !== null) {

            const month = parseDate(activity.date).getMonth();

            if (month !== filters.month) {

                return false;

            }

        }


        return true;

    });

}



// =====================================================
// REFRESH GENERAL
// =====================================================

function refreshUI() {

    applyFilters();


    // -----------------------------
    // Mapa
    // -----------------------------

    drawMarkers();


    // -----------------------------
    // Llista
    // -----------------------------

    renderActivityList();


    // -----------------------------
    // Gràfic
    // -----------------------------

    if (

        ui.chartContainer.style.display !== "none"

    ) {

        renderChart();

    }

}



// =====================================================
// RESETEJAR FILTRES
// =====================================================

function resetFilters() {

    filters.center = "all";

    filters.search = "";

    filters.year = null;

    filters.month = null;

}



// =====================================================
// NOMBRE D'ACTIVITATS VISIBLES
// =====================================================

function getVisibleCount() {

    return state.filteredActivities.length;

}



// =====================================================
// HI HA FILTRES ACTIUS?
// =====================================================

function hasActiveFilters() {

    return (

        filters.center !== "all" ||

        filters.search !== "" ||

        filters.year !== null ||

        filters.month !== null

    );

}
