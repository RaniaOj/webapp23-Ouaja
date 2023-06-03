/**
 * @author Gerd Wagner
 * @copyright Copyright 2013-2021 Gerd Wagner, Chair of Internet Technology, Brandenburg University of Technology, Germany.
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is",
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */
/***************************************************************
 Import classes, datatypes and utility procedures
 ***************************************************************/
import TvSeriesEpisode from "../m/TvSeriesEpisode.mjs";
import Movie from "../m/Movie.mjs";
import { displaySegmentFields, undisplayAllSegmentFields } from "../c/application.mjs"
/***************************************************************
 Load data
 ***************************************************************/
TvSeriesEpisode.retrieveAll();

/***************************************************************
 Set up general, use-case-independent UI elements
 ***************************************************************/
// set up back-to-menu buttons for all use cases
for (const btn of document.querySelectorAll("button.back-to-menu")) {
  btn.addEventListener('click', refreshManageDataUI);
}
// neutralize the submit event for all use cases
for (const frm of document.querySelectorAll("section > form")) {
  frm.addEventListener("submit", function (e) {
    e.preventDefault();
    frm.reset();
  });
}
// save data when leaving the page
window.addEventListener("beforeunload", function () {
  TvSeriesEpisode.saveAll();
});
/**********************************************
 * Use case List TvSeriesEpisodes
**********************************************/
document.getElementById("RetrieveAndListAll").addEventListener("click", function () {
  const tableBodyEl = document.querySelector("section#TvSeriesEpisode-R>table>tbody");
  // reset view table (drop its previous contents)
  tableBodyEl.innerHTML = "";
  // populate view table
  for (const key of Object.keys( TvSeriesEpisode.instances)) {
    const tvSerieEpisode = TvSeriesEpisode.instances[key];
    const row = tableBodyEl.insertRow();
    row.insertCell().textContent = tvSerieEpisode.movieId;
    row.insertCell().textContent = tvSerieEpisode.tvSeriesName;
    row.insertCell().textContent = tvSerieEpisode.episodeNo;
  }
  document.getElementById("TvSeriesEpisode-M").style.display = "none";
  document.getElementById("TvSeriesEpisode-R").style.display = "block";
});

/**********************************************
 * Use case Create TvSeriesEpisode
**********************************************/
const createFormEl = document.querySelector("section#TvSeriesEpisode-C > form");
//----- set up event handler for menu item "Create" -----------
document.getElementById("Create").addEventListener("click", function () {
  document.getElementById("TvSeriesEpisode-M").style.display = "none";
  document.getElementById("TvSeriesEpisode-C").style.display = "block";
  createFormEl.reset();
});
// set up event handlers for responsive constraint break
createFormEl.movieId.addEventListener("input", function () {
  createFormEl.movieId.setCustomValidity(
    Movie.checkMovieIdAsId( createFormEl.movieId.value, TvSeriesEpisode).message);
});
createFormEl.tvSeriesName.addEventListener("input", function () {
  createFormEl.tvSeriesName.setCustomValidity(
    TvSeriesEpisode.checkTvSeriesName( createFormEl.tvSeriesName.value, TvSeriesEpisode).message);
});
createFormEl.episodeNo.addEventListener("input", function () {
  createFormEl.episodeNo.setCustomValidity(
    TvSeriesEpisode.checkEpisodeNo( createFormEl.episodeNo.value, TvSeriesEpisode).message);
});

// handle Save button click events
createFormEl["commit"].addEventListener("click", function () {
  const slots = {
    movieId: createFormEl.movieId.value,
    tvSerieEpisode: createFormEl.tvSerieEpisode.value,
    episodeNo: createFormEl.episodeNo.value
  };
  // check all input fields and show error messages
  createFormEl.movieId.setCustomValidity(
    Movie.checkMovieIdAsId( slots.movieId).message, TvSeriesEpisode);
  createFormEl.tvSeriesName.setCustomValidity(
    TvSeriesEpisode.checkTvSeriesName( slots.tvSeriesName).message);
  createFormEl.episodeNo.setCustomValidity(
    TvSeriesEpisode.checkEpisodeNo( slots.episodeNo).message);
  // save the input data only if all form fields are valid
  if (createFormEl.checkValidity()) TvSeriesEpisode.add( slots);
});
// define event listener for pre-filling superclass attributes
createFormEl.movieId.addEventListener("change", function () {
  const movId = createFormEl.movieId.value;
  if (movId in Movie.instances) {
    createFormEl.titel.value = Movie.instances[movId].titel;
    // set focus to next field
    createFormEl.tvSeriesName.focus();
  }
});
/**********************************************
* Use case Update TvSeriesEpisode
**********************************************/
const updateFormEl = document.querySelector("section#TvSeriesEpisode-U > form"),
     updSelTvSeriesEpEl = updateFormEl.selectTvSeriesEpisode;
