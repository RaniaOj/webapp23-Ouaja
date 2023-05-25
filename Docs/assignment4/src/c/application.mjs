/**
 * @fileOverview  Defining the main namespace ("public library") and its MVC subnamespaces
 * @author Gerd Wagner
 */

import Person from "../m/Person.mjs";
import Movie from "../m/Movie.mjs";

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
      name: "Stephen Frears"
    });
    Person.instances["2"] = new Person({
        personId: 2,
        name: "George Lucas"
    });
    Person.instances["3"] = new Person({
        personId: 3,
        name: "Quentin Tarantino"
    });
    Person.instances["5"] = new Person({
        personId: 5,
        name: "Uma Thurman"
    });
    Person.instances["6"] = new Person({
        personId: 6,
        name: "John Travolta"
    });
    Person.instances["7"] = new Person({
        personId: 7,
        name: "Ewan McGregor"
    });
    Person.instances["8"] = new Person({
        personId: 8,
        name: "	Natalie Portman"
    });
    Person.instances["9"] = new Person({
        personId: 9,
        name: "	Keanu Reeves"
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
      director:"2",
      actor: "7, 8"
    });
    Movie.instances["3"] = new Movie({
      movieId: "3",
      title: "Dangerous Liaisons",
      releaseDate:"1988-12-16",
      director:"1",
      actor: "9, 5"
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
      Person.instances = {};
      localStorage["person"] = "{}";
      Movie.instances = {};
      localStorage["movie"] = "{}";
      console.log("All data cleared.");
    } catch (e) {
      console.log( `${e.constructor.name}: ${e.message}`);
    }
  }
}

export { generateTestData, clearData };
