(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _math = require('../../utils/math.js');

var math = _interopRequireWildcard(_math);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj.default = obj;return newObj;
  }
}

var textNodes = [],
    intervals = [];

function getTextNodes(node) {
  var all = [];
  for (node = node.firstChild; node; node = node.nextSibling) {
    if (node.nodeType == 3) all.push(node);else all = all.concat(getTextNodes(node));
  }
  return all;
}

function isLetter(c) {
  return c.toLowerCase() !== c.toUpperCase();
}

function getRandomLetterIndex(txt) {
  var l = '';
  var i = null;

  while (!isLetter(l)) {
    i = math.random(0, txt.length - 1);
    l = txt[i];
  }

  return i;
}

function shuffleString(txt) {
  var a = txt.split('');
  var n = a.length;

  for (var i = n - 1; i > 0; i--) {
    var tmp = a[i];

    if (isLetter(tmp)) {
      var j = getRandomLetterIndex(txt);
      a[i] = a[j];
      a[j] = tmp;
    }
  }

  return a.join('');
}

function start() {

  textNodes = getTextNodes(document.querySelector('body'));

  textNodes.forEach(function (el) {

    el._wdsOriginalText = el.textContent;

    var interval = setInterval(function () {

      var words = el.textContent.split(/\s/);

      el.textContent = words.map(function (word) {
        if (word.trim().length === 0) {
          return word;
        }

        if (word.length <= 3) {
          return shuffleString(word);
        }

        var lettersToKeep = Math.max(Math.round(word.length / 5), 1);

        return word.substring(0, 2) + shuffleString(word.substring(2, word.length - 2)) + word.substring(word.length - 2);
      }).join(' ');
    }, math.random(750, 1500));

    intervals.push(interval);
  });
}

