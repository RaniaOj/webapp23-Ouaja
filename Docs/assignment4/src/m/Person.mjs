/**
 * @fileOverview  The model class Person with property definitions, (class-level)
 *                check methods, setter methods, and the special methods saveAll
 *                and retrieveAll
 * @author Gerd Wagner
 */
import Movie from "./Movie.mjs";
import { cloneObject} from "../../lib/useful.mjs";
import { NoConstraintBreak, MandatoryValueConstraintBreak,
  RangeConstraintBreak, UniquenessConstraintBreak,
  ReferentialIntegrityConstraintBreak,
  NoConstraintBreak}
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
  }
  get personId() {
    return this._personId;
  }
  static checkPersonId( id) {
    if (!id) {
      return new NoConstraintBreak();  // may be optional as an IdRef
    } else {
      id = parseInt( id);  // convert to integer
      if (isNaN( id) || !Number.isInteger( id) || id < 1) {
        return new RangeConstraintBreak("The person ID must be a positive integer!");
      } else {
        return new NoConstraintBreak();
      }
    }
  }
  static checkPersonIdAsId( id) {
    var constraintBreak = Person.checkPersonId(id);
    if ((constraintBreak instanceof NoConstraintBreak)) {
      // convert to integer
      id = parseInt(id);
      if (isNaN(id)) {
        return new MandatoryValueConstraintBreak(
            "A positive integer value for the person ID is required!");
      } else if (Person.instances[String(id)]) {  // convert to string if number
        constraintBreak = new UniquenessConstraintBreak(
            "There is already a person record with this person ID!");
      } else {
        constraintBreak = new NoConstraintBreak();
      }
    }
    return constraintBreak;
  }
  static checkPersonIdAsIdRef( id) {
    var constraintBreak = Person.checkPersonId( id);
    if ((constraintBreak instanceof NoConstraintBreak) && id) {
      if (!Person.instances[String(id)]) {
        constraintBreak = new ReferentialIntegrityConstraintBreak(
            "There is no person movie with this person ID!");
      }
    }
    return constraintBreak;
  }
  set personId( id) {
    const constraintBreak = Person.checkPersonIdAsId( id);
    if (constraintBreak instanceof NoConstraintBreak) {
      this._personId = parseInt( id);
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

//checkRole : one director at least must be selected
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
static checkRole( roleP) {
  if (!roleP || (Array.isArray( roleP) &&
    roleP.length === 0)) {
    return new MandatoryValueConstraintBreak(
      "No role provided!");
  } else if (!Array.isArray( roleP)) {
    return new RangeConstraintBreak(
      "The value of role must be an array!");
  } else {
    for (let i of roleP.keys()) {
      const validationResult = Person.checkRole( roleP[i]);
      if (!(validationResult instanceof NoConstraintBreak)) {
        return validationResult;
      }
    }
    return new NoConstraintBreak();
  }
}
set role( roleP) {
  const validationResult = Person.checkRole( roleP);
  if (validationResult instanceof NoConstraintBreak) {
    this._role = roleP;
  } else {
    throw validationResult;
  }
  }
}
// CheckPersonIsDirector to check if the person is director


//CheckPersonIsActor to check if the person is actor


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

  ///////Hier ändern person as Director
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

export default Person;
export { RoleEL };