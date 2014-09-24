/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 9/19/14
 * Time: 10:47 AM
 */

goog.require('epiviz.utils.mapGet');
goog.require('epiviz.utils.mapPut');
goog.require('epiviz.utils.mapCombine');

goog.require('epiviz.datatypes.algorithms.treeeditdist.Node');
goog.require('epiviz.datatypes.algorithms.treeeditdist.Tree');
goog.require('epiviz.datatypes.algorithms.treeeditdist.Forest');

goog.require('epiviz.datatypes.algorithms.treeeditdist.TreeDiff');

goog.provide('epiviz.datatypes.algorithms.treeeditdist.TreeComparer');

/**
 * @constructor
 */
epiviz.datatypes.algorithms.treeeditdist.TreeComparer = function() {};

/**
 * @constant
 * @type {string}
 */
epiviz.datatypes.algorithms.treeeditdist.TreeComparer.DELETED = 'deleted';

/**
 * @param {epiviz.datatypes.algorithms.treeeditdist.Tree} tree1
 * @param {epiviz.datatypes.algorithms.treeeditdist.Tree} tree2
 * @param {{
 *   deleted: function(epiviz.datatypes.algorithms.treeeditdist.Node): number,
 *   match: function(epiviz.datatypes.algorithms.treeeditdist.Node, epiviz.datatypes.algorithms.treeeditdist.Node): number
 * }} costCalculator
 * @returns {epiviz.datatypes.algorithms.treeeditdist.TreeDiff}
 */
epiviz.datatypes.algorithms.treeeditdist.TreeComparer.prototype.diff = function(tree1, tree2, costCalculator) {
  return this._diff(new epiviz.datatypes.algorithms.treeeditdist.Forest([tree1]), new epiviz.datatypes.algorithms.treeeditdist.Forest([tree2]), {}, costCalculator);
};

/**
 * @param {epiviz.datatypes.algorithms.treeeditdist.Forest} f
 * @param {epiviz.datatypes.algorithms.treeeditdist.Forest} g
 * @param {Object.<string, Object.<string, epiviz.datatypes.algorithms.treeeditdist.TreeDiff>>} computedDiffs
 * @param {{
 *   deleted: function(epiviz.datatypes.algorithms.treeeditdist.Node): number,
 *   match: function(epiviz.datatypes.algorithms.treeeditdist.Node, epiviz.datatypes.algorithms.treeeditdist.Node): number
 * }} costCalc
 * @returns {epiviz.datatypes.algorithms.treeeditdist.TreeDiff}
 * @private
 */
