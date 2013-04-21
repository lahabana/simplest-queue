/*
 * ## MIT License
 * Copyright (c) 2013 Charly Molter
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var util = require('util');
var EventEmitter = require('events').EventEmitter;

/**
 * A simple FIFO that emits an event when it's full or empty or when
 * an element has been added to an empty queue.
 * the size maximum of the queue is optional if it is not provided
 * the queue is not bounded
 */
var SimplestQueue = function(max) {
  EventEmitter.call(this);
  if (typeof(max) === 'number') {
    this.maxSize = max;
  }
  this.elts = [];
};
util.inherits(SimplestQueue, EventEmitter);

/**
 * Removes an element from the queue
 * if the queue is empty we return false
 * It emits empty when we retrieve the last element
 * emits 'non-full' when we make space in the queue
 */
SimplestQueue.prototype.remove = function() {
  if (this.elts.length === 0) {
    return false;
  }
  var elt = this.elts.shift();
  if (this.elts.length === 0) {
    this.emit('empty');
  } else if (this.maxSize && this.elts.length === this.maxSize - 1) {
    this.emit('non-full')
  }
  return elt;
};

/**
 * Add an element to the queue
 * if the queue is full we return false
 * otherwise we return true
 */
SimplestQueue.prototype.add = function(data) {
  if (this.maxSize && this.elts.length == this.maxSize) {
    return false;
  }
  this.elts.push(data);
  // The queue was previously empty we emit the non-empty event
  if (this.elts.length === 1) {
    this.emit('non-empty');
    //the queue is now full we emit the full event
  } else if (this.maxSize && this.elts.length === this.maxSize) {
    this.emit('full');
  }
  return true;
};

module.exports = SimplestQueue;
