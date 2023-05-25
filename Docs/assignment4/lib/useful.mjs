/**
 * @fileOverview  Defines utility procedures/functions   
 * @author Gerd Wagner
 */

/**
* Verifies if a value represents an integer
* @param {number} x
* @return {boolean}
*/
function isNonEmptyString(x) {
  return typeof(x) === "string" && x.trim() !== "";
}
/**
* Verifies if a value represents an integer or integer string
* @param {string} x
* @return {boolean}
*/
function isIntegerOrIntegerString(x) {
  return typeof(x) === "number" && Number.isInteger(x) ||
      typeof(x) === "string" && x.search(/^-?[0-9]+$/) === 0;
}
/**
 * Creates a "clone" of an object that is an instance of a model class
 *
 * @param {object} obj
 */
function cloneObject( obj) {
  var p="", val,
      clone = Object.create( Object.getPrototypeOf(obj));
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      val = obj[p];
      if (typeof val === "number" ||
          typeof val === "string" ||
          typeof val === "boolean" ||
          val instanceof Date ||
          // typed object reference
          typeof val === "object" && !!val.constructor ||
          // list of data values
          Array.isArray( val) &&
            !val.some( function (el) {
              return typeof el === "object";
            }) ||
          // list of typed object references
          Array.isArray( val) &&
            val.every( function (el) {
              return (typeof el === "object" && !!el.constructor);
            })
          ) {
        if (Array.isArray( val)) clone[p] = val.slice(0);
        else clone[p] = val;
      }
      // else clone[p] = cloneObject(val);
    }
  }
  return clone;
}
/**
 * Fill a select element with option elements created from a
 * map of objects
 *
 * @param {object} selectEl  A select(ion list) element
 * @param {object|array} selectionRange  A map of objects or an array list
 * @param {object} optPar [optional]  An optional parameter record including
 *     optPar.displayProp and optPar.selection
 */
function fillSelectWithOptions( selectEl, selectionRange, optPar) {
  // create option elements from object property values
  const options = Array.isArray( selectionRange) ? selectionRange :
      Object.keys( selectionRange);
  // delete old contents
  selectEl.innerHTML = "";
  // create "no selection yet" entry
  if (!selectEl.multiple) {
    optionEl = createOption( i=0, options[i]);
  }
  for (const i of options.keys()) {
    let optionEl=null;
    if (Array.isArray( selectionRange)) {
      optionEl = createOption( i+1, options[i]);
      if (selectEl.multiple && optPar && optPar.selection &&
          optPar.selection.includes(i+1)) {
        // flag the option element with this value as selected
        optionEl.selected = true;
      }
    } else {
      const key = options[i];
      const obj = selectionRange[key];
      if (optPar && optPar.displayProp) {
        optionEl = createOption( key, obj[optPar.displayProp]);
      } else optionEl = createOption( key);
      // if invoked with a selection argument, flag the selected options
      if (selectEl.multiple && optPar && optPar.selection &&
          optPar.selection[key]) {
        // flag the option element with this value as selected
        optionEl.selected = true;
      }
    }
    selectEl.add( optionEl);
  }
}

/**
 * * Create a choice control (radio button or checkbox) element
 *
 * @param {string} t  The type of choice control ("radio" or "checkbox")
 * @param {string} n  The name of the choice control input element
 * @param {string} v  The value of the choice control input element
 * @param {string} lbl  The label text of the choice control
 * @return {object}
 */
function createLabeledChoiceControl( t,n,v,lbl) {
  var ccEl = document.createElement("input"),
    lblEl = document.createElement("label");
  ccEl.type = t;
  ccEl.name = n;
  ccEl.value = v;
  lblEl.appendChild( ccEl);
  lblEl.appendChild( document.createTextNode( lbl));
  return lblEl;
}
/**
 * Create a choice widget in a given fieldset element.
 * A choice element is either an HTML radio button or an HTML checkbox.
 * @method
 */
function createChoiceWidget( containerEl, fld, values,
                             choiceWidgetType, choiceItems, isMandatory) {
  const choiceControls = containerEl.querySelectorAll("label");
  // remove old content
  for (const j of choiceControls.keys()) {
    containerEl.removeChild( choiceControls[j]);
  }
  if (!containerEl.hasAttribute("data-bind")) {
    containerEl.setAttribute("data-bind", fld);
  }
  // for a radio button group initialze to first value
  if (choiceWidgetType === "radio" && values.length === 0) {
  values[0] = 1;
  }
  if (values.length >= 1) {
    if (choiceWidgetType === "radio") {
      containerEl.setAttribute("data-value", values[0]);
    }
  }
  for (const j of choiceItems.keys()) {
    // mark the radio button or checkbox as selected/checked
    if (values.includes(j+1)) el.firstElementChild.checked = true;
    containerEl.appendChild( el);
    el.firstElementChild.addEventListener("click", function (e) {
      const btnEl = e.target;
      if (choiceWidgetType === "radio") {
        if (containerEl.getAttribute("data-value") !== btnEl.value) {
          containerEl.setAttribute("data-value", btnEl.value);
        } else if (!isMandatory) {
          // turn off radio button
          btnEl.checked = false;
          containerEl.setAttribute("data-value", "");
        }
      }
    });
  }
  return containerEl;
}

export { isNonEmptyString, isIntegerOrIntegerString, cloneObject,
  fillSelectWithOptions, createChoiceWidget };
