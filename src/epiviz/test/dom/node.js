/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 9/18/14
 * Time: 2:57 PM
 */

goog.require('epiviz.datatypes.algorithms.treeeditdist.Node');

goog.require('epiviz.utils.mapCopy');

goog.provide('epiviz.test.dom.Node');

/**
 * @param {HTMLElement} element
 * @extends {epiviz.datatypes.algorithms.treeeditdist.Node}
 * @constructor
 */
epiviz.test.dom.Node = function(element) {
  // Call superclass constructor
  epiviz.datatypes.algorithms.treeeditdist.Node.call(this);

  /**
   * @type {HTMLElement}
   * @private
   */
  this._element = element;
};

/*
 * Copy methods from upper class
 */
epiviz.test.dom.Node.prototype = epiviz.utils.mapCopy(epiviz.datatypes.algorithms.treeeditdist.Node.prototype);
epiviz.test.dom.Node.constructor = epiviz.test.dom.Node;

/**
 * @returns {HTMLElement}
 */
epiviz.test.dom.Node.prototype.element = function() { return this._element; };

/**
 * @returns {string}
 */
epiviz.test.dom.Node.prototype.elementName = function() { return $(this._element).prop("tagName"); };

/**
 * @returns {number}
 */
epiviz.test.dom.Node.prototype.pageX = function() { return $(this._element).offset().left; };

/**
 * @returns {number}
 */
epiviz.test.dom.Node.prototype.pageY = function() { return $(this._element).offset().top; };

/**
 * @returns {number}
 */
epiviz.test.dom.Node.prototype.width = function() { return $(this._element).width(); };

/**
 * @returns {number}
 */
epiviz.test.dom.Node.prototype.height = function() { return $(this._element).height(); };

/**
 * @returns {number}
 */
epiviz.test.dom.Node.prototype.absOffset = function() { return Math.sqrt(this.pageX() * this.pageX() + this.pageY() * this.pageY()); };

/**
 * @returns {boolean}
 */
epiviz.test.dom.Node.prototype.isVisible = function() {
  var $element = $(this._element);
  return !($element.is(':hidden') || $element.css('opacity') == 0 || $element.css('visibility') == 'hidden');
};

/**
 * A deep copy of the current node
 * @returns {epiviz.datatypes.algorithms.treeeditdist.Node}
 */
epiviz.test.dom.Node.prototype.copy = function() {
  var copy = new epiviz.test.dom.Node(this._element);
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

epiviz.test.dom.Node.prototype.toString = function() {
  return this.elementName().toLowerCase() +
    (this._element.id ? '#' + this._element.id : '') +
    '[' + this.id() + ']';
};

/**
 * Gets a copy of this node where all descendants are sorted
 * @returns {epiviz.test.dom.Node}
 */
/*epiviz.test.dom.Node.prototype.sorted = function() {
  var root = new epiviz.test.dom.Node(this._element);
  $.each(this._children, function(node) {
    var child = node.sorted();
    child._parent = root;
    root._children.push(child);
  });
  root._descendantCount = this._descendantCount;

  root._children.sort(epiviz.test.dom.Node.compare);

  return root;
};*/

/**
 * @param {HTMLElement} element
 * @returns {epiviz.test.dom.Node}
 */
epiviz.test.dom.Node.build = function(element) {
  /** @type {epiviz.test.dom.Node} */
  var root = new epiviz.test.dom.Node(element);

  var maxDescendants = 0;
  var heavyChildIndex = -1;

  $(element).children().each(function(i) {
    /** @type {epiviz.test.dom.Node} */
    var subtreeRoot = epiviz.test.dom.Node.build(this);
    subtreeRoot._setParent(root);
    root._pushToChildren(subtreeRoot);
    root._setDescendantCount(root.descendantCount() + subtreeRoot.descendantCount() + 1);

    if (subtreeRoot.descendantCount() + 1 > maxDescendants) {
      maxDescendants = subtreeRoot.descendantCount() + 1;
      heavyChildIndex = i;
    }
  });

  root._setHeavyChildIndex(heavyChildIndex);

  return root;
};

/**
 * @param {epiviz.test.dom.Node} node1
 * @param {epiviz.test.dom.Node} node2
 * @returns {number}
 */
/*epiviz.test.dom.Node.compare = function(node1, node2) {
  if (node1 == node2) { return 0; }
  if (node1 == undefined) { return 1; }
  if (node2 == undefined) { return -1; }
  if (node1.elementName() < node2.elementName()) { return -1; }
  if (node1.elementName() > node2.elementName()) { return 1; }
  if (node1.absOffset() < node2.absOffset()) { return -1; }
  if (node1.absOffset() > node2.absOffset()) { return 1; }
  if (node1.pageX() < node2.pageX()) { return -1; }
  if (node1.pageX() > node2.pageX()) { return 1; }
  if (node1.pageY() < node2.pageY()) { return -1; }
  if (node1.pageY() > node2.pageY()) { return 1; }
  if (node1.width() < node2.width()) { return -1; }
  if (node1.width() > node2.width()) { return 1; }
  if (node1.height() < node2.height()) { return -1; }
  if (node1.height() > node2.height()) { return 1; }
  if (node1.descendantCount() < node2.descendantCount()) { return -1; }
  if (node1.descendantCount() > node2.descendantCount()) { return 1; }
  if (node1.isVisible() && !node2.isVisible()) { return -1; }
  if (!node1.isVisible() && node2.isVisible()) { return 1; }
  return 0;
};*/
