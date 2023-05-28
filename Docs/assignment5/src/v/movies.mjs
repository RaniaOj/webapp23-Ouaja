/**
 * @fileOverview  View code of UI for managing Movie data
 * @author Gerd Wagner
 */
/***************************************************************
 Import classes, datatypes and utility procedures
 ***************************************************************/
import Person from "../m/Person.mjs";
import Movie from "../m/Movie.mjs";
import { fillSelectWithOptions, createListFromMap, createMultipleChoiceWidget }
    from "../../lib/useful.mjs";

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
window.addEventListener("beforeunload", function () {
  Movie.saveAll();
});
/**********************************************
 Use case Retrieve/List All Movies
 **********************************************/
document.getElementById("retrieveAndListAllMovies")
    .addEventListener("click", function () {
  const tableBodyEl = document.querySelector("section#Movie-R > table > tbody");
  tableBodyEl.innerHTML = "";  // drop old content
  for (const key of Object.keys( Movie.instances)) {
    const movie = Movie.instances[key];
    // create list of actors for this movie
    const actorListEl = createListFromMap( movie.actors, "name");
    const row = tableBodyEl.insertRow();
    row.insertCell().textContent = movie.movieId;
    row.insertCell().textContent = movie.title;
    row.insertCell().textContent = movie.releaseDate;
    row.insertCell().textContent = movie.director;
    row.insertCell().appendChild(actorListEl);
  }
  document.getElementById("Movie-M").style.display = "none";
  document.getElementById("Movie-R").style.display = "block";
});
/**********************************************
  Use case Create Movie
 **********************************************/
  const createFormEl = document.querySelector("section#Movie-C > form");
      selectDirectorEl = createFormEl.selectPersonAsDirector,
      selectActorsEl = createFormEl.selectPersonAsActor;
document.getElementById("Create").addEventListener("click", function () {
  // set up a single selection list for selecting a director
  fillSelectWithOptions( selectDirectorEl, Person.instances, "personId");
  // set up a multiple selection list for selecting actors
  fillSelectWithOptions( selectActorsEl, Person.instances,
      "personId", {displayProp: "name"});
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
  Movie.checkTitle( createFormEl["titel"].value).message);
});
createFormEl.releaseDate.addEventListener("input", function () {
createFormEl.releaseDate.setCustomValidity(
  Movie.checkReleaseDate( createFormEl["releaseDate"].value).message);
});


// handle Save button click events
createFormEl["commit"].addEventListener("click", function () {
const slots = {
movieId: createFormEl["movieId"].value,
title: createFormEl["title"].value,
releaseDate: createFormEl["releaseDate"].value,
director: createFormEl.selectDirector.value,
actor: [],
};

createFormEl.movieId.setCustomValidity(
  Movie.checkMovieIdAsId( slots.movieId).message);
createFormEl.title.setCustomValidity(
  Movie.checkTitle( slots.titel).message);
createFormEl.releaseDate.setCustomValidity(
  Movie.checkReleaseDate( slots.releaseDate).message);
// save the input data only if all form fields are valid
const selDirecOptions = createFormEl.selectDirector.selectedOptions;
  // check the mandatory value constraint for director
  createFormEl.selectDirector.setCustomValidity(
    (selDirecOptions.length > 0) ? "" : "No director selected!"
  );
  // save the input data only if all form fields are valid
  if (createFormEl.checkValidity()) {
    // construct a list of director
    for (const opt of selDirecOptions) {
      slots.director.push(opt.value);
    }
    Movie.add(slots);
  }
});

