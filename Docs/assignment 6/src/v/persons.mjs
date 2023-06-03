/**
 * @fileOverview  View code of UI for managing Person data
 * @author Gerd Wagner
 */
/***************************************************************
 Import classes, datatypes and utility procedures
 ***************************************************************/
import Person, { RoleEL } from "../m/Person.mjs";
import Movie from "../m/Movie.mjs";
import { displaySegmentFields, undisplayAllSegmentFields } from "./application.mjs"
import { fillSelectWithOptions } from "../../lib/useful.mjs";

/***************************************************************
 Load data
 ***************************************************************/

Person.retrieveAll();
Movie.retrieveAll();

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
  Person.saveAll();
  for (const Subtype of Person.subtypes) {
    Subtype.saveAll();
  }
  // also save movies because movies may be deleted when a person is deleted
  Movie.saveAll();
});

/**********************************************
 Use case Retrieve and List All Persons
 **********************************************/
document.getElementById("RetrieveAndListAll")
    .addEventListener("click", function () {
  const tableBodyEl = document.querySelector("section#Person-R > table > tbody");
  tableBodyEl.innerHTML = "";
  for (const key of Object.keys( Person.instances)) {
    const person = Person.instances[key];
    const row = tableBodyEl.insertRow();
    row.insertCell().textContent = person.personId;
    row.insertCell().textContent = person.name;
    if (person.role) {
      switch (person.role) {
      case RoleEL.DIRECTOR :
        row.insertCell().textContent = `Director of ${Movie.titel} movies`;
        break;
      case RoleEL.ACTOR:
    row.insertCell().textContent = `Actor of ${Movie.titel} movies`;
        break;
      }
    }
  }
  document.getElementById("Person-M").style.display = "none";
  document.getElementById("Person-R").style.display = "block";
});
/**********************************************
 Use case Create Person
 **********************************************/
const createFormEl = document.querySelector("section#Person-C > form");
const crtSelRoleEl = createFormEl.selectRole;document.getElementById("Create").addEventListener("click", function () {
  document.getElementById("Person-M").style.display = "none";
  document.getElementById("Person-C").style.display = "block";
  createFormEl.reset();
});

// set up event handlers for responsive constraint break
createFormEl.personId.addEventListener("input", function () {
    createFormEl.personId.setCustomValidity(
    Person.checkPersonIdAsId( createFormEl.personId.value).message);
});
createFormEl.name.addEventListener("input", function () {
    createFormEl.name.setCustomValidity(
    Person.checkName( createFormEl.name.value).message);
});
// set up the person role selection list
fillSelectWithOptions( createRoleSelectEl, RoleEL.labels);
createRoleSelectEl.addEventListener("change", handleRoleSelectChangeEvent);

// handle Save button click events
createFormEl["commit"].addEventListener("click", function () {
  const slots = {
    personId: createFormEl.personId.value,
    name: createFormEl.name.value,
  };
    if (roleStr) {
    // convert array index to enum index
    slots.role = parseInt( roleStr) + 1;
    switch (slots.role) {
      case RoleEL.DIRECTOR:
        slots.directedMovies = createFormEl.directedMovies.value;
        createFormEl.directedMovies.setCustomValidity(
          Person.checkDirectedMovies( createFormEl.directedMovies.value, slots.role).message);
        break;
      case RoleEL.ACTOR:
        slots.playedMovies = createFormEl.playedMovies.value;
        createFormEl.playedMovies.setCustomValidity(
          Person.checkPlayedMovies( createFormEl.playedMovies.value, slots.role).message);
        break;
    }
  }
// check all input fields and show error messages
createFormEl.personId.setCustomValidity(
    Person.checkPersonIdAsId( slots.personId).message);
createFormEl.name.setCustomValidity(
    Person.checkName( slots.name).message);
createFormEl.role[0].setCustomValidity(
    Person.checkRole( slots.role).message);
// save the input data only if all form fields are valid
 if (createFormEl.checkValidity()) {
 Person.add( slots);
 }
});

fillSelectWithOptions( crtSelRoleEl, RoleEL.labels);
crtSelRoleEl.addEventListener("change", handleRoleSelectChangeEvent);
/**********************************************
 Use case Update Person
 **********************************************/
const updateFormEl = document.querySelector("section#Person-U > form");
const updSelPersonEl = updateFormEl.selectPerson;
updSelRoleEl = updateFormEl.selectRole;
// handle click event for the menu item "Update"
document.getElementById("Update").addEventListener("click", function () {
// reset selection list (drop its previous contents)
updSelPersonEl.innerHTML = "";
// populate the selection list
fillSelectWithOptions( updSelPersonEl, Person.instances,
    "personId", {displayProp:"name"});
document.getElementById("Person-M").style.display = "none";
document.getElementById("Person-U").style.display = "block";
updateFormEl.reset();
});
updSelPersonEl.addEventListener("change", handlePersonSelectChangeEvent);

