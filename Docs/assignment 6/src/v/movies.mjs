/**
 * @fileOverview  View code of UI for managing Movie data
 * @author Gerd Wagner
 */
/***************************************************************
 Import classes, datatypes and utility procedures
 ***************************************************************/
import Person from "../m/Person.mjs";
import Movie, {MovieCategoryEL} from "../m/Movie.mjs";
import { displaySegmentFields, undisplayAllSegmentFields } from "./application.mjs"
import { fillSelectWithOptions} from "../../lib/useful.mjs";

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
    if (movie.category) {
      switch (movie.category) {
      case MovieCategoryEL.TVSERIESEPISODE:
        row.insertCell().textContent = movie.tvSeriesName + " tvSeriesName";
        row.insertCell().textContent = movie.episode + " episode";
        break;
      case MovieCategoryEL.BIOGRAPHY:
        row.insertCell().textContent = "Biography about " + movie.about;
        break;
      }
    }
  }
  document.getElementById("Movie-M").style.display = "none";
  document.getElementById("Movie-R").style.display = "block";
});
/**********************************************
  Use case Create Movie
 **********************************************/
  const createFormEl = document.querySelector("section#Movie-C > form");
        createCategorySelectEl = createFormEl.category;
document.getElementById("Create").addEventListener("click", function () {
document.getElementById("Movie-M").style.display = "none";
document.getElementById("Movie-C").style.display = "block";
undisplayAllSegmentFields( createFormEl, BookCategoryEL.labels);
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
createFormEl.about.addEventListener("input", function () {
createFormEl.about.setCustomValidity(
Movie.checkAbout( createFormEl.about.value,
  parseInt( createFormEl.category.value) + 1).message);
});

fillSelectWithOptions( createCategorySelectEl, MovieCategoryEL.labels);
createCategorySelectEl.addEventListener("change", handleCategorySelectChangeEvent);

// handle Save button click events
createFormEl["commit"].addEventListener("click", function () {
const slots = {
movieId: createFormEl["movieId"].value,
title: createFormEl["title"].value,
releaseDate: createFormEl["releaseDate"].value,
director: createFormEl.selectDirector.value,
actor: [],
};
if (categoryStr) {
  // enum literal indexes start with 1
  slots.category = parseInt( categoryStr) + 1;
  switch (slots.category) {
  case MovieCategoryEL.TVSERIESEPISODE:
    slots.tvSeriesName = createFormEl.tvSeriesName.value;
    slots.episode = createFormEl.episode.value;
    createFormEl.tvSeriesName.setCustomValidity(
      createFormEl.tvSeriesName.value, slots.category).message;
    createFormEl.episode.setCustomValidity(
      createFormEl.episode.value, slots.category).message;
      break;
  case BookCategoryEL.BIOGRAPHY:
    slots.about = createFormEl.about.value;
    createFormEl.about.setCustomValidity(
      Book.checkAbout( createFormEl.about.value, slots.category).message);
    break;
  }
}

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
    Movie.add(slots);
    undisplayAllSegmentFields( createFormEl, MovieCategoryEL.labels);
  }
});

/**********************************************
* Use case Update Movie
**********************************************/
const updateFormEl = document.querySelector("section#Movie-U > form"),
  updSelMovieEl = updateFormEl["selectMovie"],
  updateSelectCategoryEl = updateFormEl["category"];
undisplayAllSegmentFields( updateFormEl, MovieCategoryEL.labels);
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
updSelMovieEl.addEventListener("change", handleMovieSelectChangeEvent);
// set up the movie category selection list
fillSelectWithOptions( updateSelectCategoryEl, MovieCategoryEL.labels);
updateSelectCategoryEl.addEventListener("change", handleCategorySelectChangeEvent);

updateFormEl.movieId.addEventListener("input", function () {
  updateFormEl.movieId.setCustomValidity(
      Movie.checkMovieIdAsId( updateFormEl.movieId.value).message);
});
updateFormEl.titel.addEventListener("input", function () {
  updateFormEl.titel.setCustomValidity(
      Movie.checkTitle( updateFormEl.titel.value).message);
});
updateFormEl.releaseDate.addEventListener("input", function () {
  updateFormEl.releaseDate.setCustomValidity(
      Movie.checkTitle( updateFormEl.releaseDate.value).message);
});
updateFormEl.tvSeriesName.addEventListener("input", function () {
  updateFormEl.tvSeriesName.setCustomValidity(
      Movie.checkTvSeriesName( updateFormEl.tvSeriesName.value,
          parseInt( updateFormEl.category.value) + 1).message);
});
updateFormEl.about.addEventListener("input", function () {
  updateFormEl.about.setCustomValidity(
      Book.checkAbout( updateFormEl.about.value,
          parseInt( updateFormEl.category.value) + 1).message);
});
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
  if (categoryStr) {
    // enum literal indexes start with 1
    slots.category = parseInt( categoryStr) + 1;
    switch (slots.category) {
    case MovieCategoryEL.TVSERIESEPISODE:
      slots.tvSeriesName = updateFormEl.tvSeriesName.value;
      slots.episode = updateFormEl.episode.value;
      updateFormEl.tvSeriesName.setCustomValidity(
        updateFormEl.tvSeriesName.value, slots.category).message;
        updateFormEl.episode.setCustomValidity(
          updateFormEl.episode.value, slots.category).message;
        break;
    case MovieCategoryEL.BIOGRAPHY:
      slots.about = updateFormEl.about.value;
      updateFormEl.about.setCustomValidity(
        Movie.checkAbout( createFormEl.about.value, slots.category).message);
      break;
    }
}
// check all input fields and show error messages
updateFormEl.movieId.setCustomValidity(
    Movie.checkMovieId( slots.movieId).message);
updateFormEl.titel.setCustomValidity(
    Movie.checkTitle( slots.titel).message);
updateFormEl.releaseDate.setCustomValidity(
    Movie.checkReleaseDate( slots.releaseDate).message);
  if (updSelMovieEl.checkValidity()) {
  Movie.update( slots);
  undisplayAllSegmentFields( updateFormEl, MovieCategoryEL.labels);
  // update the mocie selection list's option element
  updateSelectMovieEl.options[updateSelectMovieEl.selectedIndex].text = slots.title;
  selectActorsWidget.innerHTML = "";
  }
});
/**
 * handle movie selection events
 * when a movie is selected, populate the form with the data of the selected book
 */
