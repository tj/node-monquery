
/**
 * Expose `compile`.
 */

module.exports = compile;

/**
 * Compile `node` to a mongo query.
 *
 * @param {Object} node
 * @return {Object}
 * @api public
 */

function compile(node) {
  switch (node.type) {
    case 'field':
      var obj = {};
      obj[node.name] = node.value;
      return obj;

    case 'op':
      var obj = {};
      var op = '$' + node.op;

      obj[op] = [
        compile(node.left),
        compile(node.right)
      ];

      return obj;
  }
}