/**********************************************
* Use case Update Movie
**********************************************/
const updateFormEl = document.querySelector("section#Movie-U > form"),
  updSelMovieEl = updateFormEl.selectMovie;
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
function handleMovieSelectChangeEvent () {
  const saveButton = updateFormEl.commit,
selectDirectorEl = updateFormEl.selectDirector,
selectActorsWidget = updateFormEl.querySelector(".MultiChoiceWidget"),
movieId = updateFormEl.selectMovie.value;
if (movieId !== "") {
const movie = Movie.instances[movieId];
updateFormEl["movieId"].value = movie.movieId;
updateFormEl["title"].value = movie.title;
updateFormEl["releaseDate"].value = movie.releaseDate;
updateFormEl["director"].value = movie.director;
updateFormEl["actor"].value = movie.actor;
    // set up the associated director selection list
    fillSelectWithOptions( selectDirectorEl, Person.instances, "name");
    // set up the associated actors selection widget
    createMultipleChoiceWidget( selectActorsWidget, movie.actors,
        Person.instances, "personId", "name", 1);  // minCard=1
    // assign associated actor as the selected option to select element
    if (movie.actor) updateFormEl.selectActor.value = movie.actor.name;
    saveButton.disabled = false;
  } else {
    updateFormEl.reset();
    updateFormEl.selectDirector.selectedIndex = 0;
    selectActorsWidget.innerHTML = "";
    saveButton.disabled = true;
  }
}
// handle Save button click events
updateFormEl["commit"].addEventListener("click", function () {
  const movieIdRef = updateSelectMovieEl.value,
    selectDirectorEl = updateFormEl.selectDirector;
  if (!movieIdRef) return;
  const slots = {
    movieId: updateFormEl.movieId.value,
    title: updateFormEl.title.value,
    releaseDate: updateFormEl.releaseDate.value,
    director: updateFormEl.selectDirector.value
  }
// check all input fields and show error messages
createFormEl.movieId.setCustomValidity(
    Movie.checkMovieIdAsId( slots.movieId).message);
createFormEl.titel.setCustomValidity(
    Movie.checkTitle( slots.titel).message);
createFormEl.releaseDate.setCustomValidity(
    Movie.checkReleaseDate( slots.releaseDate).message);
if (updateFormEl.checkValidity()) {
    // construct director-ToAdd/ToRemove lists from the association list
    let directorToAdd = [], directorToRemove = [];
    for (const mcListItemEl of selectDirectorEl.children) {
      if (mcListItemEl.classList.contains("removed")) {
        directorToRemove.push(mcListItemEl.getAttribute("data-value"));
      }
      if (mcListItemEl.classList.contains("added")) {
        ToAdd.push(mcListItemEl.getAttribute("data-value"));
      }
    }
    // if the add/remove list is non-empty create a corresponding slot
    if (directorToRemove.length > 0) {
      slots.directorToRemove = directorToRemove;
    }
    if (directorToAdd.length > 0) {
      slots.directorToAdd = directorToAdd;
    }
  }
  Movie.update( slots);
  // update the mocie selection list's option element
  updateSelectMovieEl.options[updateSelectMovieEl.selectedIndex].text = slots.title;
  selectActorsWidget.innerHTML = "";
});
/**********************************************
 * Use case Delete Movie
**********************************************/
const deleteFormEl = document.querySelector("section#Movie-D > form");
const delSelMovieEl = deleteFormEl.selectMovie;
document.getElementById("Delete").addEventListener("click", function () {
  document.getElementById("Movie-M").style.display = "none";
  document.getElementById("Movie-D").style.display = "block";
  // reset selection list (drop its previous contents)
  delSelMovieEl.innerHTML = "";
  // populate the selection list
  fillSelectWithOptions( delSelMovieEl, Movie.instances,
      "movieId", {displayProp: "title"});
  deleteFormEl.reset();
});
// handle Delete button click events
deleteFormEl["commit"].addEventListener("click", function () {
  const movieIdRef = delSelMovieEl.value;
  if (!movieIdRef) return;
  if (confirm("Do you really want to delete this movie?")) {
    Movie.destroy( movieIdRef);
    // remove deleted movie from select options
    delSelMovieEl.remove( delSelMovieEl.selectedIndex);
  }
});

/**********************************************
 * Refresh the Manage Movies Data UI
 **********************************************/
refreshManageDataUI();
function refreshManageDataUI() {
  // show the manage movie UI and hide the other UIs
  document.getElementById("Movie-M").style.display = "block";
  document.getElementById("Movie-R").style.display = "none";
  document.getElementById("Movie-C").style.display = "none";
  document.getElementById("Movie-U").style.display = "none";
  document.getElementById("Movie-D").style.display = "none";
}

// Set up Manage Movies UI

