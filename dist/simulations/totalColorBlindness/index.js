(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var name = 'totalColorBlindness';

function load(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];

    chrome.tabs.executeScript(activeTab.id, { file: 'simulations/colorBlindness/content.js' }, function () {
      if (callback) {
        callback(name);
      }
    });
  });
}

function start() {
  load(function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];

      chrome.tabs.sendMessage(activeTab.id, { action: 'startSimulation', simulation: name, simulationType: 'colorBlindness' });
    });
  });
}

function stop() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];

    chrome.tabs.sendMessage(activeTab.id, { action: 'stopSimulation', simulation: name, simulationType: 'colorBlindness' });
  });
}

exports.start = start;
exports.stop = stop;


},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZFxcanNcXGJhYmVsXFxzaW11bGF0aW9uc1xcdG90YWxDb2xvckJsaW5kbmVzc1xcaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFFQSxPQUFPLGNBQVAsQ0FBc0IsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFDM0MsU0FBTztBQURvQyxDQUE3QztBQUdBLElBQUksT0FBTyxxQkFBWDs7QUFFQSxTQUFTLElBQVQsQ0FBYyxRQUFkLEVBQXdCO0FBQ3RCLFNBQU8sSUFBUCxDQUFZLEtBQVosQ0FBa0IsRUFBRSxRQUFRLElBQVYsRUFBZ0IsZUFBZSxJQUEvQixFQUFsQixFQUF5RCxVQUFVLElBQVYsRUFBZ0I7QUFDdkUsUUFBSSxZQUFZLEtBQUssQ0FBTCxDQUFoQjs7QUFFQSxXQUFPLElBQVAsQ0FBWSxhQUFaLENBQTBCLFVBQVUsRUFBcEMsRUFBd0MsRUFBRSxNQUFNLHVDQUFSLEVBQXhDLEVBQTJGLFlBQVk7QUFDckcsVUFBSSxRQUFKLEVBQWM7QUFDWixpQkFBUyxJQUFUO0FBQ0Q7QUFDRixLQUpEO0FBS0QsR0FSRDtBQVNEOztBQUVELFNBQVMsS0FBVCxHQUFpQjtBQUNmLE9BQUssWUFBWTtBQUNmLFdBQU8sSUFBUCxDQUFZLEtBQVosQ0FBa0IsRUFBRSxRQUFRLElBQVYsRUFBZ0IsZUFBZSxJQUEvQixFQUFsQixFQUF5RCxVQUFVLElBQVYsRUFBZ0I7QUFDdkUsVUFBSSxZQUFZLEtBQUssQ0FBTCxDQUFoQjs7QUFFQSxhQUFPLElBQVAsQ0FBWSxXQUFaLENBQXdCLFVBQVUsRUFBbEMsRUFBc0MsRUFBRSxRQUFRLGlCQUFWLEVBQTZCLFlBQVksSUFBekMsRUFBK0MsZ0JBQWdCLGdCQUEvRCxFQUF0QztBQUNELEtBSkQ7QUFLRCxHQU5EO0FBT0Q7O0FBRUQsU0FBUyxJQUFULEdBQWdCO0FBQ2QsU0FBTyxJQUFQLENBQVksS0FBWixDQUFrQixFQUFFLFFBQVEsSUFBVixFQUFnQixlQUFlLElBQS9CLEVBQWxCLEVBQXlELFVBQVUsSUFBVixFQUFnQjtBQUN2RSxRQUFJLFlBQVksS0FBSyxDQUFMLENBQWhCOztBQUVBLFdBQU8sSUFBUCxDQUFZLFdBQVosQ0FBd0IsVUFBVSxFQUFsQyxFQUFzQyxFQUFFLFFBQVEsZ0JBQVYsRUFBNEIsWUFBWSxJQUF4QyxFQUE4QyxnQkFBZ0IsZ0JBQTlELEVBQXRDO0FBQ0QsR0FKRDtBQUtEOztBQUVELFFBQVEsS0FBUixHQUFnQixLQUFoQjtBQUNBLFFBQVEsSUFBUixHQUFlLElBQWY7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgbmFtZSA9ICd0b3RhbENvbG9yQmxpbmRuZXNzJztcblxuZnVuY3Rpb24gbG9hZChjYWxsYmFjaykge1xuICBjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9LCBmdW5jdGlvbiAodGFicykge1xuICAgIHZhciBhY3RpdmVUYWIgPSB0YWJzWzBdO1xuXG4gICAgY2hyb21lLnRhYnMuZXhlY3V0ZVNjcmlwdChhY3RpdmVUYWIuaWQsIHsgZmlsZTogJ3NpbXVsYXRpb25zL2NvbG9yQmxpbmRuZXNzL2NvbnRlbnQuanMnIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayhuYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICBsb2FkKGZ1bmN0aW9uICgpIHtcbiAgICBjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9LCBmdW5jdGlvbiAodGFicykge1xuICAgICAgdmFyIGFjdGl2ZVRhYiA9IHRhYnNbMF07XG5cbiAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKGFjdGl2ZVRhYi5pZCwgeyBhY3Rpb246ICdzdGFydFNpbXVsYXRpb24nLCBzaW11bGF0aW9uOiBuYW1lLCBzaW11bGF0aW9uVHlwZTogJ2NvbG9yQmxpbmRuZXNzJyB9KTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHN0b3AoKSB7XG4gIGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0sIGZ1bmN0aW9uICh0YWJzKSB7XG4gICAgdmFyIGFjdGl2ZVRhYiA9IHRhYnNbMF07XG5cbiAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZShhY3RpdmVUYWIuaWQsIHsgYWN0aW9uOiAnc3RvcFNpbXVsYXRpb24nLCBzaW11bGF0aW9uOiBuYW1lLCBzaW11bGF0aW9uVHlwZTogJ2NvbG9yQmxpbmRuZXNzJyB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydHMuc3RhcnQgPSBzdGFydDtcbmV4cG9ydHMuc3RvcCA9IHN0b3A7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXBcbiJdfQ==
