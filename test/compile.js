
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

    var ret = query('level: error OR level: alert');
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

describe('comparison', function(){
  it('should compile greater than', function(){
    var ret = query('level>5');
    ret.should.eql({
      level: { $gt: 5 }
    });

    var ret = query('level > 5');
    ret.should.eql({
      level: { $gt: 5 }
    });
  })

  it('should compile greater equal than', function(){
    var ret = query('level>=5');
    ret.should.eql({
      level: { $gte: 5 }
    });

    var ret = query('level >= 5');
    ret.should.eql({
      level: { $gte: 5 }
    });
  })

  it('should compile less than', function(){
    var ret = query('level<5');
    ret.should.eql({
      level: { $lt: 5 }
    });

    var ret = query('level < 5');
    ret.should.eql({
      level: { $lt: 5 }
    });
  })

  it('should compile less equal than', function(){
    var ret = query('level<=5');
    ret.should.eql({
      level: { $lte: 5 }
    });

    var ret = query('level <= 5');
    ret.should.eql({
      level: { $lte: 5 }
    });
  })

  it('should compile not equal', function(){
    var ret = query('level!=5');
    ret.should.eql({
      level: { $ne: 5 }
    });

    var ret = query('level != 5');
    ret.should.eql({
      level: { $ne: 5 }
    });
  })

  it('should compile nested', function(){
    var ret = query('(age > 20 AND age < 50) OR gender:male');
    ret.should.eql({
      $or: [
        { $and: [ { age: { $gt: 20 } }, { age: { $lt: 50 } } ] },
        { gender: 'male' }
      ]
    });
  })
})