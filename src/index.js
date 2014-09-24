/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 9/19/14
 * Time: 11:10 AM
 */

jsdom = require('jsdom');
fs = require('fs');
$ = require('jquery')(jsdom.jsdom('<html><body></body></html>').parentWindow);

require('./lib/closure/goog/bootstrap/nodejs');
require('./epiviz-deps.js');

goog.require('epiviz.datatypes.algorithms.treeeditdist.Node');
goog.require('epiviz.datatypes.algorithms.treeeditdist.Tree');
goog.require('epiviz.datatypes.algorithms.treeeditdist.Forest');
goog.require('epiviz.datatypes.algorithms.treeeditdist.TreeComparer');
goog.require('epiviz.test.dom.Node');

var Node = epiviz.datatypes.algorithms.treeeditdist.Node;
var Tree = epiviz.datatypes.algorithms.treeeditdist.Tree;
var Forest = epiviz.datatypes.algorithms.treeeditdist.Forest;
var DomNode = epiviz.test.dom.Node;
var TreeComparer = epiviz.datatypes.algorithms.treeeditdist.TreeComparer;

var comparer = new TreeComparer();

var svg1 = fs.readFileSync('../svg1.xml', {encoding: 'utf8'});
var svg2 = fs.readFileSync('../svg2.xml', {encoding: 'utf8'});

//var leftRoot = DomNode.build($(svg1));
//var rightRoot = DomNode.build($(svg2));

var leftRoot = DomNode.build($(/*svg1));*/
  '<svg id="track-blocks-Kfux6-svg" class="base-chart" width="1182" height="90">'+
    '<g class="track-highlight" transform="translate(20, 0)"></g>'+
    '<rect class="chart-background" x="0" y="0" width="100%" height="100%" fill="#ffffff" fill-opacity="0"></rect>'+
    '<text class="chart-title" font-weight="bold" fill="#1859a9" x="20" y="20">Hypo-methylation Blocks</text>'+
    '<g class="items" id="track-blocks-Kfux6-gene-content" clip-path="url(#clip-track-blocks-Kfux6)"'+
    'transform="translate(20, 25)">'+
      '<rect class="item data-series-0" x="1016.6606510565391" width="343.7359223300971" height="42" y="0"'+
      'style="fill: rgb(24, 89, 169);"></rect>'+
      '<rect class="item data-series-0" x="520.4212450028555" width="412.96996002284413" height="42" y="0"'+
      'style="fill: rgb(24, 89, 169);"></rect>'+
      '<rect class="item data-series-0" x="-1892.3019988577955" width="2310.754540262707" height="42" y="0"'+
      'style="fill: rgb(24, 89, 169);"></rect>'+
      '<g class="selected">'+
        '<g class="hovered"></g>'+
      '</g>'+
      //'<g class="hovered"></g>'+
    '</g>'+
  '</svg>')[0]);
var rightRoot = DomNode.build($(/*svg2));*/
  '<svg id="track-blocks-psQ06-svg" class="base-chart" width="1182" height="90">'+
    '<g class="track-highlight" transform="translate(20, 0)"></g>'+
    '<rect class="chart-background" x="0" y="0" width="100%" height="100%" fill="#ffffff" fill-opacity="0"></rect>'+
    '<text class="chart-title" font-weight="bold" fill="#1859a9" y="20" x="23">Hypo-methylation Blocks</text>'+
    '<g class="items" id="track-blocks-psQ06-gene-content" clip-path="url(#clip-track-blocks-psQ06)"'+
    'transform="translate(20, 25)">'+
      '<rect class="item data-series-0" x="-1892.3019988577955" width="2310.754540262707" height="42" y="0"'+
      'style="fill: rgb(24, 89, 169);"></rect>'+
      '<rect class="item data-series-0" x="1016.6606510565391" width="343.7359223300971" height="42" y="0"'+
      'style="fill: rgb(24, 89, 169);"></rect>'+
      '<rect class="item data-series-0" x="520.4212450028555" width="412.96996002284413" height="42" y="0"'+
      'style="fill: rgb(24, 89, 169);"></rect>'+
      '<g class="selected">'+
        //'<g class="hovered"></g>'+
      '</g>'+
      '<g class="hovered"></g>'+
    '</g>'+
  '</svg>')[0]);

var f = new Tree(leftRoot);
var g = new Tree(rightRoot);

console.log('f:');
console.log(f.toString());
console.log('g:');
console.log(g.toString());

var costByDistance = function(dist, minDist, maxCost) {
  return Math.min(0.1 * Math.max(0, dist - minDist), maxCost);
};

var nCalls = 0;
var depth = 0;
var oldDiff = comparer._diff;
comparer._diff = function(f, g, computedDiffs, costCalc) {
//  depth += 1;
  var storedDiff = epiviz.utils.mapGet(computedDiffs, f.id(), g.id());
  if (storedDiff != undefined) {
    nCalls += 1;
/*    console.log(
      new Array(depth).join(' ') +
      nCalls + ': ' +
      f.id() + '->' + g.id());*/
  }

  var ret = oldDiff.call(comparer, f, g, computedDiffs, costCalc);

//  depth -= 1;

  return ret;
};

console.log(f.root().descendantCount());
console.log(g.root().descendantCount());

console.log(JSON.stringify(
  comparer.diff(f, g, {
    deleted: function(node) { return 5; },
    /**
     * @param {epiviz.test.dom.Node} node1
     * @param {epiviz.test.dom.Node} node2
     * @returns {number}
     */
    match: function(node1, node2) {
      if (node1 == node2) { return 0; }

      var cost = 0;
      if (node1.elementName() != node2.elementName()) {
        cost += 10;
      }

      cost += costByDistance(Math.abs(node1.pageX() - node2.pageX()), 15, 5);
      cost += costByDistance(Math.abs(node1.pageY() - node2.pageY()), 15, 5);

      var d1 = Math.sqrt(node1.width() * node1.width() + node1.height() * node1.height());
      var d2 = Math.sqrt(node2.width() * node2.width() + node2.height() * node2.height());
      cost += costByDistance((Math.max(d1, d2) + 1) / (Math.min(d1, d2) + 1), 1.5, 5);

      cost += costByDistance(Math.abs(node1.descendantCount() - node2.descendantCount()), 5, 5);

      if (node1.isVisible() != node2.isVisible()) {
        cost += 1;
      }

      return cost;
    }
  })));

console.log(nCalls);

console.log('ok');

