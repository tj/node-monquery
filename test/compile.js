
var query = require('..');
var assert = require('assert');


describe('fields', function(){
  it('should compile', function(){
    var ret = query('level:error');
    ret.should.eql({ level: 'error' });
  })
})

describe('operators', function(){
  it('should compile', function(){
    var ret = query('level:error OR level:alert');
    ret.should.eql({
      $or: [
        { level: 'error' },
        { level: 'alert' }
      ]
    });
  })

  it('should compile when nested', function(){
    var ret = query('(level:error AND type:upload) OR type:alert');
    ret.should.eql({
      $or: [
        { $and: [ { level: 'error' }, { type: 'upload' } ] },
        { type: 'alert' }
      ]
    });
  })
})