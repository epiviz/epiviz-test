/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 9/19/14
 * Time: 10:51 AM
 */

goog.require('epiviz.datatypes.algorithms.Tree');
goog.provide('epiviz.datatypes.algorithms.Forest');

/**
 * @param {Array.<epiviz.datatypes.algorithms.Tree>} trees
 * @constructor
 */
epiviz.datatypes.algorithms.Forest = function(trees) {
  /**
   * @type {Array.<epiviz.datatypes.algorithms.Tree>}
   * @private
   */
  this._trees = trees.filter(function(tree) { return !tree.isEmpty(); });

  /**
   * Computed lazily
   * @type {?number}
   * @private
   */
  this._size = null;

  /**
   * Computed lazily
   * @type {?string}
   * @private
   */
  this._id = null;
};

/**
 * @type {epiviz.datatypes.algorithms.Forest}
 */
epiviz.datatypes.algorithms.Forest.EMPTY = new epiviz.datatypes.algorithms.Forest([]);

epiviz.datatypes.algorithms.Forest.prototype.trees = function() { return this._trees; };

/**
 * @returns {boolean}
 */
epiviz.datatypes.algorithms.Forest.prototype.isEmpty = function() { return !this._trees.length; };

/**
 * @returns {number}
 */
epiviz.datatypes.algorithms.Forest.prototype.size = function() {
  if (this._size === null) {
    this._size = !this._trees.length ? 0 :
      this._trees
      .map(function(tree) { return tree.size(); })
      .reduce(function(size1, size2) { return size1 + size2; });
  }
  return this._size;
};

/**
 * @returns {string}
 */
epiviz.datatypes.algorithms.Forest.prototype.id = function() {
  if (this._id === null) {
    this._id = !this._trees.length ? 'empty-forest' :
      this._trees
        .map(function(tree) { return tree.id(); })
        .reduce(function(id1, id2) { return id1 + ',' + id2; });
  }
  return this._id;
};

/**
 * Creates a copy of the forest without the tree at the given index
 * @param {number} index
 * @returns {epiviz.datatypes.algorithms.Forest}
 */
epiviz.datatypes.algorithms.Forest.prototype.removeAt = function(index) {
  if (index < 0 || index >= this._trees.length) { return this; }
  var trees = this._trees.slice(0);
  trees.splice(index, 1);
  return new epiviz.datatypes.algorithms.Forest(trees);
};

/**
 * Creates a copy of the forest without the root of the tree at the given index
 * @param {number} index
 * @returns {epiviz.datatypes.algorithms.Forest}
 */
epiviz.datatypes.algorithms.Forest.prototype.removeRootAt = function(index) {
  if (index < 0 || index >= this._trees.length) { return this; }
  var trees = this._trees.slice(0);
  var subtreesOfTree = this._trees[index].root().children().map(function(node) {
    return new epiviz.datatypes.algorithms.Tree(
      node.changeParent(trees[index].root().parent()));
  });
  Array.prototype.splice.apply(trees, [index, 1].concat(subtreesOfTree));
  return new epiviz.datatypes.algorithms.Forest(trees);
};
