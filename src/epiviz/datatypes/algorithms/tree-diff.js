/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 9/21/14
 * Time: 11:47 AM
 */

goog.provide('epiviz.datatypes.algorithms.TreeDiff');

/**
 * @param {number} cost
 * @param {Object.<string, string>} labels
 * @constructor
 * @struct
 */
epiviz.datatypes.algorithms.TreeDiff = function(cost, labels) {
  /** @type {number} */
  this.cost = cost;

  /** @type {Object.<string, string>} */
  this.labels = labels;
};

/**
 * @param {number} cost
 * @param {string} labelKey
 * @param {string} labelValue
 */
epiviz.datatypes.algorithms.TreeDiff.prototype.add = function(cost, labelKey, labelValue) {
  var labels = epiviz.utils.mapCopy(this.labels);
  labels[labelKey] = labelValue;
  return new epiviz.datatypes.algorithms.TreeDiff(this.cost + cost, labels);
};

/**
 * @param {epiviz.datatypes.algorithms.TreeDiff} diff1
 * @param {epiviz.datatypes.algorithms.TreeDiff} diff2
 * @returns {epiviz.datatypes.algorithms.TreeDiff}
 */
epiviz.datatypes.algorithms.TreeDiff.combine = function(diff1, diff2) {
  return new epiviz.datatypes.algorithms.TreeDiff(diff1.cost + diff2.cost, epiviz.utils.mapCombine(diff1.labels, diff2.labels));
};

/**
 * @param {...epiviz.datatypes.algorithms.TreeDiff} arguments
 * @returns {epiviz.datatypes.algorithms.TreeDiff}
 */
epiviz.datatypes.algorithms.TreeDiff.min = function() {
  if (!arguments.length) { return undefined; }

  var min = arguments[0];

  for (var i = 1; i < arguments.length; ++i) {
    if (arguments[i].cost < min.cost) { min = arguments[i]; }
  }

  return min;
};