function handleMovieSelectChangeEvent () {
  const movieId = updateFormEl.selectMovie.value;
  if (movieId) {
    const movie = Movie.instances[movieId];
    updateFormEl.movieId.value = movie.movieId;
    updateFormEl.titel.value = movie.titel;
    updateFormEl.releaseDate.value = movie.releaseDate;
    if (movie.category) {
      updateFormEl.category.selectedIndex = movie.category;
      // disable category selection (category is frozen)
      updateFormEl.category.disabled = "disabled";
      // show category-dependent fields
      displaySegmentFields( updateFormEl, MovieCategoryEL.labels, movie.category);
      switch (movie.category) {
      case MovieCategoryEL.TVSERIESEPISODE:
        updateFormEl.tvSeriesName.value = movie.tvSeriesName;
        updateFormEl.episode.value = movie.episode;
        break;
      case MovieCategoryEL.BIOGRAPHY:
        updateFormEl.about.value = movie.about;
        break;
      }
} else {  
  updateFormEl.category.value = "";
  updateFormEl.category.disabled = "";   // enable category selection
  updateFormEl.tvSeriesName.value = "";
  updateFormEl.episode.value = "";
  updateFormEl.about.value = "";
  undisplayAllSegmentFields( updateFormEl, MovieCategoryEL.labels);
}
} else {
updateFormEl.reset();
}
}

/**********************************************
 * Use case Delete Movie
**********************************************/
const deleteFormEl = document.querySelector("section#Movie-D > form");
const delSelMovieEl = deleteFormEl.selectMovie;
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
  if (confirm("Do you really want to delete this movie?")) {
    Movie.destroy( movieIdRef);
    // remove deleted movie from select options
    delSelMovieEl.remove( delSelMovieEl.selectedIndex);
  }
});

/**********************************************
 * Refresh the Manage Movies Data UI
 **********************************************/

function refreshManageDataUI() {
  // show the manage movie UI and hide the other UIs
  document.getElementById("Movie-M").style.display = "block";
  document.getElementById("Movie-R").style.display = "none";
  document.getElementById("Movie-C").style.display = "none";
  document.getElementById("Movie-U").style.display = "none";
  document.getElementById("Movie-D").style.display = "none";
}

/**
 * event handler for movie category selection events
 * used both in create and update
 */
function handleCategorySelectChangeEvent (e) {
  const formEl = e.currentTarget.form,
        // the array index of MovieCategoryEL.labels
        categoryIndexStr = formEl.category.value;
  if (categoryIndexStr) {
    displaySegmentFields( formEl, MovieCategoryEL.labels,
        parseInt( categoryIndexStr) + 1);
  } else {
    undisplayAllSegmentFields( formEl, MovieCategoryEL.labels);
  }
}

// Set up Manage Movies UI
refreshManageDataUI();