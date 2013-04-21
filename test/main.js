/*
 * ## MIT License
 * Copyright (c) 2013 Charly Molter
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * */

var assert = require('assert');
var SimplestQueue = require('../index.js');
var EventEmitter = require('events').EventEmitter;

describe('initialization', function() {
  it('without limit', function() {
    var queue = new SimplestQueue();
    assert.ok(queue.elts);
    assert.strictEqual(queue.elts.length, 0);
    assert.strictEqual(queue.remove(), false);
    assert.ok(!queue.maxSize);
  });

  it('with limit', function() {
    var queue = new SimplestQueue(3);
    assert.ok(queue.elts);
    assert.strictEqual(queue.elts.length, 0);
    assert.strictEqual(queue.remove(), false);
    assert.strictEqual(queue.maxSize, 3);
  });
});

describe('add', function() {
  it('without limit', function() {
    var queue = new SimplestQueue();
    for (var i = 0; i < 5; i++) {
      assert.strictEqual(queue.add(i), true);
    }
  });

  it('with limit', function(done) {
    var queue = new SimplestQueue(2);
    var called = 0;
    var calledNonFull = 0;
    queue.on('non-full', function() {
      calledNonFull += 1;
    });
    queue.on('full', function() {
      called += 1;
      if (called === 1) {
        assert.strictEqual(queue.remove(), 0);
      }
    });
    for (var i = 0; i < 5; i++) {
      if (i >= 3) {
        assert.strictEqual(queue.add(i), false);
      } else {
        assert.strictEqual(queue.add(i), true);
      }
    }
    setTimeout(function() {
      assert.equal(called, 2);
      assert.equal(calledNonFull, 1);
      done();
    }, 1);
  });

  it('check event on one element', function(done) {
    var queue = new SimplestQueue();
    var called = 0;
    var calledEmpt = 0;
    queue.on('empty', function(message) {
      calledEmpt += 1;
    });

    queue.on('non-empty', function(message) {
      assert.strictEqual(queue.elts.length, 1);
      if (called === 0) {
        assert.strictEqual(queue.remove(), 42);
      }
      called += 1;

    });
    assert.ok(queue.add(42));
    assert.ok(queue.add(43));
    assert.ok(queue.add(44));
    setTimeout(function() {
      assert.equal(called, 2);
      assert.equal(calledEmpt, 1);
      done();
    }, 1);
  });
});

describe('remove', function() {
  it('empty', function() {
    var queue = new SimplestQueue();
    assert.strictEqual(queue.remove(), false);
  });

  it('check on one element', function() {
    var queue = new SimplestQueue();
    queue.add(1);
    assert.strictEqual(queue.remove(), 1);
  });

  it('limited more elements', function() {
    var queue = new SimplestQueue(3);
    assert.ok(queue.add(1));
    assert.ok(queue.add(2));
    assert.ok(queue.add(3));
    assert.ok(!queue.add(4));
    assert.strictEqual(queue.remove(), 1);
    assert.strictEqual(queue.remove(), 2);
    assert.strictEqual(queue.remove(), 3);
    assert.strictEqual(queue.remove(), false);

  });
});
