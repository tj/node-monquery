
var query = require('..');
var assert = require('assert');

describe('fields', function(){
  it('should support dots', function(){
    var ret = query.parse('user.name:Tobi');

    ret.should.eql({
      type: 'field',
      name: 'user.name',
      value: 'Tobi'
    });
  })

  it('should default to bool', function(){
    var ret = query.parse('failed');

    ret.should.eql({
      type: 'field',
      name: 'failed',
      value: true
    });
  })

  it('should support values', function(){
    var ret = query.parse('level:error');

    ret.should.eql({
      type: 'field',
      name: 'level',
      value: 'error'
    });
  })

  it('should support booleans', function(){
    var ret = query.parse('removed:true');

    ret.should.eql({
      type: 'field',
      name: 'removed',
      value: true
    });

    var ret = query.parse('removed:false');

    ret.should.eql({
      type: 'field',
      name: 'removed',
      value: false
    });
  })

  it('should support yes/no booleans', function(){
    var ret = query.parse('removed:yes');

    ret.should.eql({
      type: 'field',
      name: 'removed',
      value: true
    });

    var ret = query.parse('removed:no');

    ret.should.eql({
      type: 'field',
      name: 'removed',
      value: false
    });
  })

  it('should support ints', function(){
    var ret = query.parse('count:5');
    assert(5 === ret.value);
  })

  it('should support floats', function(){
    var ret = query.parse('count:5.2');
    assert(5.2 === ret.value);
  })

  it('should support wildcards', function(){
    var ret = query.parse('hostname:api-*');

    ret.should.eql({
      type: 'field',
      name: 'hostname',
      value: /^api-.*$/
    });
  })

  it('should support double-quoted values', function(){
    var ret = query.parse('type:"uploading item"');

    ret.should.eql({
      type: 'field',
      name: 'type',
      value: 'uploading item'
    });
  })

  it('should support single-quoted values', function(){
    var ret = query.parse("type:'uploading item'");

    ret.should.eql({
      type: 'field',
      name: 'type',
      value: 'uploading item'
    });
  })
})

describe('AND', function(){
  it('should work', function(){
    var ret = query.parse("level:error AND type:upload");

    ret.should.eql({
      type: 'op',
      op: 'and',
      left: { type: 'field', name: 'level', value: 'error' },
      right: { type: 'field', name: 'type', value: 'upload' }
    });
  })
})

describe('OR', function(){
  it('should work', function(){
    var ret = query.parse("level:error OR type:upload");

    ret.should.eql({
      type: 'op',
      op: 'or',
      left: { type: 'field', name: 'level', value: 'error' },
      right: { type: 'field', name: 'type', value: 'upload' }
    });
  })
})

describe('ops', function(){
  it('should work when nested', function(){
    var ret = query.parse("(level:error AND type:upload) OR level:critical");

    ret.should.eql({ type: 'op',
      op: 'or',
      left:
       { type: 'op',
         op: 'and',
         left: { type: 'field', name: 'level', value: 'error' },
         right: { type: 'field', name: 'type', value: 'upload' } },
      right: { type: 'field', name: 'level', value: 'critical' } });
  })
})