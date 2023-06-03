/**
 * @fileOverview  The model class Movie with attribute definitions and storage management methods
 * @author Gerd Wagner
 * @copyright Copyright � 2013-2014 Gerd Wagner, Chair of Internet Technology, Brandenburg University of Technology, Germany. 
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is", 
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */

import { isNonEmptyString, cloneObject }
    from "../../lib/useful.mjs";
import {NoConstraintBreak, MandatoryValueConstraintBreak,
  RangeConstraintBreak, UniquenessConstraintBreak, ReferentialIntegrityConstraintBreak}
    from "../../lib/errorTypes.mjs";
import { Enumeration } from "..lib/otherTypes.mjs";

const MovieCategoryEL = new Enumeration(["TvSeriesEpisode","Biography"]);
    /**
 * The class Movie
 * @class
 * @param {object} slots - Object creation slots.
 */

// The class Movie
class Movie {
  Constructor (movieId, title, releaseDate, director, actor){
    this.movieId = movieId;
    this.title = title;
    this.releaseDate = releaseDate;
    this.director = director;
    this.actor = actor;
    this.category = category;
    this.about = about;
  }

  get movieId(){
    return this._movieId;
  }
  static checkMovieId ( mId) {
    if (!mId) {
      return new MandatoryValueConstraintBreak(); 
    } else {
    mId = parseInt( mId);
    if (isNaN( mId) || !Number.isInteger( mId) || mId < 1) {
      return new RangeConstraintBreak (
        "The movieId must be a PositiveInteger!");
      } else {
        return NoConstraintBreak() ; 
      }
  }
  }
  static checkMovieIdAsId( mId) {
    var validationResult = Movie.checkMovieIdAsId( mId);
    if ((validationResult instanceof NoConstraintBreak)) {
      if (!mId) {
        validationResult = new MandatoryValueConstraintBreak(
          "A MovieId must be provided!");
        validationResult = new NoConstraintBreak();
      }
      else if (Movie.instances[mId]) {
        validationResult = new UniquenessConstraintBreak(
          "There is already a movie with this movieId!");
      } else {
        validationResult = new NoConstraintBreak();
      }
    }
    return validationResult;
  }
  static checkMovieIdAsIdRef(mId) {
    var validationResult = Movie.checkMovieId( id);
    if ((validationResult instanceof NoConstraintBreak) && mId) {
      if (!Movie.instances[mId]) {
        validationResult = new ReferentialIntegrityConstraintBreak(
            'There is no movie with this movie ID!');
      }
    }
    return validationResult;
  }
  set movieId( mId) {
    const validationResult = Movie.checkMovieIdAsId( mId);
    if (validationResult instanceof NoConstraintBreak) {
      this._movieId = mId;
    } else {
      throw validationResult;
    }
  }

  get title(){
    return this._title;
  } 
  static checkTitle (t) {
    if (t === undefined) {
        return MandatoryValueConstraintBreak ("Titel is required!");
  } else {
    if (!isNonEmptyString(t)) {
        return new RangeConstraintBreak (
          "Titel must be a non-empty string!");
  } else if (t.length > 120) {
        return console.log ("Titel must be equal or less than 120");
  } else return NoConstraintBreak(); 
  }
  }
  set titel( t) {
    const validationResult = Movie.checkTitle( t);
    if (validationResult instanceof NoConstraintBreak) {
      this._titel = t;
    } else {
      throw validationResult = new NoConstraintBreak();
    }
  }
  get releaseDate(){
    return this._releaseDate;
  }
  static checkReleaseDate (d) {
    if (!d || d === "") return new NoConstraintBreak();
    else {
      if (d < "1895-12-28") {
      return console.log ("The release Date must be greater than or equal to 1895-12-28!");
    } else return new NoConstraintBreak();
  }
  }
  set releaseDate (d){
  const validationResult = Movie.checkReleaseDate( d);
    if (validationResult instanceof NoConstraintBreak) {
      this._releaseDate = d;
    } else {
      throw validationResult;
    }
  }
get director() {
  return this._director;
}
static checkDirector( d) {
  var validationResult = null;
  if (!d) {
    validationResult = new NoConstraintBreak(); 
  } else {
    // invoke foreign key constraint check
    validationResult = director.checkNameAsIdRef( d);
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
      this._director[key] = Movie.instances[key];
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
      this._director = Movie.instances[ director_id];
    } else {
      throw validationResult;
    }
  }
}
get actors() {
  return this._actors;
}

