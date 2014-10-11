
/**
 * Module dependencies.
 */

var escape = require('escape-regexp');
var assert = require('assert');

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Parse `str` to produce an AST.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

function parse(str) {
  str = '(' + str.trim() + ')';

  /**
   * expr
   */

  return expr();

  /**
   * Assert `expr`.
   */

  function error(expr, msg) {
    if (expr) return;
    var ctx = str.slice(0, 10);
    assert(0, msg + ' near `' + ctx + '`');
  }

  /**
   * '(' binop ')'
   */

  function expr() {
    error('(' == str[0], "missing opening '('");
    str = str.slice(1);

    var node = binop();

    error(')' == str[0], "missing closing ')'");
    str = str.slice(1);

    return node;
  }

  /**
   * field | expr
   */

  function primary() {
    return field()
      || expr();
  }

  /**
   * primary (OR|AND) binop
   */

  function binop() {
    var left = primary();

    var m = str.match(/^ *(OR|AND) */i);
    if (!m) return left;

    str = str.slice(m[0].length);

    var right = binop();

    return {
      type: 'op',
      op: m[1].toLowerCase(),
      left: left,
      right: right
    }
  }

  /**
   * FIELD[:VALUE]
   */

  function field() {
    var val = true;
    var m = str.match(/^([-.\w]+)/);
    if (!m) return;

    var name = m[0];
    str = str.slice(name.length);

    var m = str.match(/ *([:><!=]*) *([-*\w.]+|".*?"|'.*?'|\/(.*?)\/) */);

    if (m) {
      str = str.slice(m[0].length);
      val = m[2];

      var cmp = comparison(m[1]);

      if (numeric(val)) val = parseFloat(val);
    }

    var ret = {
      type: 'field',
      name: name,
      value: coerce(val)
    };

    if (cmp) ret.cmp = cmp;

    return ret;
  }
}

/**
 * Coerce `val`:
 *
 * - boolean strings to bools
 * - regexp notation to regexps
 * - quote-stripped strings
 */

function coerce(val) {
  if ('string' != typeof val) return val;

  // regexp
  if ('/' == val[0]) {
    val = val.slice(1, -1);
    return new RegExp(val);
  }

  // boolean
  switch (val) {
    case 'true':
    case 'yes':
      return true;
    case 'false':
    case 'no':
      return false;
  }

  // quoted
  if (quoted(val)) return strip(val);

  // pattern
  if (~val.indexOf('*')) return pattern(val);

  // term
  return val;
}

/**
 * Convert pattern `str` to a regexp.
 */

function pattern(str) {
  str = escape(str).replace(/\\\*/g, '.*');
  return new RegExp('^' + str + '$');
}

/**
 * Check if `str` is quoted.
 */

function quoted(str) {
  return "'" == str[0] || '"' == str[0];
}

/**
 * Strip quotes from `str`.
 */

function strip(str) {
  return str.replace(/^['"]|['"]$/g, '');
}

/**
 * Check if `str` is numeric.
 */

function numeric(str) {
  return !isNaN(parseFloat(str));
}

/**
 * Return mongodb comparison operator.
 */

function comparison(str) {
switch (str) {
  case '>':
    return 'gt';
  case '<':
    return 'lt';
  case '<=':
    return 'lte';
  case '>=':
    return 'gte';
  case '!=':
    return 'ne';
  default:
    return null;
  }
}
