/**
 * @fileOverview  The model class Person with property definitions, (class-level)
 *                check methods, setter methods, and the special methods saveAll
 *                and retrieveAll
 * @author Gerd Wagner
 */
import Movie from "../m/Movie.mjs";
import { cloneObject} from "../../lib/useful.mjs";
import Enumeration from "../../lib/otherTypes.mjs";
import { NoConstraintBreak, MandatoryValueConstraintBreak,
  RangeConstraintBreak, UniquenessConstraintBreak,
  ReferentialIntegrityConstraintBreak}
  from "../../lib/errorTypes.mjs";

/**
 * Define one Enumeration : RoleEL
 */
const RoleEL = new Enumeration(["director","actor"]);

/**
 * The class Person
 * @class
 * @param {object} slots - Object creation slots.
 */
class Person {
  // using a single record parameter with ES6 function parameter destructuring
  constructor ({personId, name, role}) {
    // assign properties by invoking implicit setters
    this.personId = personId;  // number (integer)
    this.name = name;  // string
    this.role = role; // checkbox director or actor or both
    this._directedMovies = {};
    this._playedMovies = {};
  }
  get personId() {
    return this._personId;
  }
  static checkPersonId( pId) {
    let moviesString = localStorage.getItem("persons");
    if (!id) {
      return new MandatoryValueConstraintBreak(); 
    } else {
   if (Object.keys(JSON.parse(personsString)).includes(pId.toString())) {
      return new RangeConstraintBreak (
        "The personId exists!");
  } else if (!isIntegerOrIntegerString(pId) || parseInt(pId) < 1)  {
    return new RangeConstraintBreak (
      "The personId must be a PositiveInteger!");}
   else return NoConstraintBreak() ; 
    }
  }
  static checkPersonIdAsId( pId) {
    var constraintBreak = Person.checkPersonId(pId);
    if ((constraintBreak instanceof NoConstraintBreak)) {
      if (!pId) {
        return new MandatoryValueConstraintBreak(
            "A positive integer value for the person ID is required!");
      } else if (Person.instances[String(pId)]) {  // convert to string if number
        constraintBreak = new UniquenessConstraintBreak(
            "There is already a person record with this person ID!");
      } else {
        constraintBreak = new NoConstraintBreak();
      }
    }
    return constraintBreak;
  }
  static checkPersonIdAsIdRef( pId) {
    var constraintBreak = Person.checkPersonId( pId);
    if ((constraintBreak instanceof NoConstraintBreak) && pId) {
      if (!Person.instances[String(pId)]) {
        constraintBreak = new ReferentialIntegrityConstraintBreak(
            "There is no person movie with this person ID!");
      }
    }
    return constraintBreak;
  }
  set personId( pId) {
    const constraintBreak = Person.checkPersonIdAsId( pId);
    if (constraintBreak instanceof NoConstraintBreak) {
      this._personId = parseInt( pId);
    } else {
      throw constraintBreak;
    }
  }
  get name(){
    return this._name;
  } 
  static checkName ( name) {
    if (name === undefined) {
        return MandatoryValueConstraintBreak ("A Persons name is required!");
  } else {
    if (!isNonEmptyString(name)) {
        return new RangeConstraintBreak (
          "The name of peerson must be a non-empty string!");
  } else return NoConstraintBreak(); 
  }
  }
  set name( n) {
    const validationResult = Movie.checkName( n);
    if (validationResult instanceof NoConstraintBreak) {
      this._name = n;
    } else {
      throw validationResult = new NoConstraintBreak();
    }
  }

//checkRole : one role must be selected
get role() {
  return this._role;
}
static checkRole( r) {
  if (!r) {
    return new MandatoryValueConstraintBreak(
      "No role defined!");
  } else if (!Number.isInteger( r) || r < 1 ||
    p > RoleEL.MAX) {
    return new RangeConstraintBreak(
      `Invalid value for role: ${r}`);
  } else {
    return new NoConstraintBreak();
  }
}
set role( r) {
  const validationResult = Person.checkRole( r);
  if (validationResult instanceof NoConstraintBreak) {
    this._role = r;
  } else {
    throw validationResult;
  }
  }
  get directedMovies() {
    return this._directedMovies;
  }
  toString() {
    return `Person{ personId: ${this.personId}, name: ${this.name} }`;
  }
  // Convert object to record with ID references
  toJSON() {  // is invoked by JSON.stringify in Diretor.saveAll
    var rec = {};
    // loop over all Director properties
    for (const p of Object.keys( this)) {
      // keep underscore-prefixed properties except "_directedMovies"
      if (p.charAt(0) === "_" && p !== "_directedMovies") {
        // remove underscore prefix
        rec[p.substr(1)] = this[p];
      }
    }
    return rec;
  }
  get playedMovies() {
    return this._playedMovies;
  }
  toString() {
    return `Person{ personId: ${this.personId}, name: ${this.name} }`;
  }
  // Convert object to record with ID references
  toJSON() {  // is invoked by JSON.stringify in Actor.saveAll
    var rec = {};
    // loop over all Director properties
    for (const p of Object.keys( this)) {
      // keep underscore-prefixed properties except "_playedMovies"
      if (p.charAt(0) === "_" && p !== "_playedMovies") {
        // remove underscore prefix
        rec[p.substr(1)] = this[p];
      }
    }
    return rec;
  }
}

  //selectedRole = document.querySelector('.messageCheckbox').checked