static checkActor( a) {
  var validationResult = null;
  if (!a) {
    // actors(s) are optional
    validationResult = new NoConstraintBreak();
  } else {
    // invoke foreign key constraint check
    validationResult = Movie.checkMovieIdAsIdRef( actor_id);
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
get category() {
  return this._category;
}
static checkCategory( c) {
  if (c === undefined) {
    return new NoConstraintBreak(); 
  } else if (!isIntegerOrIntegerString(c) || parseInt(c) < 1 ||
      parseInt(c) > MovieCategoryEL.MAX) {
      return new RangeConstraintBreak(
        `Invalid value for category: ${c}`);
    } else {
      return new NoConstraintBreak();
    }
}
set category ( c) {
  const validationResult = Movie.checkCategory( c);
  if (validationResult instanceof NoConstraintBreak) {
    this._category = c;
  } else {
      throw validationResult;
    }
}
get about() {
  return this._about;
}
static checkAbout( b) {
  b = parseInt( b);
  if (isNaN( b) || !Number.isInteger( b) || b < 1) {
    return new RangeConstraintBreak (
      "The about must be a PositiveInteger!");
    } else {
      return NoConstraintBreak() ; 
    }
}
set about ( b) {
  const validationResult = Movie.checkAbout( b);
  if (validationResult instanceof NoConstraintBreak) {
    this._about = b;
  } else {
      throw validationResult;
    }
}
}

/***********************************************
 ***  Class-level ("static") properties  *******
 ***********************************************/
Movie.instances = {};
Movie.subtypes = [];

/*********************************************************
 ***  Class-level ("static") storage management methods **
 *********************************************************/
/**
 *  Create a new movie 
 */

Movie.add = function (slots) {
  var movie = null;
  try {
    movie = new Movie( slots);
  } catch (e) {
    console.log(`${e.constructor.titel + ": " + e.message}`);
    movie = null;
  }
  if (movie) {
    Movie.instances[movie.movieId] = movie;
    console.log(`Saved: ${movie.titel}`);
  }
};

/**
 *  Update an existing movie record/object
 */
Movie.update = function ({movieId, title, releaseDate}) {
const movie = Movie.instances[movieId],
      objectBeforeUpdate = cloneObject( movie);
var noConstraintBroken = true, ending = "", updatedProperties=[];
try {
  if (title && movie.title !== title) {
    movie.title = title;
    updatedProperties.push("title");
  }
  if (releaseDate && movie.releaseDate !== parseInt( releaseDate)) {
    movie.releaseDate = releaseDate;
    updatedProperties.push("releaseDate");
  }
} catch (e) {
  console.log(`${e.constructor.titel}: ${e.message}`);
  noConstraintBroken = false;
  // restore object to its state before updating
  Movie.instances[movieId] = objectBeforeUpdate;
}
if (noConstraintBroken) {
  if (updatedProperties.length > 0) {
    ending = updatedProperties.length > 1 ? "ies" : "y";
    console.log(`Propert${ending} ${updatedProperties.toString()} modified for movie ${movieId}`);
  } else {
    console.log(`No property value changed for movie ${title}!`);
  }
  }
  };

/**
 *  Delete an existing Movie
 */
Movie.destroy = function (movieId) {
  const movie = Movie.instances[movieId];
  delete Movie.instances[movieId];
  // also delete this movie from subtype populations
  for (const Subtype of Movie.subtypes) {
    if (movieId in Subtype.instances) delete Subtype.instances[movieId];
  }
  console.log(`Movie ${movie.titel} deleted.`);
};
/**
 *  Retrieve all movie objects
 * @method
 * @static
 */
Movie.retrieveAll = function () {
  var movies = {};
    if (!localStorage["movies"]) localStorage["movies"] = "{}";
    try {
      movies = JSON.parse( localStorage["movies"]);
    } catch (e) {
    console.log( "Error when reading from Local Storage\n" + e);
  }
  for (const key of Object.keys( movies)) {
    try {
      Movie.instances[key] = new Movie( movies[key]);
    } catch (e) {
      console.log(`${e.constructor.titel} while deserializing movie ${movieId}: ${e.message}`);
    }
  }
  // add all instances of all subtypes to Movie.instances
  for (const Subtype of Movie.subtypes) {
    Subtype.retrieveAll();
    for (const key of Object.keys( Subtype.instances)) {
      Movie.instances[key] = Subtype.instances[key];
    }
  }
  console.log(`${Object.keys( Movie.instances).length} Movie records loaded.`);
};
/**
 *  Save all movie objects
 */
Movie.saveAll = function () {
  const movies = {};
  for (const key of Object.keys( Movie.instances)) {
    const mov = Movie.instances[key];
    // save only direct instances 
    if (mov.constructor === Movie) movies[key] = mov;
  }
  try {
    localStorage["movies"] = JSON.stringify( movies);
    console.log(`${Object.keys( movies).length} movies saved.`);
  } catch (e) {
    alert( "Error when writing to Local Storage\n" + e);
  }
};

export default Movie;
