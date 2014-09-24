/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 9/21/14
 * Time: 12:28 PM
 */

jsdom = require('jsdom');
$ = require('jquery')(jsdom.jsdom().parentWindow);

require('./lib/closure/goog/bootstrap/nodejs');
require('./epiviz-deps.js');

goog.require('epiviz.datatypes.algorithms.treeeditdist.Node');
goog.require('epiviz.datatypes.algorithms.treeeditdist.Tree');
goog.require('epiviz.datatypes.algorithms.treeeditdist.Forest');
goog.require('epiviz.datatypes.algorithms.treeeditdist.TreeComparer');
goog.require('epiviz.test.dom.Node');

goog.require('epiviz.utils.minIndex');

function assertTrue(predicate, message) {
  if (!predicate) {
    if (message == undefined) { message = 'Assertion failed: given expression was false'; }
    throw Error(message);
  }
}

function assertNotUndefined(expr, message) {
  if (expr == undefined) {
    if (message == undefined) { message = 'Assertion failed: given expression was undefined'; }
    throw Error(message);
  }
}

function assertEquals(actual, expected, message) {
  if (actual != expected) {
    if (message == undefined) { message = 'Assertion failed: expected [' + expected + '] but found [' + actual + ']'; }
    throw Error(message);
  }
}

var tests = {
  testMinIndex: function() {
    var arr = [7,2,1,3,4,7,1,6];
    var minIndex = epiviz.utils.minIndex.apply(undefined, arr);
    assertEquals(minIndex.index, 2);
    assertEquals(minIndex.min, 1);
  }
};

for (var testName in tests) {
  tests[testName]();
}