/****************************************************
*** Class-level ("static") properties ***************
*****************************************************/
// initially an empty collection (in the form of a map)
Person.instances = {};

/**********************************************************
 ***  Class-level ("static") storage management methods ***
 **********************************************************/
/**
 *  Create a new person record/object
 */
Person.add = function (slots) {
  try {
    const person = new Person( slots);
    Person.instances[person.personId] = person;
    console.log(`Saved: ${person.name}`);
  } catch (e) {
    console.log(`${e.constructor.name}: ${e.message}`);
  }
};
/**
 *  Update an existing person record/object
 */
Person.update = function ({personId, name}) {
  const person = Person.instances[String( personId)],
        objectBeforeUpdate = cloneObject( person);
  var noConstraintBroken=true, ending="", updatedProperties=[];
  try {
    if (name && person.name !== name) {
      person.name = name;
      updatedProperties.push("name");
    }
  } catch (e) {
    console.log( `${e.constructor.name}: ${e.message}`);
    noConstraintBroken = false;
    // restore object to its state before updating
    Person.instances[personId] = objectBeforeUpdate;
  }
  if (noConstraintBroken) {
    if (updatedProperties.length > 0) {
      ending = updatedProperties.length > 1 ? "ies" : "y";
      console.log( `Propert${ending} ${updatedProperties.toString()} modified for person ${name}`);
    } else {
      console.log( `No property value changed for person ${name}!`);
    }
  }

Person.destroy = function (personId) {
    const person = Person.instances[personId];
    // delete all dependent movie records
    for (const movieId of Object.keys( Movie.instances)) {
      const movie = Movie.instances[movieId];
      if (personId in movie.person) delete movie.persons[personId];
    }
    // delete the person object
    delete Person.instances[personId];
    console.log( `Person ${person.name} deleted.`);
  };
  /**
 *  Load all Director movies and convert them to objects
 */


/**
 *  Save all person objects as records
 */
Person.saveAll = function () {
  const nmrOfPersons = Object.keys( Person.instances).length;
  try {
    localStorage["persons"] = JSON.stringify( Person.instances);
    console.log( `${nmrOfPersons} person records saved.`);
  } catch (e) {
    alert( "Error when writing to Local Storage\n" + e);
  }
}};
Person.retrieveAll = function () {
  var persons = {};
  if (!localStorage["persons"]) localStorage["persons"] = "{}";
  try {
    persons = JSON.parse( localStorage["persons"]);
  } catch (e) {
    console.log( "Error when reading from Local Storage\n" + e);
    persons = {};
  }
  for (const key of Object.keys( persons)) {
    try {
      // convert record to (typed) object
      Person.instances[key] = new Person( persons[key]);
    } catch (e) {
      console.log( `${e.constructor.name} while deserializing person ${key}: ${e.message}`);
    }
  }
  console.log( `${Object.keys( persons).length} person movies loaded.`);
};
export default Person;
export { RoleEL };