epiviz.datatypes.algorithms.treeeditdist.TreeComparer.prototype._diff = function(f, g, computedDiffs, costCalc) {
  var diff = epiviz.utils.mapGet(computedDiffs, f.id(), g.id());
  if (diff != undefined) { return diff; }
  if (f.size() < g.size()) { return this._diff(g, f, computedDiffs, costCalc); }
  if (f.isEmpty() && g.isEmpty()) {
    diff = new epiviz.datatypes.algorithms.treeeditdist.TreeDiff(0, {});
    epiviz.utils.mapPut(computedDiffs, diff, f.id(), g.id());
    return diff;
  }

  /** @type {string} */
  var DELETED = epiviz.datatypes.algorithms.treeeditdist.TreeComparer.DELETED;

  /** @type {Array.<epiviz.datatypes.algorithms.treeeditdist.Forest>} */
  var topLightForests =
    f.trees()
      .map(function(tree) { return tree.topLight(); })
      .reduce(function(path1, path2) {
        return path1.concat(path2);
      })
      .map(function(root) {
        return new epiviz.datatypes.algorithms.treeeditdist.Forest(
          [new epiviz.datatypes.algorithms.treeeditdist.Tree(root)]);
      });

  var self = this;

  // Compute diffs for all top light forests and g
  topLightForests.forEach(function(forest) { self._diff(forest, g, computedDiffs, costCalc); });

  /** @type {function(epiviz.datatypes.algorithms.treeeditdist.Forest):epiviz.datatypes.algorithms.treeeditdist.Forest} */
  var removeFirstRoot;
  /** @type {function(epiviz.datatypes.algorithms.treeeditdist.Forest):epiviz.datatypes.algorithms.treeeditdist.Forest} */
  var removeFirstTree;
  /** @type {function(epiviz.datatypes.algorithms.treeeditdist.Forest):epiviz.datatypes.algorithms.treeeditdist.Node} */
  var firstRoot;
  /** @type {function(epiviz.datatypes.algorithms.treeeditdist.Forest):epiviz.datatypes.algorithms.treeeditdist.Forest} */
  var firstSubforest;

  if (f.trees().length == 1 || !f.trees()[0].root().isHeavy()) {
    // Left strategy
    removeFirstRoot = function(forest) { return forest.removeRootAt(0); };
    firstRoot = function(forest) { return forest.trees()[0].root(); };
    firstSubforest = function(forest) {
      return new epiviz.datatypes.algorithms.treeeditdist.Forest(
        forest.trees()[0].root().children().map(function(node) {
          return new epiviz.datatypes.algorithms.treeeditdist.Tree(node);
        }));
    };
    removeFirstTree = function(forest) { return forest.removeAt(0); };
  } else {
    // Right strategy
    removeFirstRoot = function(forest) { return forest.removeRootAt(forest.trees().length - 1); };
    firstRoot = function(forest) { return forest.trees()[forest.trees().length - 1].root(); };
    firstSubforest = function(forest) {
      return new epiviz.datatypes.algorithms.treeeditdist.Forest(
        forest.trees()[forest.trees().length - 1].root().children().map(function(node) {
          return new epiviz.datatypes.algorithms.treeeditdist.Tree(node);
        }));
    };
    removeFirstTree = function(forest) { return forest.removeAt(forest.trees().length - 1); };
  }

  if (g.isEmpty()) {
    /** @type {epiviz.datatypes.algorithms.treeeditdist.Forest} */
    var subforest = removeFirstRoot(f);

    // cost of deleting firstRoot
    /** @type {epiviz.datatypes.algorithms.treeeditdist.TreeDiff} */
    diff = this._diff(subforest, g, computedDiffs, costCalc)
      .add(costCalc.deleted(firstRoot(f)), firstRoot(f).id(), DELETED);

    epiviz.utils.mapPut(computedDiffs, diff, f.id(), g.id());

    return diff;
  }

  var diff3 = epiviz.datatypes.algorithms.treeeditdist.TreeDiff.combine(
    this._diff(firstSubforest(f), firstSubforest(g), computedDiffs, costCalc),
    this._diff(removeFirstTree(f), removeFirstTree(g), computedDiffs, costCalc))
    .add(costCalc.match(firstRoot(f), firstRoot(g)), firstRoot(f).id(), firstRoot(g).id())
    .add(0, firstRoot(g).id(), firstRoot(f).id());

  // Optimization: if the diff is already 0, don't compute the others
  if (diff3.cost == 0) {
    epiviz.utils.mapPut(computedDiffs, diff3, f.id(), g.id());
    epiviz.utils.mapPut(computedDiffs, diff3, g.id(), f.id());
    return diff3;
  }

  /** @type {epiviz.datatypes.algorithms.treeeditdist.TreeDiff} */
  var diff1 = this._diff(removeFirstRoot(f), g, computedDiffs, costCalc)
    .add(costCalc.deleted(firstRoot(f)), firstRoot(f).id(), DELETED);

  /** @type {epiviz.datatypes.algorithms.treeeditdist.TreeDiff} */
  var diff2 = this._diff(f, removeFirstRoot(g), computedDiffs, costCalc)
    .add(costCalc.deleted(firstRoot(g)), firstRoot(g).id(), DELETED);

  diff = epiviz.datatypes.algorithms.treeeditdist.TreeDiff.min(diff1, diff2, diff3);
  epiviz.utils.mapPut(computedDiffs, diff, f.id(), g.id());
  epiviz.utils.mapPut(computedDiffs, diff, g.id(), f.id());
  return diff;
};

