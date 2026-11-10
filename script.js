const showSelect = document.getElementById("show-select");
const showDetails = document.getElementById("show-details");
const message = document.getElementById("message");

function showMessage(text) {
  message.textContent = text;
}

function clearMessage() {
  message.textContent = "";
}

async function loadShows() {
  const url = "https://api.tvmaze.com/shows?page=0";

  clearMessage();
  showMessage("Loading shows...");

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not load shows (status ${res.status}).`);
    }

    const shows = await res.json();

    const topShows = shows
      .sort((a, b) => (b.rating.average || 0) - (a.rating.average || 0))
      .slice(0, 25);

    clearMessage();
    fillDropdown(topShows);
  } catch (error) {
    console.error(error);
    showMessage(error.message);
  }
}

function fillDropdown(shows) {
  showSelect.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select a show";
  showSelect.appendChild(placeholder);

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelect.appendChild(option);
  });
}

async function loadShowDetails(id) {
  const url = `https://api.tvmaze.com/shows/${id}`;

  clearMessage();
  showDetails.innerHTML = "";
  showMessage("Loading show details...");

  try {
    const res = await fetch(url);

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("That show could not be found.");
      }
      throw new Error(`Could not load show details (status ${res.status}).`);
    }

    const show = await res.json();

    clearMessage();
    displayDetails(show);
  } catch (error) {
    console.error(error);
    showMessage(error.message);
  }
}

function displayDetails(show) {
  showDetails.innerHTML = "";

  const heading = document.createElement("h2");
  heading.textContent = show.name;
  showDetails.appendChild(heading);

  if (show.image) {
    const poster = document.createElement("img");
    poster.src = show.image.medium;
    poster.alt = `Poster for ${show.name}`;
    showDetails.appendChild(poster);
  } else {
    const noPoster = document.createElement("p");
    noPoster.textContent = "No poster available";
    showDetails.appendChild(noPoster);
  }

  const summary = document.createElement("div");
  if (show.summary) {
    summary.innerHTML = show.summary;
  } else {
    summary.textContent = "No summary available";
  }
  showDetails.appendChild(summary);

  const genres = show.genres.join(", ") || "Not listed";
  const premiered = show.premiered || "Unknown";
  const status = show.status || "Unknown";
  const rating = show.rating.average || "Not rated";

  const info = document.createElement("p");
  info.textContent = `Genres: ${genres} | Premiered: ${premiered} | Status: ${status} | Rating: ${rating}`;
  showDetails.appendChild(info);
}

showSelect.addEventListener("change", function () {
  const id = showSelect.value;

  if (id === "") {
    return;
  }

  loadShowDetails(id);
});

loadShows();