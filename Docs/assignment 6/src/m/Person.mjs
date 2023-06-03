/**
 * @fileOverview  The model class Person with property definitions, (class-level)
 *                check methods, setter methods, and the special methods saveAll
 *                and retrieveAll
 * @author Gerd Wagner
 */
import Movie from "../m/Movie.mjs";
import { cloneObject} from "../../lib/useful.mjs";
import { NoConstraintBreak, MandatoryValueConstraintBreak,
  RangeConstraintBreak, UniquenessConstraintBreak,
  ReferentialIntegrityConstraintBreak,
  ConstraintBreak}
  from "../../lib/errorTypes.mjs";
import Enumeration from "../../lib/otherTypes.mjs";

/**
 * Enumeration type
 * @global
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
    if (!pId) {
      return new MandatoryValueConstraintBreak(); 
    } else {
    pId = parseInt( pId);
    if (isNaN( pId) || !Number.isInteger( pId) || pId < 1) {
      return new RangeConstraintBreak (
        "The PersonId must be a PositiveInteger!");
      } else {
        return NoConstraintBreak() ; 
      }
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
    var validationResult = Person.checkPersonIdAsId( pId, this.constructor);
    if (validationResult instanceof NoConstraintViolation) {
      this._personId = parseInt( pId);
    } else {
      throw validationResult;
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
static checkRole( v) {
  if (!v) {
    return new MandatoryValueConstraintBreak(
      "No role defined!");
  } else if (!Number.isInteger( v) || v < 1 ||
    p > RoleEL.MAX) {
    return new RangeConstraintBreak(
      "The value of role must represent a person type!");
  } else {
    return new NoConstraintBreak();
  }
}
set role( v) {
  const validationResult = Person.checkRole( v);
  if (validationResult instanceof NoConstraintBreak) {
    this._role = v;
  } else {
    throw validationResult;
  }
  }
  get directedMovies() {
    return this._directedMovies;
  }
  /**
   * Check if the attribute "directedMovies" applies to the given role of person
   * and if the value for it is admissible
   * @method
   * @static
   * @param {string} d - The directedMovies of a director.
   * @param {number} r - The role of a person.
   */
  static checkDirectedMovies( d, r) {
    r = parseInt( r);
    if (r === RoleEL.DIRECTOR && !d) {
      return new MandatoryValueConstraintBreak(
          "The directed movies must be provided for a director!");
    } else if (r !== RoleEL.MANAGER && d) {
      return new ConstraintBreak(
          "The directed movies must not be provided if the person is not a director!");
    } else {
      return new NoConstraintBreak();
    }
  }
  set directedMovies( v) {
    const validationResult = Person.checkDirectedMovies( v, this.role);
    if (validationResult instanceof NoConstraintBreak) {
      this._directedMovies = v;
    } else {
      throw validationResult;
    }
  }
  get playedMovies() {
    return this._playedMovies;
  }
  /**
   * Check if the attribute "playededMovies" applies to the given role of person
   * and if the value for it is admissible
   * @method
   * @static
   * @param {string} p - The playededMovies of an actor.
   * @param {number} r - The role of a person.
   */
  static checkPlayedMovies( p, r) {
    r = parseInt( r);
    if (r === RoleEL.ACTOR && !p) {
      return new MandatoryValueConstraintBreak(
          "The played movies must be provided for an actor!");
    } else if (r !== RoleEL.ACTOR && p) {
      return new ConstraintBreak(
          "The played movies must not be provided if the person is not an actor!");
    } else {
      return new NoConstraintBreak();
    }
  }
  set playedMovies( v) {
    const validationResult = Person.checkPlayedMovies( v, this.role);
    if (validationResult instanceof NoConstraintBreak) {
      this._playedMovies = v;
    } else {
      throw validationResult;
    }
  }
  get agent() {
    return this._agent;
  }
  static checkAgent ( g) {
    g = parseInt( g);
    if (isNaN( g) || !Number.isInteger( g) || g < 1) {
      return new RangeConstraintBreak (
        "The AgentNo. must be a PositiveInteger!");
      } else {
        return NoConstraintBreak() ; 
      }
  }
  set agent( g) {
    const validationResult = Person.checkAgent( g);
    if (validationResult instanceof NoConstraintBreak) {
      this._agent = g;
    } else {
      throw validationResult;
    }
    }
  toString() {
    var empStr = `Person { persID: ${this.personId}, name: ${this.name}`;
    if (this.role) empStr += `, role: ${this.role}`;
    if (this.directedMovies) empStr += `, directedMovies: ${this.directedMovies}`;
    if (this.playedMovies) empStr += `, playedMovies: ${this.playedMovies}`;
    return `${empStr} }`;
  }
}
/****************************************************
*** Class-level ("static") properties ***************
*****************************************************/
Person.instances = {};
Person.subtypes = [];
/**********************************************************
 ***  Class-level ("static") storage management methods ***
 **********************************************************/
/**
 *  Create a new person row
 */
Person.add = function (slots) {
  var person = null;
  try {
    person = new Person( slots);
  } catch (e) {
    console.log(`${e.constructor.name + ": " + e.message}`);
    person = null;
  }
  if (person) {
    Person.instances[person.personId] = person;
    console.log(`Saved: ${person.name}`);
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

  /**
 *  Delete an existing person record
 */

Person.destroy = function (personId) {
    const person = Person.instances[personId];
    delete Person.instances[personId];
  // also delete this person from subtype populations
  for (const Subtype of Person.subtypes) {
    if (personId in Subtype.instances) delete Subtype.instances[personId];
  }
  console.log(`Person ${person.name} deleted.`);
};

/**
 *  Retrieve all Person objects as records
 * @method
 * @static
 */
Person.retrieveAll = function () {
  var persons = {};
  if (!localStorage["persons"]) localStorage["persons"] = "{}";
  try {
    persons = JSON.parse( localStorage["persons"]);
  } catch (e) {
    console.log("Error when reading from Local Storage\n" + e);
  }
  for (const key of Object.keys( persons)) {
    try {  // convert record to (typed) object
      Person.instances[key] = new Person( persons[key]);
    } catch (e) {
      console.log(`${e.constructor.name} while deserializing person ${key}: ${e.message}`);
    }
  }
  // add all instances of all subtypes to Person.instances
  for (const Subtype of Person.subtypes) {
    Subtype.retrieveAll();
    for (const key of Object.keys( Subtype.instances)) {
      Person.instances[key] = Subtype.instances[key];
    }
  }
  console.log(`${Object.keys( Person.instances).length} Person records loaded.`);
};
/**
 *  Save all person objects as records
 */
Person.saveAll = function () {
  const persons = {};
  for (const key of Object.keys( Person.instances)) {
    const pers = Person.instances[key];
    // save only direct instances (no authors, no employees)
    if (pers.constructor === Person) persons[key] = pers;
  }
  try {
    localStorage["persons"] = JSON.stringify( persons);
    console.log(`${Object.keys( persons).length} person saved.`);
  } catch (e) {
    alert( "Error when writing to Local Storage\n" + e);
  }
}};

export default Person;
export { RoleEL };