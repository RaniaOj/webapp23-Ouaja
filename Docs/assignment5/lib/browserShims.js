/**
 * @fileOverview  Browser shims are extensions of built-in objects. Here, we extend
 * the built-in object "Array", representing a class, by adding two class-level
 * functions ("max" and "min"), and two instance-level functions ("clone" and "isEqualTo")
 * @author Gerd Wagner
 */
/**
 * Compute the max of an array
 * Notice that "apply" requires a context object, which is not really used
 * in the case of a static function such as Math.max
 */


//Clone an array

Array.prototype.clone = function () {
  return this.slice(0);
};
//Compute the max of an array

function getMaxOfArray (numArray) {
  return Math.max.apply( Math, numArray);
}; 

//Test if an array is equal to another one

Array.prototype.isEqualTo = function (a2) {
  return (this.length === a2.length) && this.every( function ( el, i) {
    return el === a2[i]; });
};
