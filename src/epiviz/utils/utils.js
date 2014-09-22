/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 9/19/14
 * Time: 12:23 PM
 */

goog.provide('epiviz.utils.generatePseudoGUID');
goog.provide('epiviz.utils.mapGet');
goog.provide('epiviz.utils.mapPut');
goog.provide('epiviz.utils.mapCopy');
goog.provide('epiviz.utils.mapCombine');


/**
 * @param {number} size
 * @returns {string}
 */
epiviz.utils.generatePseudoGUID = function(size) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';

  for (var i = 0; i < size; ++i) {
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }

  return result;
};

// Map

/**
 * @param {Object.<string, *>} o
 * @param {...string} arguments
 * @returns {*}
 */
epiviz.utils.mapGet = function(o) {
  if (arguments.length <= 1) { return undefined; }

  for (var i = 1; i < arguments.length; ++i) {
    if (!(arguments[i] in o)) { return undefined; }
    o = o[arguments[i]];
  }
  return o;
};

/**
 * @param {Object.<string, *>} o
 * @param {*} value
 * @param {...string} arguments
 */
epiviz.utils.mapPut = function(o, value) {
  if (arguments.length <= 2) { throw Error('No key specified'); }

  for (var i = 2; i < arguments.length - 1; ++i) {
    if (!(arguments[i] in o)) {
      o[arguments[i]] = {};
    }
    o = o[arguments[i]];
  }
  o[arguments[i]] = value;
};

/**
 * Creates a copy of the given map
 * @param {Object.<K, V>} map
 * @returns {Object.<K, V>}
 * @template K, V
 */
epiviz.utils.mapCopy = function(map) {
  var result = {};
  for (var key in map) {
    if (!map.hasOwnProperty(key)) { continue; }
    result[key] = map[key];
  }

  return result;
};

/**
 * Creates a new map that contains the keys of both m1 and m2.
 * If one key is in both maps, then the value from m1 will be used.
 * @param {Object<*,*>} m1
 * @param {Object<*,*>} m2
 * @returns {Object<*,*>}
 */
epiviz.utils.mapCombine = function(m1, m2) {
  var result = {};

  var key;

  if (m2) {
    for (key in m2) {
      if (!m2.hasOwnProperty(key)) { continue; }
      result[key] = m2[key];
    }
  }

  if (m1) {
    for (key in m1) {
      if (!m1.hasOwnProperty(key)) { continue; }
      result[key] = m1[key];
    }
  }

  return result;
};

// Math

/**
 * @param {...number} arguments
 * @returns {{min: number, index: number}}
 */
epiviz.utils.minIndex = function() {
  if (!arguments.length) { return {min: undefined, index: -1}; }
  var min = arguments[0], index = 0;
  for (var i = 1; i < arguments.length; ++i) {
    if (arguments[i] < min) {
      min = arguments[i];
      index = i;
    }
  }

  return {min: min, index: index};
};

/**
 * @param {...number} arguments
 * @returns {{max: number, index: number}}
 */
epiviz.utils.maxIndex = function() {
  if (!arguments.length) { return {min: undefined, index: -1}; }
  var max = arguments[0], index = 0;
  for (var i = 1; i < arguments.length; ++i) {
    if (arguments[i] > max) {
      max = arguments[i];
      index = i;
    }
  }

  return {max: max, index: index};
};
