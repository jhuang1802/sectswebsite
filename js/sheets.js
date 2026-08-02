const spreadsheetId = "1o4FElSUzqYD6oMlZTNl0ElN1JEDjK-hft6AZlIgD0Os"
const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv`;

async function loadShows() {
    const res = await fetch(url);

    const text = await res.text()
    const result = Papa.parse(text, { header: true });
    let shows = result.data;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureShows = shows.filter(e => new Date(e.Date + "T00:00:00") >= today);
    const pastShows = shows.filter(e => new Date(e.Date + "T00:00:00") < today);
    futureShows.sort((a, b) => new Date(a.Date + "T00:00:00") - new Date(b.Date + "T00:00:00"));
    pastShows.sort((a, b) => new Date(b.Date + "T00:00:00") - new Date(a.Date + "T00:00:00"));
    console.log(futureShows);
    console.log(pastShows);
    renderShows(futureShows, "future");
    renderShows(pastShows, "past");
}

function renderShows(shows, type) {
    if (type === "future") {
        const container = document.getElementById("shows");
        const groupedShows = groupByMonth(shows)

        Object.keys(groupedShows).forEach(month => {
            // Month header
            const monthP = document.createElement("p");
            monthP.classList.add("centered-div", "fit", "bold");
            monthP.textContent = month;
            container.appendChild(monthP);


            // Events in that month
            const showP = document.createElement("p");
            showP.classList.add("dates");
            const renderedTours = new Set();
            let listingTour = false;


            // Render tour headings
            let html = "";
            groupedShows[month].forEach(show => {
                if (show.Tour) {
                    if (!renderedTours.has(show.Tour)) {
                        if (html) {
                            html += "<br>"
                        }
                        html += `<u class="underlinebold">${show.Tour}</u>`
                        renderedTours.add(show.Tour);
                        listingTour = true
                    }
                } else {
                    if (listingTour) {
                        html += `<br>`
                        listingTour = false
                    }
                }
                
                // Render shows
                const date = new Date(show.Date + "T00:00:00");
                const day = date.getDate();
                const justMonth = date.toLocaleString("default", { month: "long" });

                html += `${justMonth} ${day} - ${show.City} @ ${show.Venue}`;
                if (show.Event) {
                    html += ` (${show.Event})`
                }
                html += `<br>`
            });

            showP.innerHTML = html;
            showP.classList.add("event-list");

            container.appendChild(showP);
        });
    }

    if (type == "past") {
        const container = document.getElementById("shows");

        const past = document.createElement("h2");
        past.classList.add("centered-div", "fit");
        past.textContent = "Past Shows";
        container.appendChild(past);


        // Events in that month
        const showP = document.createElement("p");
        showP.classList.add("dates");
        const renderedTours = new Set();
        let listingTour = false;


        // Render tour headings
        let html = "";
        shows.forEach(show => {
            if (show.Tour) {
                if (!renderedTours.has(show.Tour)) {
                    if (html) {
                        html += "<br>"
                    }
                    html += `<u class="underlinebold">${show.Tour}</u>`
                    renderedTours.add(show.Tour);
                    listingTour = true
                }
            } else {
                if (listingTour) {
                    html += `<br>`
                    listingTour = false
                }
            }
            
            // Render shows
            const date = new Date(show.Date + "T00:00:00");
            const day = date.getDate();
            const justMonth = date.toLocaleString("default", { month: "long" });
            const year = date.getFullYear();

            if (show.Audio || show.Video) {
                html += `<span>`
            }

            html += `${justMonth} ${day} ${year} - ${show.City} @ ${show.Venue}`;

            if (show.Event) {
                html += ` (${show.Event})`
            }
            
            if (show.Audio || show.Video) {
            
                if (show.Audio) {
                    html += ` <a href=${show.Audio} target="_blank" rel="noopener noreferrer">(link to audio)</a>`
                }
                if (show.Video) {
                    html += ` <a href=${show.Video} target="_blank" rel="noopener noreferrer">(link to video)</a>`
                }
                html += `</span>`
            }
            if (!(show.Audio || show.Video)) {
                html += `<br>`
            }
        });

        showP.innerHTML = html;
        showP.classList.add("event-list");

        container.appendChild(showP);
        

    }
}

function groupByMonth(shows) {
  const grouped = {};

  shows.forEach(show => {
    
    const date = new Date(show.Date + "T00:00:00");
    console.log(date)

    const monthName = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const key = `${monthName} ${year}`;

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(show);
  });

  return grouped;
}

loadShows();