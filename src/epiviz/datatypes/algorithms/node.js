/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 9/19/14
 * Time: 10:32 AM
 */

goog.require('epiviz.utils.generatePseudoGUID');

goog.provide('epiviz.datatypes.algorithms.Node');

/**
 * @constructor
 */
epiviz.datatypes.algorithms.Node = function() {
  /**
   * @type {?epiviz.datatypes.algorithms.Node}
   * @private
   */
  this._parent = null;

  /**
   * @type {Array.<epiviz.datatypes.algorithms.Node>}
   * @private
   */
  this._children = [];

  /**
   * @type {number}
   * @private
   */
  this._descendantCount = 0;

  /**
   * @type {number}
   * @private
   */
  this._heavyChildIndex = -1;

  /**
   * @type {string}
   * @private
   */
  this._id = epiviz.utils.generatePseudoGUID(5);
};

/**
 * @returns {epiviz.datatypes.algorithms.Node}
 */
epiviz.datatypes.algorithms.Node.prototype.parent = function() { return this._parent; };

/**
 * @returns {Array.<epiviz.datatypes.algorithms.Node>}
 */
epiviz.datatypes.algorithms.Node.prototype.children = function() { return this._children; };

/**
 * @returns {number}
 */
epiviz.datatypes.algorithms.Node.prototype.descendantCount = function() { return this._descendantCount; };

/**
 * @returns {?epiviz.datatypes.algorithms.Node}
 */
epiviz.datatypes.algorithms.Node.prototype.heavyChild = function() { return this._heavyChildIndex >= 0 ? this._children[this._heavyChildIndex] : null; };

/**
 * @returns {number}
 */
epiviz.datatypes.algorithms.Node.prototype.heavyChildIndex = function() { return this._heavyChildIndex; };

/**
 * @returns {string}
 */
epiviz.datatypes.algorithms.Node.prototype.id = function() { return this._id; };

/**
 * @returns {boolean}
 */
epiviz.datatypes.algorithms.Node.prototype.isHeavy = function() {
  return this._parent && this._parent.heavyChild() === this;
};

/**
 * A deep copy of the current node
 * @returns {epiviz.datatypes.algorithms.Node}
 */
epiviz.datatypes.algorithms.Node.prototype.copy = function() {
  var copy = new epiviz.datatypes.algorithms.Node();
  copy._parent = this._parent;
  copy._children = this._children.map(function(node) {
    var nodeCopy = node.copy();
    nodeCopy._parent = copy;
    return nodeCopy;
  });
  copy._descendantCount = this._descendantCount;
  copy._heavyChildIndex = this._heavyChildIndex;
  copy._id = this._id;
  return copy;
};

/**
 * @param {?epiviz.datatypes.algorithms.Node} parent
 * @returns {epiviz.datatypes.algorithms.Node}
 */
epiviz.datatypes.algorithms.Node.prototype.changeParent = function(parent) {
  if (parent === this._parent) { return this; }
  var copy = this.copy();
  copy._parent = parent;
  return copy;
};

/**
 * @returns {string}
 */
epiviz.datatypes.algorithms.Node.prototype.toString = function() {
  return this._id;
};

/**
 * @param {?epiviz.datatypes.algorithms.Node} node
 * @protected
 */
epiviz.datatypes.algorithms.Node.prototype._setParent = function(node) { this._parent = node; };

/**
 * @param {Array.<epiviz.datatypes.algorithms.Node>} nodes
 * @protected
 */
epiviz.datatypes.algorithms.Node.prototype._setChildren = function(nodes) { this._children = nodes; };

/**
 * @param {epiviz.datatypes.algorithms.Node} node
 * @protected
 */
epiviz.datatypes.algorithms.Node.prototype._pushToChildren = function(node) {
  if (!this._children) { this._children = []; }
  this._children.push(node);
};

/**
 * @param {number} count
 * @protected
 */
epiviz.datatypes.algorithms.Node.prototype._setDescendantCount = function(count) { this._descendantCount = count; };

/**
 * @param {number} index
 * @protected
 */
epiviz.datatypes.algorithms.Node.prototype._setHeavyChildIndex = function(index) { this._heavyChildIndex = index; };

/**
 * @param {string} id
 * @protected
 */
epiviz.datatypes.algorithms.Node.prototype._setId = function(id) { this._id = id; };