//----- set up event handler for menu item "Update" -----------
document.getElementById("Update").addEventListener("click", function () {
 // reset selection list (drop its previous contents)
 updSelTvSeriesEpEl.innerHTML = "";
 // populate the selection list
 fillSelectWithOptions( updSelTvSeriesEpEl, TvSeriesEpisode.instances,
     "movieId", {displayProp:"name"});
 document.getElementById("TvSeriesEpisode-M").style.display = "none";
 document.getElementById("TvSeriesEpisode-U").style.display = "block";
 updateFormEl.reset();
});
// handle change events on tvSeriesEpisode select element
updSelTvSeriesEpEl.addEventListener("change", handleSerieEpSelectChangeEvent);

// handle Save button click events
updateFormEl["commit"].addEventListener("click", function () {
 const tvSeriesEpisodeIdRef = updSelTvSeriesEpEl.value;
 if (!tvSeriesEpisodeIdRef) return;
 const slots = {
    movieId: updateFormEl.movieId.value,
    tvSerieEpisode: updateFormEl.tvSerieEpisode.value,
    episodeNo: updateFormEl.episodeNo.value
 }
   // check all input fields and show error messages
  updateFormEl.tvSeriesName.setCustomValidity(
    TvSeriesEpisode.checkTvSeriesName( slots.tvSeriesName).message);
  updateFormEl.episodeNo.setCustomValidity(
    TvSeriesEpisode.checkEpisodeNo( slots.episodeNo).message);
  // save the input data only if all form fields are valid
  if (updateFormEl.checkValidity()) TvSeriesEpisode.add( slots);
});
// handle change events on tvSeriesEpisode select element
updSelTvSeriesEpEl.addEventListener("change", handleSerieEpSelectChangeEvent);
/**
 * handle TvSeriesEpisode selection events
 * on selection, populate the form with the data of the selected TvSerieEpisode
 */
function handleSerieEpSelectChangeEvent() {
  const key = updateFormEl.selectTvSeriesEpisode.value;
  if (key) {
    const tvse = TvSeriesEpisode.instances[key];
    updateFormEl.movieId.value = tvse.movieId;
    updateFormEl.tvSeriesName.value = tvse.tvSeriesName;
    updateFormEl.episodeNo.value = tvse.episodeNo;
} else {
    updateFormEl.reset();
  }
}
/**********************************************
 * Use case Delete tvSeriesEpisode
**********************************************/
const deleteFormEl = document.querySelector("section#TvSeriesEpisode-D > form");
const delSelTvSeriesEpEl = deleteFormEl.selectTvSeriesEpisode;
//----- set up event handler for menu item "Delete" -----------
document.getElementById("Delete").addEventListener("click", function () {
  // reset selection list (drop its previous contents)
  delSelTvSeriesEpEl.innerHTML = "";
  // populate the selection list
  fillSelectWithOptions( delSelTvSeriesEpEl, TvSeriesEpisode.instances,
    "personId", {displayProp:"name"});
  document.getElementById("TvSeriesEpisode-M").style.display = "none";
  document.getElementById("TvSeriesEpisode-D").style.display = "block";
  deleteFormEl.reset();
});
// handle Delete button click events
deleteFormEl["commit"].addEventListener("click", function () {
  const tvSeriesEpisodeIdRef = delSelTvSeriesEpEl.value;
  if (!tvSeriesEpisodeIdRef) return;
  if (confirm("Do you really want to delete this tvSeriesEpisode?")) {
    TvSeriesEpisode.destroy( tvSeriesEpisodeIdRef);
    delSelTvSeriesEpEl.remove( delSelTvSeriesEpEl.selectedIndex);
  }
});
/**********************************************
 * Refresh the Manage TvSeriesEpisodes Data UI
 **********************************************/
function refreshManageDataUI() {
  // show the manage rvSeriesEpisode UI and hide the other UIs
  document.getElementById("TvSeriesEpisode-M").style.display = "block";
  document.getElementById("TvSeriesEpisode-R").style.display = "none";
  document.getElementById("TvSeriesEpisode-C").style.display = "none";
  document.getElementById("TvSeriesEpisode-U").style.display = "none";
  document.getElementById("TvSeriesEpisode-D").style.display = "none";
}

// Set up Manage Employees UI
refreshManageDataUI();