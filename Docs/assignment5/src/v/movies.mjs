/**
 * @fileOverview  View code of UI for managing Movie data
 * @author Gerd Wagner
 */
/***************************************************************
 Import classes, datatypes and utility procedures
 ***************************************************************/
import Person from "../m/Person.mjs";
import Movie from "../m/Movie.mjs";

/***************************************************************
 Load data
 ***************************************************************/
Person.retrieveAll();
Movie.retrieveAll();

/***************************************************************
 Set up general, use-case-independent UI elements
 ***************************************************************/
// set up back-to-menu buttons for all CRUD UIs
for (const btn of document.querySelectorAll("button.back-to-menu")) {
  btn.addEventListener("click", refreshManageDataUI);
}
// neutralize the submit event for all CRUD UIs
for (const frm of document.querySelectorAll("section > form")) {
  frm.addEventListener("submit", function (e) {
    e.preventDefault();
    frm.reset();
  });
}
// save data when leaving the page
window.addEventListener("beforeunload", Movie.saveAll);
/**********************************************
  Use case Create Movie
 **********************************************/
  const createFormEl = document.querySelector("section#Movie-C > form");
document.getElementById("Create").addEventListener("click", function () {
document.getElementById("Movie-M").style.display = "none";
document.getElementById("Movie-C").style.display = "block";
createFormEl.reset();
});
// set up event handlers for responsive constraint validation
createFormEl.movieId.addEventListener("input", function () {
createFormEl.movieId.setCustomValidity(
  Movie.checkMovieIdAsId( createFormEl["movieId"].value).message);
});
createFormEl.title.addEventListener("input", function () {
createFormEl.title.setCustomValidity(
  Movie.checkMovieIdAsId( createFormEl["titel"].value).message);
});
createFormEl.releaseDate.addEventListener("input", function () {
createFormEl.releaseDate.setCustomValidity(
  Movie.checkMovieIdAsId( createFormEl["releaseDate"].value).message);
});
createFormEl.director.addEventListener("input", function () {
    createFormEl.director.setCustomValidity(
      Movie.checkDirector( createFormEl["director"].value).message);
    });
createFormEl.actor.addEventListener("input", function () {
createFormEl.actor.setCustomValidity(
  Movie.checkMovieIdAsId( createFormEl["actor"].value).message);
});

// handle Save button click events
createFormEl["commit"].addEventListener("click", function () {
const slots = {
movieId: createFormEl["movieId"].value,
title: createFormEl["title"].value,
releaseDate: createFormEl["releaseDate"].value,
directorIdRefs: createFormEl["director"].value,
actor_id: createFormEl["actor"].value
};

createFormEl.movieId.setCustomValidity(
  Movie.checkMovieIdAsId( slots.movieId).message);
createFormEl.title.setCustomValidity(
  Movie.checkTitle( slots.titel).message);
createFormEl.releaseDate.setCustomValidity(
  Movie.checkReleaseDate( slots.releaseDate).message);
createFormEl.director.setCustomValidity(
  Movie.checkDirector( slots.director).message);
createFormEl.actor.setCustomValidity(
    Movie.checkDirector( slots.actor).message);
// save the input data only if all form fields are valid
if (createFormEl.checkValidity()) {
Movie.add( slots);
}
});

/**********************************************
* Use case Update Movie
**********************************************/
const updateFormEl = document.querySelector("section#Movie-U > form"),
  updSelMovieEl = updateFormEl["selectMovie"];
document.getElementById("Update").addEventListener("click", function () {
// reset selection list (drop its previous contents)
updSelMovieEl.innerHTML = "";
// populate the selection list
fillSelectWithOptions( updSelMovieEl, Movie.instances,
  "movieId", {displayProp: "title"});
document.getElementById("Movie-M").style.display = "none";
document.getElementById("Movie-U").style.display = "block";
updateFormEl.reset();
});
/**
* handle movie selection events: when a movie is selected,
* populate the form with the data of the selected movie
*/
updSelMovieEl.addEventListener("change", function () {
const saveButton = updateFormEl["commit"],
movieId = updateFormEl["selectMovie"].value;
if (movieId) {
const movie = Movie.instances[movieId];
updateFormEl["movieId"].value = movie.movieId;
updateFormEl["title"].value = movie.title;
updateFormEl["releaseDate"].value = movie.releaseDate;
updateFormEl["director"].value = movie.director;
updateFormEl["actor"].value = movie.aactor;

// check all input fields and show error messages
createFormEl.movieId.setCustomValidity(
    Movie.checkMovieIdAsId( slots.movieId).message);
createFormEl.titel.setCustomValidity(
    Movie.checkTitle( slots.titel).message);
createFormEl.releaseDate.setCustomValidity(
    Movie.checkReleaseDate( slots.releaseDate).message);
createFormEl.director.setCustomValidity(
    Movie.checkDirector( slots.director).message);
createFormEl.actor.setCustomValidity(
    Movie.checkActor( slots.actor).message);
// save the input data only if all form fields are valid
if (createFormEl.checkValidity()) {
  Movie.add( slots);
}
};
});
/**********************************************
 * Use case Delete Movie
**********************************************/
const deleteFormEl = document.querySelector("section#Movie-D > form");
const delSelMovieEl = deleteFormEl["selectMovie"];
document.getElementById("Delete").addEventListener("click", function () {
  // reset selection list (drop its previous contents)
  delSelMovieEl.innerHTML = "";
  // populate the selection list
  fillSelectWithOptions( delSelMovieEl, Movie.instances,
      "movieId", {displayProp: "title"});
  document.getElementById("Movie-M").style.display = "none";
  document.getElementById("Movie-D").style.display = "block";
  deleteFormEl.reset();
});
// handle Delete button click events
deleteFormEl["commit"].addEventListener("click", function () {
  const movieIdRef = delSelMovieEl.value;
  if (!movieIdRef) return;
  if (confirm("Do you really want to delete this Movie?")) {
    Movie.destroy( movieIdRef);
    // remove deleted movie from select options
    delSelMovieEl.remove( delSelMovieEl.selectedIndex);
  }
});
/**********************************************
 Use case Retrieve/List All Movies
 **********************************************/
document.getElementById("RetrieveAndListAll")
    .addEventListener("click", function () {
  document.getElementById("Movie-M").style.display = "none";
  document.getElementById("Movie-R").style.display = "block";
  const tableBodyEl = document.querySelector("section#Movie-R>table>tbody");
  tableBodyEl.innerHTML = "";  // drop old content
  for (const key of Object.keys( Movie.instances)) {
    const movie = Movie.instances[key];
    // create list of actors for this movie
    const authListEl = createListFromMap( movie.actors, "name");
    const row = tableBodyEl.insertRow();
    row.insertCell().textContent = movie.movieId;
    row.insertCell().textContent = movie.title;
    row.insertCell().textContent = movie.releaseDate;
    row.insertCell().textContent = movie.director;
    row.insertCell().textContent = movie.actor;
  }
});

/**********************************************
 * Refresh the Manage Movies Data UI
 **********************************************/
function refreshManageDataUI() {
  // show the manage movie UI and hide the other UIs
  document.getElementById("Movie-M").style.display = "block";
  document.getElementById("Movie-C").style.display = "none";
  document.getElementById("Movie-U").style.display = "none";
  document.getElementById("Movie-D").style.display = "none";
  document.getElementById("Movie-R").style.display = "none";
}

// Set up Manage Movies UI
refreshManageDataUI();
