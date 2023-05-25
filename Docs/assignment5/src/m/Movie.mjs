/**
 * @fileOverview  The model class Movie with attribute definitions and storage management methods
 * @author Gerd Wagner
 * @copyright Copyright � 2013-2014 Gerd Wagner, Chair of Internet Technology, Brandenburg University of Technology, Germany. 
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is", 
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */

import Person from "./Person.mjs";
import { isNonEmptyString, isIntegerOrIntegerString }
    from "../../lib/useful.mjs";
import {NoConstraintBreak, MandatoryValueConstraintBreak,
  RangeConstraintBreak }
    from "../../lib/errorTypes.mjs";

// The class Movie
class Movie {
  Constructor (movieId, title,releaseDate,rating,genres){
    this.movieId = movieId;
    this.title = title;
    this.releaseDate = releaseDate;
    this.director = this.director;
    this.actor = this.actor;
  }

  get movieId(){
    return this._movieId;
  }
  static checkMovieId (movieId) {
    let moviesString = localStorage.getItem("movies");
   if (Object.keys(JSON.parse(moviesString)).includes(movieId.toString())) {
      return new RangeConstraintBreak (
        "The movieId exists!");
  } else if (!isIntegerOrIntegerString(movieId) || parseInt(movieId) < 1)  {
    return new RangeConstraintBreak (
      "The movieId must be a PositiveInteger!");}
   else return NoConstraintBreak() ; 
    };
  static checkMovieIdAsId( movieId) {
    var validationResult = Movie.checkMovieIdAsId( movieId);
    if ((validationResult instanceof NoConstraintBreak)) {
      if (!movieId) {
        validationResult = new MandatoryValueConstraintBreak(
          "A MovieId must be provided!");
        validationResult = new NoConstraintBreak();
      }
    }
    return validationResult;
  }
  set movieId( m) {
    const validationResult = Movie.checkMovieIdAsId( m);
    if (validationResult instanceof NoConstraintBreak) {
      this._movieId = m;
    } else {
      throw validationResult;
    }
  }

  get title(){
    return this._title;
  } 
  static checkTitle (title) {
    if (title === undefined) {
        return MandatoryValueConstraintBreak ("Titel is required!");
  } else {
    if (!isNonEmptyString(titel)) {
        return new RangeConstraintBreak (
          "Titel must be a non-empty string!");
  } else if (title.length > 120) {
        return console.log ("Titel must be equal or less than 120");
  } else return NoConstraintBreak(); 
  }
  }
  set titel( tt) {
    const validationResult = Movie.checkTitle( tt);
    if (validationResult instanceof NoConstraintBreak) {
      this._titel = tt;
    } else {
      throw validationResult = new NoConstraintBreak();
    }
  }
  get releaseDate(){
    return this._releaseDate;
  }
  static checkReleaseDate (releaseDate) {
    if (!releaseDate || releaseDate === "") return new NoConstraintBreak();
    else {
      if (releaseDate < "1895-12-28") {
      return console.log ("The release Date must be greater than or equal to 1895-12-28!");
    } else return new NoConstraintBreak();
  }
  }
  set releaseDate (rd){
  const validationResult = Movie.checkReleaseDate( rd);
    if (validationResult instanceof NoConstraintBreak) {
      this._releaseDate = rd;
    } else {
      throw validationResult;
    }
  }
get director() {
  return this._director;
}
static checkDirector( director_Id) {
  var validationResult = null;
  if (!director_Id) {
    validationResult = new NoConstraintBreak(); 
  } else {
    // invoke foreign key constraint check
    validationResult = director.checkNameAsIdRef( director_Id);
  }
  return validationResult;
}
addDirector( d) {
  // a can be an ID reference or an object reference
  const director_id = (typeof d !== "object") ? parseInt( d) : d.directorId;
  if (director_id) {
    const validationResult = Movie.checkDirector( director_id);
    if (director_id && validationResult instanceof NoConstraintBreak) {
      // add the new director reference
      const key = String( director_id);
      this._director[key] = Person.instances[key];
    } else {
      throw validationResult;
    }
  }
}
removeDirector( d) {
  // a can be an ID reference or an object reference
  const director_id = (typeof d !== "object") ? parseInt( d) : d.directorId;
  if (director_id) {
    const validationResult = Movie.checkDirector( director_id);
    if (validationResult instanceof NoConstraintBreak) {
      // delete the director reference
      delete this._director[String( director_id)];
    } else {
      throw validationResult;
    }
  }
}
set director( d) {
  if (!d) {  // unset director
    delete this._director;
  } else {
    // d can be an ID reference or an object reference
    const director_id = (typeof d !== "object") ? d : d.name;
    const validationResult = Movie.checkDirector( director_id);
    if (validationResult instanceof NoConstraintBreak) {
      // create the new director reference
      this._director = Person.instances[ director_id];
    } else {
      throw validationResult;
    }
  }
}
get actors() {
  return this._actors;
}
static checkActor( actor_id) {
  var validationResult = null;
  if (!actor_id) {
    // actors(s) are optional
    validationResult = new NoConstraintBreak();
  } else {
    // invoke foreign key constraint check
    validationResult = Person.checkPersonIdAsIdRef( actor_id);
  }
  return validationResult;
}
set actors( a) {
  this._actors = {};
  if (Array.isArray(a)) {  // array of IdRefs
    for (const idRef of a) {
      this.addActor( idRef);
    }
  } else {  // map of IdRefs to object references
    for (const idRef of Object.keys( a)) {
      this.addActor( a[idRef]);
    }
  }
}
}
/***********************************************
 ***  Class-level ("static") properties  *******
 ***********************************************/
