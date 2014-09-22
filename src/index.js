/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 9/19/14
 * Time: 11:10 AM
 */

jsdom = require('jsdom');
$ = require('jquery')(jsdom.jsdom().parentWindow);

require('./lib/closure/goog/bootstrap/nodejs');
require('./epiviz-deps.js');

goog.require('epiviz.datatypes.algorithms.Node');
goog.require('epiviz.datatypes.algorithms.Tree');
goog.require('epiviz.datatypes.algorithms.Forest');
goog.require('epiviz.datatypes.algorithms.TreeComparer');
goog.require('epiviz.test.dom.Node');

Node = epiviz.datatypes.algorithms.Node;
Tree = epiviz.datatypes.algorithms.Tree;
Forest = epiviz.datatypes.algorithms.Forest;
DomNode = epiviz.test.dom.Node;
TreeComparer = epiviz.datatypes.algorithms.TreeComparer;

var comparer = new TreeComparer();

var leftRoot = DomNode.build($(
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
var rightRoot = DomNode.build($(
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

console.log(JSON.stringify(comparer.diff(f, g)));

console.log('ok');