// handle Save button click events
updateFormEl["commit"].addEventListener("click", function () {
  const personIdRef = updSelPersonEl.value;
  if (!personIdRef) return;
  const slots = {
    personId: updateFormEl.personId.value,
    name: updateFormEl.name.value,
  }
  if (roleStr) {
    // convert array index to enum index
    slots.role = parseInt( roleStr) + 1;
    switch (slots.role) {
      case RoleEL.DIRECTOR:
        slots.directedMovies = updateFormEl.directedMovies.value;
        updateFormEl.directedMovies.setCustomValidity(
          Person.checkDirectedMovies( updateFormEl.directedMovies.value, slots.role).message);
        break;
      case RoleEL.ACTOR:
        slots.playedMovies = updateFormEl.playedMovies.value;
        updateFormEl.playedMovies.setCustomValidity(
          Person.checkPlayedMovies( updateFormEl.playedMovies.value, slots.role).message);
        break;
}
updateFormEl.personId.addEventListener("input", function () {
  updateFormEl.personId.setCustomValidity(
    Person.checkPersonIdAsId( updateFormEl.personId.value).message);
});
updateFormEl.name.addEventListener("input", function () {
  updateFormEl.name.setCustomValidity(
    Person.checkName( updateFormEl.name.value).message);
});
// mandatory value check for the role
roleFieldsetEl.addEventListener("click", function () {
  const val = roleFieldsetEl.getAttribute("data-value");
  formEl.role[0].setCustomValidity(
    (!val || Array.isArray(val) && val.length === 0) ?
      "At least one role form must be selected!":"" );
});
  // save the input data only if all of the form fields are valid
  if (updSelPersonEl.checkValidity()) {
    Person.update( slots);
    // update the person selection list's option element
    updSelPersonEl.options[updSelPersonEl.selectedIndex].text = slots.name;
  }
}});
/**
 * handle person selection events
 * when a person is selected, populate the form with the data of the selected person
 */
function handlePersonSelectChangeEvent () {
  const key = updateFormEl.selectPerson.value;
  if (key) {
    const pers = Person.instances[key];
    updateFormEl.personId.value = pers.personId;
    updateFormEl.name.value = pers.name;
    updateFormEl.role.JSON.parse( roleFieldsetEl.getAttribute("data-value")) = pers.role;
  } else {
    updateFormEl.reset();
  }
}

/**********************************************
 Use case Delete Person
 **********************************************/
const deleteFormEl = document.querySelector("section#Person-D > form");
const delSelPersonEl = deleteFormEl.selectPerson;
document.getElementById("Delete").addEventListener("click", function () {
  document.getElementById("Person-M").style.display = "none";
  document.getElementById("Person-D").style.display = "block";
  // reset selection list (drop its previous contents)
  delSelPersonEl.innerHTML = "";
  // populate the selection list
  fillSelectWithOptions( delSelPersonEl, Person.instances,
      "personId", {displayProp:"name", displayProp:"role"});
  deleteFormEl.reset();
});
// handle Delete button click events
deleteFormEl["commit"].addEventListener("click", function () {
  const personIdRef = delSelPersonEl.value;
  if (!personIdRef) return;
  if (confirm("Do you really want to delete this person?")) {
    Person.destroy( personIdRef);
    delSelPersonEl.remove( delSelPersonEl.selectedIndex);
  }
});


/**********************************************
 * Refresh the Manage Persons Data UI
 **********************************************/
function refreshManageDataUI() {
  // show the manage person UI and hide the other UIs
  document.getElementById("Person-M").style.display = "block";
  document.getElementById("Person-R").style.display = "none";
  document.getElementById("Person-C").style.display = "none";
  document.getElementById("Person-U").style.display = "none";
  document.getElementById("Person-D").style.display = "none";
}

/**
 * event handler for person role selection events
 * used both in create and update
 */
function handleRoleSelectChangeEvent( e) {
  var formEl = e.currentTarget.form,
    roleIndexStr = formEl.selectRole.value,  // the array index of RoleEl.labels
    role = 0;
  if (roleIndexStr) {
    // convert array index to enum index
    role = parseInt(roleIndexStr) + 1;
    switch (role) {
      case RoleEL.DIRECTOR:
        formEl.directedMovies.addEventListener("input", function () {
          formEl.directedMovies.setCustomValidity(
            Person.checkDirectedMovies(formEl.directedMovies.value, role).message);
        });
        break;
      case RoleEL.ACTOR:
        formEl.playedMovies.addEventListener("input", function () {
          formEl.playedMovies.setCustomValidity(
            Person.checkPlayedMovies(formEl.playedMovies.value, role).message);
        });
        break;
    }
    displaySegmentFields(formEl, RoleEL.labels, role);
  } else {
    undisplayAllSegmentFields(formEl, RoleEL.labels);
  }
}

// Set up Manage Persons UI
refreshManageDataUI();
