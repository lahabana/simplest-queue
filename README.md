simplest-queue - The simplest event-driven queue ever, limited in size and tries to stay simple
====================

[![Build Status](https://travis-ci.org/lahabana/simplest-queue.png)](https://travis-ci.org/lahabana/simple-queue)

A simple FIFO that emits an event when it's full or empty or when
an element has been added to an empty queue.
the size maximum of the queue is optional if it is not provided
the queue is not bounded.

## Installation (by npm)

    npm install simplest-queue
    npm test

## Example

```js
    var SimplestQueue = require('./index.js');
    var q = new SimplestQueue(5);
    var empty = true;
    var full = false;
    var i = 0;
    q.on('empty', function() {
        empty = true;
    });
    q.on('non-empty', function() {
        empty = false;
    });
    q.on('full', function() {
        full = true;
    });
    q.on('non-full', function() {
        full = false;
    });

    var interv = setInterval(function() {
        if (!full) {
            console.log("in" + i);
            q.add(i);
        }
        i++;
    }, 100);
    var interv2 = setInterval(function() {
        if (!empty) {
            console.log("out" + q.remove());
        }
    }, 500);
    setTimeout(function() {
        clearInterval(interv);
        clearInterval(interv2);
    }, 5000);
```

Will output:

```
    in0
    in1
    in2
    in3
    out0
    in4
    in5
    out1
    in9
    out2
    in14
    out3
    in19
    out4
    in24
    out5
    in29
    out9
    in34
    out14
    in39
    out19
    in44
    out24
```

## API

### Methods:

`new SimplestQueue(max)` Creates a new empty queue (if the max parameter is not specified the queue is unbounded and the full event will never be emitted).

`add(e)` Add the element `e` to the queue if the queue is full returns false otherwise we returns true. can emit either `full` or `non-full`.

`remove()` Removes an element from the queue if the queue is empty returns false. can emit either `empty` or `non-full`.


### Events:

`full` emitted once when an element that will make the queue full is added (won't be reemited when we fail to add elements to an already full queue).

`non-full` emitted once when an element from a full queue is removed (won't be reemited when we retrieve more elements).

`empty` emitted once when the last element of the queue is removed (won't be reemited when we fail to retrieve elements from an empty queue).

`non-empty` emitted once when an element is added to an empty queue (won't be reemited when we add elements to a non empty queue).

## MIT License
Copyright (c) 2013 Charly Molter

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