function stop() {
  intervals.forEach(function (interval) {
    clearInterval(interval);
  });

  textNodes.forEach(function (el) {
    el.textContent = el._wdsOriginalText;
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'startSimulation' && request.simulation === 'dyslexia') {
    start();
  } else if (request.action === 'stopSimulation' && request.simulation === 'dyslexia') {
    stop();
  }
});


},{"../../utils/math.js":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.random = random;
exports.pointInRect = pointInRect;
exports.inRange = inRange;
function random(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function pointInRect(x, y, rect) {
  return inRange(x, rect.x, rect.x + rect.width) && inRange(y, rect.y, rect.y + rect.height);
}

function inRange(value, min, max) {
  return value >= Math.min(min, max) && value <= Math.max(min, max);
}


},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZFxcanNcXGJhYmVsXFxzaW11bGF0aW9uc1xcZHlzbGV4aWFcXGNvbnRlbnQuanMiLCJidWlsZFxcanNcXGJhYmVsXFx1dGlsc1xcbWF0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUVBLElBQUksUUFBUSxRQUFRLHFCQUFSLENBQVo7O0FBRUEsSUFBSSxPQUFPLHdCQUF3QixLQUF4QixDQUFYOztBQUVBLFNBQVMsdUJBQVQsQ0FBaUMsR0FBakMsRUFBc0M7QUFBRSxNQUFJLE9BQU8sSUFBSSxVQUFmLEVBQTJCO0FBQUUsV0FBTyxHQUFQO0FBQWEsR0FBMUMsTUFBZ0Q7QUFBRSxRQUFJLFNBQVMsRUFBYixDQUFpQixJQUFJLE9BQU8sSUFBWCxFQUFpQjtBQUFFLFdBQUssSUFBSSxHQUFULElBQWdCLEdBQWhCLEVBQXFCO0FBQUUsWUFBSSxPQUFPLFNBQVAsQ0FBaUIsY0FBakIsQ0FBZ0MsSUFBaEMsQ0FBcUMsR0FBckMsRUFBMEMsR0FBMUMsQ0FBSixFQUFvRCxPQUFPLEdBQVAsSUFBYyxJQUFJLEdBQUosQ0FBZDtBQUF5QjtBQUFFLEtBQUMsT0FBTyxPQUFQLEdBQWlCLEdBQWpCLENBQXNCLE9BQU8sTUFBUDtBQUFnQjtBQUFFOztBQUU3USxJQUFJLFlBQVksRUFBaEI7QUFBQSxJQUNJLFlBQVksRUFEaEI7O0FBR0EsU0FBUyxZQUFULENBQXNCLElBQXRCLEVBQTRCO0FBQzFCLE1BQUksTUFBTSxFQUFWO0FBQ0EsT0FBSyxPQUFPLEtBQUssVUFBakIsRUFBNkIsSUFBN0IsRUFBbUMsT0FBTyxLQUFLLFdBQS9DLEVBQTREO0FBQzFELFFBQUksS0FBSyxRQUFMLElBQWlCLENBQXJCLEVBQXdCLElBQUksSUFBSixDQUFTLElBQVQsRUFBeEIsS0FBNEMsTUFBTSxJQUFJLE1BQUosQ0FBVyxhQUFhLElBQWIsQ0FBWCxDQUFOO0FBQzdDO0FBQ0QsU0FB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UUFBUSxVQUFSLEtBQXVCLFVBQW5FLEVBQStFO0FBQzdFO0FBQ0QsR0FGRCxNQUVPLElBQUksUUFBUSxNQUFSLEtBQW1CLGdCQUFuQixJQUF1QyxRQUFRLFVBQVIsS0FBdUIsVUFBbEUsRUFBOEU7QUFDbkY7QUFDRDtBQUNGLENBTkQ7QUFPQTs7O0FDcEdBOztBQUVBLE9BQU8sY0FBUCxDQUFzQixPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUMzQyxTQUFPO0FBRG9DLENBQTdDO0FBR0EsUUFBUSxNQUFSLEdBQWlCLE1BQWpCO0FBQ0EsUUFBUSxXQUFSLEdBQXNCLFdBQXRCO0FBQ0EsUUFBUSxPQUFSLEdBQWtCLE9BQWxCO0FBQ0EsU0FBUyxNQUFULENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCO0FBQ3hCLFNBQU8sS0FBSyxLQUFMLENBQVcsTUFBTSxLQUFLLE1BQUwsTUFBaUIsTUFBTSxHQUFOLEdBQVksQ0FBN0IsQ0FBakIsQ0FBUDtBQUNEOztBQUVELFNBQVMsV0FBVCxDQUFxQixDQUFyQixFQUF3QixDQUF4QixFQUEyQixJQUEzQixFQUFpQztBQUMvQixTQUFPLFFBQVEsQ0FBUixFQUFXLEtBQUssQ0FBaEIsRUFBbUIsS0FBSyxDQUFMLEdBQVMsS0FBSyxLQUFqQyxLQUEyQyxRQUFRLENBQVIsRUFBVyxLQUFLLENBQWhCLEVBQW1CLEtBQUssQ0FBTCxHQUFTLEtBQUssTUFBakMsQ0FBbEQ7QUFDRDs7QUFFRCxTQUFTLE9BQVQsQ0FBaUIsS0FBakIsRUFBd0IsR0FBeEIsRUFBNkIsR0FBN0IsRUFBa0M7QUFDaEMsU0FBTyxTQUFTLEtBQUssR0FBTCxDQUFTLEdBQVQsRUFBYyxHQUFkLENBQVQsSUFBK0IsU0FBUyxLQUFLLEdBQUwsQ0FBUyxHQUFULEVBQWMsR0FBZCxDQUEvQztBQUNEO0FBQ0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX21hdGggPSByZXF1aXJlKCcuLi8uLi91dGlscy9tYXRoLmpzJyk7XG5cbnZhciBtYXRoID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX21hdGgpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG52YXIgdGV4dE5vZGVzID0gW10sXG4gICAgaW50ZXJ2YWxzID0gW107XG5cbmZ1bmN0aW9uIGdldFRleHROb2Rlcyhub2RlKSB7XG4gIHZhciBhbGwgPSBbXTtcbiAgZm9yIChub2RlID0gbm9kZS5maXJzdENoaWxkOyBub2RlOyBub2RlID0gbm9kZS5uZXh0U2libGluZykge1xuICAgIGlmIChub2RlLm5vZGVUeXBlID09IDMpIGFsbC5wdXNoKG5vZGUpO2Vsc2UgYWxsID0gYWxsLmNvbmNhdChnZXRUZXh0Tm9kZXMobm9kZSkpO1xuICB9XG4gIHJldHVybiBhbGw7XG59XG5cbmZ1bmN0aW9uIGlzTGV0dGVyKGMpIHtcbiAgcmV0dXJuIGMudG9Mb3dlckNhc2UoKSAhPT0gYy50b1VwcGVyQ2FzZSgpO1xufVxuXG5mdW5jdGlvbiBnZXRSYW5kb21MZXR0ZXJJbmRleCh0eHQpIHtcbiAgdmFyIGwgPSAnJztcbiAgdmFyIGkgPSBudWxsO1xuXG4gIHdoaWxlICghaXNMZXR0ZXIobCkpIHtcbiAgICBpID0gbWF0aC5yYW5kb20oMCwgdHh0Lmxlbmd0aCAtIDEpO1xuICAgIGwgPSB0eHRbaV07XG4gIH1cblxuICByZXR1cm4gaTtcbn1cblxuZnVuY3Rpb24gc2h1ZmZsZVN0cmluZyh0eHQpIHtcbiAgdmFyIGEgPSB0eHQuc3BsaXQoJycpO1xuICB2YXIgbiA9IGEubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSBuIC0gMTsgaSA+IDA7IGktLSkge1xuICAgIHZhciB0bXAgPSBhW2ldO1xuXG4gICAgaWYgKGlzTGV0dGVyKHRtcCkpIHtcbiAgICAgIHZhciBqID0gZ2V0UmFuZG9tTGV0dGVySW5kZXgodHh0KTtcbiAgICAgIGFbaV0gPSBhW2pdO1xuICAgICAgYVtqXSA9IHRtcDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYS5qb2luKCcnKTtcbn1cblxuZnVuY3Rpb24gc3RhcnQoKSB7XG5cbiAgdGV4dE5vZGVzID0gZ2V0VGV4dE5vZGVzKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSk7XG5cbiAgdGV4dE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG5cbiAgICBlbC5fd2RzT3JpZ2luYWxUZXh0ID0gZWwudGV4dENvbnRlbnQ7XG5cbiAgICB2YXIgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cbiAgICAgIHZhciB3b3JkcyA9IGVsLnRleHRDb250ZW50LnNwbGl0KC9cXHMvKTtcblxuICAgICAgZWwudGV4dENvbnRlbnQgPSB3b3Jkcy5tYXAoZnVuY3Rpb24gKHdvcmQpIHtcbiAgICAgICAgaWYgKHdvcmQudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiB3b3JkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHdvcmQubGVuZ3RoIDw9IDMpIHtcbiAgICAgICAgICByZXR1cm4gc2h1ZmZsZVN0cmluZyh3b3JkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsZXR0ZXJzVG9LZWVwID0gTWF0aC5tYXgoTWF0aC5yb3VuZCh3b3JkLmxlbmd0aCAvIDUpLCAxKTtcblxuICAgICAgICByZXR1cm4gd29yZC5zdWJzdHJpbmcoMCwgMikgKyBzaHVmZmxlU3RyaW5nKHdvcmQuc3Vic3RyaW5nKDIsIHdvcmQubGVuZ3RoIC0gMikpICsgd29yZC5zdWJzdHJpbmcod29yZC5sZW5ndGggLSAyKTtcbiAgICAgIH0pLmpvaW4oJyAnKTtcbiAgICB9LCBtYXRoLnJhbmRvbSg3NTAsIDE1MDApKTtcblxuICAgIGludGVydmFscy5wdXNoKGludGVydmFsKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHN0b3AoKSB7XG4gIGludGVydmFscy5mb3JFYWNoKGZ1bmN0aW9uIChpbnRlcnZhbCkge1xuICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICB9KTtcblxuICB0ZXh0Tm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICBlbC50ZXh0Q29udGVudCA9IGVsLl93ZHNPcmlnaW5hbFRleHQ7XG4gIH0pO1xufVxuXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gIGlmIChyZXF1ZXN0LmFjdGlvbiA9PT0gJ3N0YXJ0U2ltdWxhdGlvbicgJiYgcmVxdWVzdC5zaW11bGF0aW9uID09PSAnZHlzbGV4aWEnKSB7XG4gICAgc3RhcnQoKTtcbiAgfSBlbHNlIGlmIChyZXF1ZXN0LmFjdGlvbiA9PT0gJ3N0b3BTaW11bGF0aW9uJyAmJiByZXF1ZXN0LnNpbXVsYXRpb24gPT09ICdkeXNsZXhpYScpIHtcbiAgICBzdG9wKCk7XG4gIH1cbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29udGVudC5qcy5tYXBcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5yYW5kb20gPSByYW5kb207XG5leHBvcnRzLnBvaW50SW5SZWN0ID0gcG9pbnRJblJlY3Q7XG5leHBvcnRzLmluUmFuZ2UgPSBpblJhbmdlO1xuZnVuY3Rpb24gcmFuZG9tKG1pbiwgbWF4KSB7XG4gIHJldHVybiBNYXRoLmZsb29yKG1pbiArIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpO1xufVxuXG5mdW5jdGlvbiBwb2ludEluUmVjdCh4LCB5LCByZWN0KSB7XG4gIHJldHVybiBpblJhbmdlKHgsIHJlY3QueCwgcmVjdC54ICsgcmVjdC53aWR0aCkgJiYgaW5SYW5nZSh5LCByZWN0LnksIHJlY3QueSArIHJlY3QuaGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gaW5SYW5nZSh2YWx1ZSwgbWluLCBtYXgpIHtcbiAgcmV0dXJuIHZhbHVlID49IE1hdGgubWluKG1pbiwgbWF4KSAmJiB2YWx1ZSA8PSBNYXRoLm1heChtaW4sIG1heCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXRoLmpzLm1hcFxuIl19
