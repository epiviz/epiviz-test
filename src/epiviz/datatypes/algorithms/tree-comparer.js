/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 9/19/14
 * Time: 10:47 AM
 */

goog.require('epiviz.utils.mapGet');
goog.require('epiviz.utils.mapPut');
goog.require('epiviz.utils.mapCombine');

goog.require('epiviz.datatypes.algorithms.Node');
goog.require('epiviz.datatypes.algorithms.Tree');
goog.require('epiviz.datatypes.algorithms.Forest');

goog.require('epiviz.datatypes.algorithms.TreeDiff');

goog.provide('epiviz.datatypes.algorithms.TreeComparer');

/**
 * @constructor
 */
epiviz.datatypes.algorithms.TreeComparer = function() {};

/**
 * @constant
 * @type {string}
 */
epiviz.datatypes.algorithms.TreeComparer.DELETED = 'deleted';

/**
 * @param {epiviz.datatypes.algorithms.Tree} tree1
 * @param {epiviz.datatypes.algorithms.Tree} tree2
 * @returns {epiviz.datatypes.algorithms.TreeDiff}
 */
epiviz.datatypes.algorithms.TreeComparer.prototype.diff = function(tree1, tree2) {
  return this._diff(new epiviz.datatypes.algorithms.Forest([tree1]), new epiviz.datatypes.algorithms.Forest([tree2]), {});
};

/**
 * @param {epiviz.datatypes.algorithms.Forest} f
 * @param {epiviz.datatypes.algorithms.Forest} g
 * @param {Object.<string, Object.<string, epiviz.datatypes.algorithms.TreeDiff>>} computedDiffs
 * @returns {epiviz.datatypes.algorithms.TreeDiff}
 * @private
 */
epiviz.datatypes.algorithms.TreeComparer.prototype._diff = function(f, g, computedDiffs) {
  var diff = epiviz.utils.mapGet(computedDiffs, f.id(), g.id());
  if (diff != undefined) { return diff; }
  if (f.size() < g.size()) { return this._diff(g, f, computedDiffs); }
  if (f.isEmpty() && g.isEmpty()) {
    diff = new epiviz.datatypes.algorithms.TreeDiff(0, {});
    epiviz.utils.mapPut(computedDiffs, diff, f.id(), g.id());
    return diff;
  }

  /** @type {Array.<epiviz.datatypes.algorithms.Forest>} */
  var topLightForests =
    f.trees()
      .map(function(tree) { return tree.topLight(); })
      .reduce(function(path1, path2) {
        return path1.concat(path2);
      })
      .map(function(root) {
        return new epiviz.datatypes.algorithms.Forest(
          [new epiviz.datatypes.algorithms.Tree(root)]);
      });

  var self = this;

  // Compute diffs for all top light forests and g
  topLightForests.forEach(function(forest) { self._diff(forest, g, computedDiffs); });

  /** @type {function(epiviz.datatypes.algorithms.Forest):epiviz.datatypes.algorithms.Forest} */
  var removeFirstRoot;
  /** @type {function(epiviz.datatypes.algorithms.Forest):epiviz.datatypes.algorithms.Forest} */
  var removeFirstTree;
  /** @type {function(epiviz.datatypes.algorithms.Forest):epiviz.datatypes.algorithms.Node} */
  var firstRoot;
  /** @type {function(epiviz.datatypes.algorithms.Forest):epiviz.datatypes.algorithms.Forest} */
  var firstSubforest;

  if (f.trees().length == 1 || !f.trees()[0].root().isHeavy()) {
    // Left strategy
    removeFirstRoot = function(forest) { return forest.removeRootAt(0); };
    firstRoot = function(forest) { return forest.trees()[0].root(); };
    firstSubforest = function(forest) {
      return new epiviz.datatypes.algorithms.Forest(
        forest.trees()[0].root().children().map(function(node) {
          return new epiviz.datatypes.algorithms.Tree(node);
        }));
    };
    removeFirstTree = function(forest) { return forest.removeAt(0); };
  } else {
    // Right strategy
    removeFirstRoot = function(forest) { return forest.removeRootAt(forest.trees().length - 1); };
    firstRoot = function(forest) { return forest.trees()[forest.trees().length - 1].root(); };
    firstSubforest = function(forest) {
      return new epiviz.datatypes.algorithms.Forest(
        forest.trees()[forest.trees().length - 1].root().children().map(function(node) {
          return new epiviz.datatypes.algorithms.Tree(node);
        }));
    };
    removeFirstTree = function(forest) { return forest.removeAt(forest.trees().length - 1); };
  }

  if (g.isEmpty()) {
    /** @type {epiviz.datatypes.algorithms.Forest} */
    var subforest = removeFirstRoot(f);

    // cost of deleting firstRoot
    /** @type {epiviz.datatypes.algorithms.TreeDiff} */
    diff = this._diff(subforest, g, computedDiffs).add(1, firstRoot(f).id(), epiviz.datatypes.algorithms.TreeComparer.DELETED);

    epiviz.utils.mapPut(computedDiffs, diff, f.id(), g.id());

    return diff;
  }

  /** @type {epiviz.datatypes.algorithms.TreeDiff} */
  var diff1 = this._diff(removeFirstRoot(f), g, computedDiffs).add(1, firstRoot(f).id(), epiviz.datatypes.algorithms.TreeComparer.DELETED);

  /** @type {epiviz.datatypes.algorithms.TreeDiff} */
  var diff2 = this._diff(f, removeFirstRoot(g), computedDiffs).add(1, firstRoot(g).id(), epiviz.datatypes.algorithms.TreeComparer.DELETED);

  var diff3 = epiviz.datatypes.algorithms.TreeDiff.combine(
    this._diff(firstSubforest(f), firstSubforest(g), computedDiffs),
    this._diff(removeFirstTree(f), removeFirstTree(g), computedDiffs))
      .add(0, firstRoot(f).id(), firstRoot(g).id());

  diff = epiviz.datatypes.algorithms.TreeDiff.min(diff1, diff2, diff3);
  epiviz.utils.mapPut(computedDiffs, diff, f.id(), g.id());
  epiviz.utils.mapPut(computedDiffs, diff, g.id(), f.id());
  return diff;
};

