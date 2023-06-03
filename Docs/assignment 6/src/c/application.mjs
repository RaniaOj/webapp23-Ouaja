/**
 * @fileOverview  Defining the main namespace ("public library") and its MVC subnamespaces
 * @author Gerd Wagner
 */

import Person, {RoleEL} from "../m/Person.mjs";
import Movie, {MovieCategoryEl} from "../m/Movie.mjs";

/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
/**
 *  Create and save test data
 */
function generateTestData() {
  try {
    Person.instances["1"] = new Person({
      personId: 1,
      name: "Stephen Frears",
      role: RoleEL.DIRECTOR
    });
    Person.instances["2"] = new Person({
        personId: 2,
        name: "George Lucas",
        role: RoleEL.DIRECTOR
    });
    Person.instances["3"] = new Person({
        personId: 3,
        name: "Quentin Tarantino",
        role: RoleEL.DIRECTOR,
        role: RoleEL.ACTOR 
    });
    Person.instances["4"] = new Person({
        personId: 4,
        name: "Uma Thurman",
        role: RoleEL.ACTOR,
        agent: "15"
    });
    Person.instances["5"] = new Person({
        personId: 5,
        name: "John Travolta",
        role: RoleEL.ACTOR
    });
    Person.instances["6"] = new Person({
        personId: 6,
        name: "Ewan McGregor",
        role: RoleEL.ACTOR
    });
    Person.instances["7"] = new Person({
        personId: 7,
        name: "Natalie Portman",
        role: RoleEL.ACTOR
    });
    Person.instances["8"] = new Person({
        personId: 8,
        name: "Keanu Reeves",
        role: RoleEL.ACTOR,
        agent: "16"
    });
    Person.instances["9"] = new Person({
      personId: 9,
      name: "Russell Crowe Reeves",
      role: RoleEL.DIRECTOR,
      role: RoleEL.ACTOR,
      agent: "16"
    });
    Person.instances["10"] = new Person({
      personId: 10,
      name: "Seth MacFarlane",
      role: RoleEL.ACTOR
    });
    Person.instances["11"] = new Person({
      personId: 11,
      name: "Naomi Watts",
      role: RoleEL.ACTOR
    });
    Person.instances["12"] = new Person({
      personId: 12,
      name: "Ed Harris",
      role: RoleEL.ACTOR
    });
    Person.instances["13"] = new Person({
      personId: 13,
      name: "Marc Forster",
      role: RoleEL.DIRECTOR
    });
    Person.instances["14"] = new Person({
      personId: 14,
      name: "John Forbes Nash"
    });
    Person.instances["15"] = new Person({
      personId: 15,
      name: "John Doe"
    });
    Person.instances["16"] = new Person({
      personId: 16,
      name: "Jane Doe"
    });
    Person.saveAll();

    Movie.instances["1"] = new Movie({
      movieId: "1",
      title: "Pulp Fiction",
      releaseDate:"1994-05-12",
      director:"3",
      actor: "3, 5, 6"
    });
    Movie.instances["2"] = new Movie({
      movieId: "2",
      title: "Star Wars",
      releaseDate:"1977-05-25",
      director: "2",
      actor: "7, 8"
    });
    Movie.instances["3"] = new Movie({
      movieId: "3",
      title: "Dangerous Liaisons",
      releaseDate:"1988-12-16",
      director: "1",
      actor: "8, 4"
    });
    Movie.instances["4"] = new Movie({
      movieId: "4",
      title: "2015",
      releaseDate:"2019-06-30",
      director:"1",
      actor: "9, 10, 11",
      category: MovieCategoryEl.TVSERIEEPISODE,
      TvSeriesName: "The Loudest Voice",
      EpisodeNo: "6"
    });
    Movie.instances["5"] = new Movie({
      movieId: "5",
      title: "A Beautiful Mind",
      releaseDate:"2001-12-21",
      director: "9",
      actor: "9, 12",
      category: MovieCategoryEl.BIOGRAPHY,
      about: "14"
    });
    Movie.instances["6"] = new Movie({
      movieId: "6",
      title: "Stay",
      releaseDate:"2005-09-24",
      director: "13",
      actor: "6, 11"
    });
    Movie.saveAll();
  }catch (e) {
    console.log(`${e.constructor.name} : ${e.message}`);
  }
};
/**
 * Clear data
 */
function clearData() {
  if (confirm( "Do you really want to delete the entire database?")) {
    try {
      [Person, Movie].forEach(Class => {
        Class.instances = {};
      });
      localStorage["persons"] = "{}";
      localStorage["movies"] = "{}";
      console.log("All data cleared.");
    } catch (e) {
      console.log(`${e.constructor.name}: ${e.message}`);
    }
  }
}

export { generateTestData, clearData };
