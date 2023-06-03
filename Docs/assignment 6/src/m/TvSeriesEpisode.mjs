/**
 * @author Gerd Wagner
 * @copyright Copyright � 2013-2014 Gerd Wagner, Chair of Internet Technology, 
 *     Brandenburg University of Technology, Germany. 
 * @license This code is licensed under The Code Project Open License (CPOL), 
 *     implying that the code is provided "as-is", can be modified to create 
 *     derivative works, can be redistributed, and can be used in commercial 
 *     applications.
 */
import Movie from "../m/Movie.mjs";
import { cloneObject, isNonEmptyString, isIntegerOrIntegerString } from "../../lib/useful.mjs";
import { NoConstraintBreak, MandatoryValueConstraintBreak, RangeConstraintBreak }
  from "../../lib/errorTypes.mjs";

/**
 * Constructor function for the class TvSeriesEpisode 
 * @constructor
 * @param {{movieId: number, tvSeriesName: string}} [slots] - 
 *     A record of parameters.
 */
class TvSeriesEpisode extends Movie {
  constructor ({movieId, tvSeriesName, episodeNo}) {
    super({movieId});
    this.tvSeriesName = tvSeriesName;
    if (episodeNo) this.episodeNo = episodeNo;
  }
  get tvSeriesName() {
    return this._tvSeriesName;
  }
  static checkTvSeriesName( n){
    if (!n) {
      return new MandatoryValueConstraintBreak(
        "A TvSeriesName must be provided!");
    } else if (!isNonEmptyString(n)) {
      return new RangeConstraintBreak(
        "The TvSeriesName must be a non-empty string!");
    } else {
      return new NoConstraintBreak();
    }
  }
  set tvSeriesName( n) {
    const validationResult = TvSeriesEpisode.checkTvSeriesName( n);
    if (validationResult instanceof NoConstraintBreak) {
      this._tvSeriesName = n;
  } else {
    throw validationResult;
  }
}
  get episodeNo() {
    return this._episode;
  }
  static checkEpisodeNo ( ep) {
    ep = parseInt( ep);
    if (isNaN( ep) || !Number.isInteger( ep) || ep < 1) {
      return new RangeConstraintBreak (
        "The episode No. must be a PositiveInteger!");
      } else {
        return NoConstraintBreak() ; 
      }
    }
  set episodeNo( ep) {
    const validationResult = TvSeriesEpisode.checkEpisodeNo( ep);
    if (validationResult instanceof NoConstraintBreak) {
    this._episode = ep;
  } else {
    throw validationResult;
  }
}
}
/***********************************************
*** Class-level ("static") properties **********
************************************************/
TvSeriesEpisode.instances = {};
Movie.subtypes.push( TvSeriesEpisode);

/*********************************************************
*** Class-level ("static") storage management methods ****
**********************************************************/
/**
 * Create a new TvSeriesEpisode row
 * @method 
 * @static
 * @param {{movieId: number, tvSeriesName: string}} slots
 */
TvSeriesEpisode.add = function (slots) {
  var tvse = null;
  try {
	  tvse = new TvSeriesEpisode( slots);
  } catch (e) {
    console.log(`${e.constructor.tvSeriesName}: ${e.message}`);
    tvse = null;
  }
  if (tvse) {
    TvSeriesEpisode.instances[tvse.movieId] = tvse;
    console.log(`${tvse.toString()} created!`);
  }
};
/**
 * Update an existing TvSeriesEpisode row
 * @method 
 * @static
 * @param {{movieId: number, tvSeriesName: string}} slots - A record of parameters.
 */
TvSeriesEpisode.update = function ({movieId, tvSeriesName, episodeNo}) {
  const tvse = TvSeriesEpisode.instances[movieId],
        objectBeforeUpdate = cloneObject( tvse);
  var noConstraintBroken = true, updatedProperties = [];
  try {
    if (tvSeriesName && tvse.tvSeriesName !== tvSeriesName) {
      tvse.tvSeriesName = tvSeriesName;
      updatedProperties.push("tvSeriesName");
    }
    if (episodeNo && tvse.episodeNo !== episodeNo) {
  	  tvse.episodeNo = episodeNo;
      updatedProperties.push("episodeNo");
    }
  } catch (e) {
    console.log( e.constructor.tvSeriesName + ": " + e.message);
    noConstraintBroken = false;
    // restore object to its state before updating
    TvSeriesEpisode.instances[movieId] = objectBeforeUpdate;
  }
  if (noConstraintBroken) {
    if (updatedProperties.length > 0) {
      const ending = updatedProperties.length > 1 ? "ies" : "y";
      console.log(`Propert${ending} ${updatedProperties.toString()} modified for TvSeriesEpisode ${tvSeriesName}`);
    } else {
      console.log(`No property value changed for TvSeriesEpisode ${emp.tvSeriesName}!`);
    }
  }
};
/**
 * Delete an existing Employee row
 * @method 
 * @static
 * @param {string} movieId - The ID of a person.
 */
TvSeriesEpisode.destroy = function (movieId) {
  const tvSeriesName = TvSeriesEpisode.instances[movieId].tvSeriesName;
  delete TvSeriesEpisode.instances[movieId];
  console.log(`TvSeriesEpisode ${tvSeriesName} deleted.`);
};
/**
 *  Retrieve all tvSeriesEpisode objects as records
 */
TvSeriesEpisode.retrieveAll = function () {
  var tvSeriesEpisodes={};
  if (!localStorage["tvSeriesEpisodes"]) localStorage["tvSeriesEpisodes"] = "{}";
  try {
    tvSeriesEpisodes = JSON.parse( localStorage["tvSeriesEpisodes"]);
  } catch (e) {
    console.log("Error when reading from Local Storage\n" + e);
  }
  for (const key of Object.keys( tvSeriesEpisodes)) {
    try {  // convert record to (typed) object
      TvSeriesEpisode.instances[key] = new TvSeriesEpisode( tvSeriesEpisodes[key]);
      // create superclass extension
      Movie.instances[key] = TvSeriesEpisode.instances[key];
    } catch (e) {
      console.log(`${e.constructor.tvSeriesName} while deserializing tvSeriesEpisode ${key}: ${e.message}`);
    }
  }
  console.log(`${Object.keys( TvSeriesEpisode.instances).length} tvSeriesEpisode records loaded.`);
}
/**
 * Save all TvSeriesEpisode objects as rows
 * @method
 * @static
 */
TvSeriesEpisode.saveAll = function () {
  try {
    localStorage["tvSeriesEpisodes"] = JSON.stringify( TvSeriesEpisode.instances);
    console.log( Object.keys( TvSeriesEpisode.instances).length +" tvSeriesEpisode saved.");
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
  }
};

export default TvSeriesEpisode;