Movie.instances = {};  // initially an empty collection (a map)

/*********************************************************
 ***  Class-level ("static") storage management methods **
 *********************************************************/
/**
 *  Create a new movie 
 */
Movie.add = function (slots) {
  try {
    const movie = new Movie( slots);
    Movie.instances[movie.movieId] = movie;
    console.log(`Movie record ${movie.toString()} created!`);
  } catch (e) {
    console.log(`${e.constructor.name}: ${e.message}`);
  }
};

/**
 *  Update an existing movie record/object
 */
Movie.update = function ({movieId, title, releaseDate,
  directorIdRefsToAdd, directorIdRefsToRemove, actor_id}) {
const movie = Movie.instances[movieId],
      objectBeforeUpdate = cloneObject( movie);
var noConstraintBroken=true, updatedProperties=[];
try {
  if (title && movie.title !== title) {
    movie.title = title;
    updatedProperties.push("title");
  }
  if (releaseDate && movie.releaseDate !== parseInt( releaseDate)) {
    movie.releaseDate = releaseDate;
    updatedProperties.push("releaseDate");
  }
  if (actor && movie.actor !== parseInt( actor)) {
    movie.actor = actor;
    updatedProperties.push("actor");
  }
  if (directorIdRefsToAdd) {
    updatedProperties.push("director(added)");
    for (const directorIdRef of directorIdRefsToAdd) {
      movie.addDirector( directorIdRef);
    }
  }
  if (directorIdRefsToRemove) {
    updatedProperties.push("director(removed)");
    for (const adirector_id of directorIdRefsToRemove) {
      movie.removeDirector( director_id);
    }
  }
} catch (e) {
  console.log(`${e.constructor.name}: ${e.message}`);
  noConstraintBroken = false;
  // restore object to its state before updating
  Movie.instances[movieId] = objectBeforeUpdate;
}
if (noConstraintBroken) {
  if (updatedProperties.length > 0) {
    let ending = updatedProperties.length > 1 ? "ies" : "y";
    console.log(`Propert${ending} ${updatedProperties.toString()} modified for movie ${movieId}`);
  } else {
    console.log(`No property value changed for movie ${movie.movieI}!`);
  }
  }
  };

/**
 *  Delete an existing Movie
 */
Movie.destroy = function (movieId) {
  if (Movie.instances[movieId]) {
    console.log(`${Movie.instances[movieId].toString()} deleted!`);
    delete Movie.instances[movieId];
  } else {
    console.log(`There is no movie with movieId ${movieId} in the database!`);
  }
};
/**
 *  Load all movie table rows and convert them to objects 
 */
Movie.retrieveAll = function () {
  var movies = {};
  try {
    if (!localStorage["movies"]) localStorage["movies"] = "{}";
    else {
      movies = JSON.parse( localStorage["movies"]);
      console.log(`${Object.keys( movies).length} movie records loaded.`);
    }
  } catch (e) {
    alert( "Error when reading from Local Storage\n" + e);
  }
  for (const movieId of Object.keys( movies)) {
    try {
      Movie.instances[movieId] = new Movie( movies[movieId]);
    } catch (e) {
      console.log(`${e.constructor.name} while deserializing movie ${movieId}: ${e.message}`);
    }
  }
};
/**
 *  Save all movie objects
 */
Movie.saveAll = function () {
  const nmrOfMovies = Object.keys( Movie.instances).length;
  try {
    localStorage["movies"] = JSON.stringify( Movie.instances);
    console.log(`${nmrOfMovies} movie records saved.`);
  } catch (e) {
    alert( "Error when writing to Local Storage\n" + e);
  }
};

export default Movie;
