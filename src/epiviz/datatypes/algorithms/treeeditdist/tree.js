/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 9/19/14
 * Time: 10:49 AM
 */

goog.require('epiviz.datatypes.algorithms.treeeditdist.Node');

goog.provide('epiviz.datatypes.algorithms.treeeditdist.Tree');

/**
 * @constructor
 */
epiviz.datatypes.algorithms.treeeditdist.Tree = function(root) {
  /**
   * @type {?epiviz.datatypes.algorithms.treeeditdist.Node}
   * @private
   */
  this._root = root;

  /**
   * Computed lazily
   * @type {?Array.<epiviz.datatypes.algorithms.treeeditdist.Node>}
   * @private
   */
  this._heavyPath = null;

  /**
   * Computed lazily
   * @type {?Array.<epiviz.datatypes.algorithms.treeeditdist.Node>}
   * @private
   */
  this._topLight = null;

  /**
   * Computed lazily
   * @type {Object.<string, epiviz.datatypes.algorithms.treeeditdist.Node>}
   * @private
   */
  this._nodeMap = null;
};

/**
 * @type {epiviz.datatypes.algorithms.treeeditdist.Tree}
 */
epiviz.datatypes.algorithms.treeeditdist.Tree.EMPTY = new epiviz.datatypes.algorithms.treeeditdist.Tree(null);

/**
 * @returns {?epiviz.datatypes.algorithms.treeeditdist.Node}
 */
epiviz.datatypes.algorithms.treeeditdist.Tree.prototype.root = function() { return this._root; };

/**
 * @returns {number}
 */
epiviz.datatypes.algorithms.treeeditdist.Tree.prototype.size = function() { return !this._root ? 0 : this._root.descendantCount() + 1; };

/**
 * @returns {boolean}
 */
epiviz.datatypes.algorithms.treeeditdist.Tree.prototype.isEmpty = function() { return !this._root; };

/**
 * @returns {string}
 */
epiviz.datatypes.algorithms.treeeditdist.Tree.prototype.id = function() { return this.isEmpty() ? 'empty-tree' : this._root.id(); };

/**
 * @param {string} id
 * @returns {epiviz.datatypes.algorithms.treeeditdist.Node}
 */
epiviz.datatypes.algorithms.treeeditdist.Tree.prototype.get = function(id) {
  if (!this._nodeMap) {
    this._nodeMap = {};
    this.dfs(function(node) {
      this._nodeMap[node.id()] = node;
    });
  }

  return this._nodeMap[id];
};

/**
 * @returns {Array.<epiviz.datatypes.algorithms.treeeditdist.Node>}
 */
epiviz.datatypes.algorithms.treeeditdist.Tree.prototype.heavyPath = function() {
  if (!this._heavyPath) {
    var pair = epiviz.datatypes.algorithms.treeeditdist.Tree._weigh(this);
    this._heavyPath = pair.heavyPath;
    this._topLight = pair.topLight;
  }
  return this._heavyPath;
};

/**
 * @returns {Array.<epiviz.datatypes.algorithms.treeeditdist.Node>}
 */
epiviz.datatypes.algorithms.treeeditdist.Tree.prototype.topLight = function() {
  if (!this._topLight) {
    var pair = epiviz.datatypes.algorithms.treeeditdist.Tree._weigh(this);
    this._heavyPath = pair.heavyPath;
    this._topLight = pair.topLight;
  }
  return this._topLight;
};

/**
 * Iterates through all tree using the DFS algorithm.
 * @param {function(epiviz.datatypes.algorithms.treeeditdist.Node, number)} callback A function called for each node in the tree;
 *   the second parameter is the level (depth) of the node in the tree.
 */
epiviz.datatypes.algorithms.treeeditdist.Tree.prototype.dfs = function(callback) {
  var recursion = function(node, level) {
    callback(node, level);
    node.children().forEach(function(child) {
      recursion(child, level + 1);
    });
  };
  recursion(this._root, 0);
};

epiviz.datatypes.algorithms.treeeditdist.Tree.prototype.toString = function() {
  var ret = '';
  var prefix = [];
  this.dfs(function(node, level) {
    var isFirstChild = level > 0 && node.parent().children()[0] == node;
    var isLastChild = level > 0 && node.parent().children()[node.parent().children().length - 1] == node;

    if (isFirstChild) {
      prefix = prefix.map(function(chr) {
        return (chr == ' ├') ? ' │' : chr;
      });
      prefix.push(' ├');
    }
    if (isLastChild) {
      var lastCornerIndex = prefix.lastIndexOf(' ├');
      prefix[lastCornerIndex] = ' └';
      while (prefix.length > lastCornerIndex + 1) { prefix.pop(); }
    }

    ret += '\n' + prefix.join('') +
      ((node.children().length || !level) ? '' : '─')
      + node.toString();
    if (isLastChild) {
      if (node.children().length > 0) { prefix[prefix.length - 1] = ' '; }
      else { prefix.pop(); }
      prefix[prefix.lastIndexOf(' │')] = ' ├';
    }
  });

  return ret;
};

/**
 * @param {epiviz.datatypes.algorithms.treeeditdist.Tree} tree
 * @returns {{heavyPath: Array.<epiviz.datatypes.algorithms.treeeditdist.Node>, topLight: Array.<epiviz.datatypes.algorithms.treeeditdist.Node>}}
 * @private
 */
epiviz.datatypes.algorithms.treeeditdist.Tree._weigh = function(tree) {
  if (tree.isEmpty()) { return { heavyPath: [], topLight: [] }; }

  /** @type {Array.<epiviz.datatypes.algorithms.treeeditdist.Node>} */
  var heavyPath = [tree.root()];

  /** @type {Array.<epiviz.datatypes.algorithms.treeeditdist.Node>} */
  var topLight = [];

  /** @type {epiviz.datatypes.algorithms.treeeditdist.Node} */
  var lastNode = heavyPath[0];
  while (lastNode.children().length) {
    var heavyChildIndex = lastNode.heavyChildIndex();

    lastNode.children().forEach(function(node, i) {
      if (i == heavyChildIndex) {
        heavyPath.push(node);
        lastNode = node;
      } else {
        topLight.push(node);
      }
    });
  }

  return { heavyPath: heavyPath, topLight: topLight };
};
