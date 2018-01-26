define("d3/test/geom/quadtree-test", ["dojo","dijit","dojox"], function(dojo,dijit,dojox){
var vows = require("vows"),
    load = require("../load"),
    assert = require("../assert"),
    _ = require("../../");

var suite = vows.describe("d3.geom.quadtree");

suite.addBatch({
  "quadtree": {
    topic: load("geom/quadtree").expression("d3.geom.quadtree"),
    "the default quadtree layout": {
      topic: function(quadtree) {
        return quadtree();
      },
      "has no defined size": function(q) {
        assert.isNull(q.size());
      },
      "has no defined extent": function(q) {
        assert.isNull(q.extent());
      },
      "has the default x-accessor, d[0]": function(q) {
        assert.strictEqual(q.x()([42, 43]), 42);
      },
      "has the default y-accessor, d[1]": function(q) {
        assert.strictEqual(q.y()([42, 43]), 43);
      },
      "can create a single-node quadtree with no bounds": function(q) {
        var point = [0, 0],
            q = q([point]),
            n = 0;
        q.visit(function(node, x1, y1, x2, y2) {
          assert.deepEqual(node.point, point);
          assert.isUndefined(node.nodes[0]);
          assert.isUndefined(node.nodes[1]);
          assert.isUndefined(node.nodes[2]);
          assert.isUndefined(node.nodes[3]);
          assert.isTrue(node.leaf);
          ++n;
        });
        assert.strictEqual(n, 1, "number of visits");
      },
      "find locates the closest point to a given point": function(q) {
        var dx = 17, dy = 17,
            points = _.range(dx * dy).map(function(i) { return [i % dx, i / dx | 0]; });
        q = q(points);
        assert.deepEqual(q.find([.1, .1]), [0, 0]);
        assert.deepEqual(q.find([7.5, 7.5]), [7, 7]);
        assert.deepEqual(q.find([.1, 15.9]), [0, 16]);
        assert.deepEqual(q.find([15.9, 15.9]), [16, 16]);
      },
      "can find with accessors": function(q) {
        q.x(function(d) { return d.x; });
        q.y(function(d) { return d.y; });

        var point = {x: 0, y: 0, arbitrary: 1};
        q = q([point]);
        assert.deepEqual(q.find([0, 0]), point);
      }
    },
    "the quadtree applied directly": {
      "can create a single-node quadtree with no bounds": function(quadtree) {
        var point = {x: 0, y: 0},
            q = quadtree([point]),
            n = 0;
        q.visit(function(node, x1, y1, x2, y2) {
          assert.deepEqual(node.point, point);
          assert.isUndefined(node.nodes[0]);
          assert.isUndefined(node.nodes[1]);
          assert.isUndefined(node.nodes[2]);
          assert.isUndefined(node.nodes[3]);
          assert.isTrue(node.leaf);
          ++n;
        });
        assert.strictEqual(n, 1, "number of visits");
      },
      "can create an empty quadtree": function(quadtree) {
        var q = quadtree([], 8, 10, 56, 47),
            n = 0;
        q.visit(function(node, x1, y1, x2, y2) {
          assert.isNull(node.point);
          assert.isUndefined(node.nodes[0]);
          assert.isUndefined(node.nodes[1]);
          assert.isUndefined(node.nodes[2]);
          assert.isUndefined(node.nodes[3]);
          assert.isTrue(node.leaf);
          ++n;
        });
        assert.strictEqual(n, 1, "number of visits");
      },
      "squarifies the input dimensions": function(quadtree) {
        var ox1 = 8,
            oy1 = 10,
            ox2 = 56,
            oy2 = 47,
            q = quadtree([], ox1, oy1, ox2, oy2),
            n = 0;
        q.visit(function(node, x1, y1, x2, y2) {
          assert.strictEqual(x1, ox1);
          assert.strictEqual(y1, oy1);
          assert.strictEqual(x2, Math.max(ox2 - ox1, oy2 - oy1) + x1);
          assert.strictEqual(y2, Math.max(ox2 - ox1, oy2 - oy1) + y1);
          ++n;
        });
        assert.strictEqual(n, 1, "number of visits");
      },
      "with three arguments, x1 and y1 are 0,0": function(quadtree) {
        var dx = 56,
            dy = 47,
            q = quadtree([], dx, dy),
            n = 0;
        q.visit(function(node, x1, y1, x2, y2) {
          assert.strictEqual(x1, 0);
          assert.strictEqual(y1, 0);
          assert.strictEqual(x2, Math.max(dx, dy));
          assert.strictEqual(y2, Math.max(dx, dy));
          ++n;
        });
        assert.strictEqual(n, 1, "number of visits");
      },
      "visit": {
        "uses pre-order traversal": function(quadtree) {
          var a = {x: 100, y: 100},
              b = {x: 200, y: 200},
              c = {x: 300, y: 300},
              q = quadtree([a, b, c], 960, 500),
              expected = [
                {point: null, x1:   0, y1:   0, x2: 960, y2: 960},
                {point: null, x1:   0, y1:   0, x2: 480, y2: 480},
                {point: null, x1:   0, y1:   0, x2: 240, y2: 240},
                {point:    a, x1:   0, y1:   0, x2: 120, y2: 120},
                {point:    b, x1: 120, y1: 120, x2: 240, y2: 240},
                {point:    c, x1: 240, y1: 240, x2: 480, y2: 480}
              ];
          q.visit(function(node, x1, y1, x2, y2) {
            assert.deepEqual({point: node.point, x1: x1, y1: y1, x2: x2, y2: y2}, expected.shift());
            assert.equal(!!node.point, node.leaf);
          });
          assert.isEmpty(expected);
        },
        "does not recurse if the callback returns truthy": function(quadtree) {
          var a = {x: 100, y: 100},
              b = {x: 700, y: 700},
              c = {x: 800, y: 800},
              q = quadtree([a, b, c], 960, 500),
              n = 0;
          q.visit(function(node, x1, y1, x2, y2) {
            ++n;
            return x1 > 0;
          });
          assert.equal(n, 3);
        }
      }
    }
  }
});

suite.export(module);
});
