
/**
 * Module dependencies.
 */

var parse = require('./lib/parse');
var compile = require('./lib/compile');

// all the conveniencezzz

exports = module.exports = function(str){
  return compile(parse(str));
};

// expose methods

exports.parse = parse;
exports.compile = compile;