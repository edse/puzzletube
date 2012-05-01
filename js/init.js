/**
 * Normalize the browser animation API across implementations. This requests
 * the browser to schedule a repaint of the window for the next animation frame.
 * Checks for cross-browser support, and, failing to find it, falls back to setTimeout.
 * @param {function}    callback  Function to call when it's time to update your animation for the next repaint.
 * @param {HTMLElement} element   Optional parameter specifying the element that visually bounds the entire animation.
 * @return {number} Animation frame request.
 */

// A robust polyfill for animation frame
( function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if(!window.requestAnimationFrame) {
    console.log('!window.requestAnimationFrame');
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 22 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if(!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
}());

// A robust polyfill for fullscreen
(function(window, document) {'use strict';
  var keyboardAllowed = 'ALLOW_KEYBOARD_INPUT' in Element, methods = (function() {
    var methodMap = [['requestFullscreen', 'exitFullscreen', 'fullscreenchange', 'fullscreen', 'fullscreenElement'], ['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitfullscreenchange', 'webkitIsFullScreen', 'webkitCurrentFullScreenElement'], ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozfullscreenchange', 'mozFullScreen', 'mozFullScreenElement']], i = 0, l = methodMap.length;
    for(; i < l; i++) {
      var val = methodMap[i];
      if(val[1] in document) {
        return val;
      }
    }
  })(), screenfull = {
    isFullscreen : document[methods[3]],
    element : document[methods[4]],
    request : function(elem) {
      var request = methods[0];
      elem = elem || document.documentElement;
      // If you request a new element when already in fullscreen, Chrome will
      // change directly to that element, while Firefox will do nothing. Force
      // Firefox to change element by exiting and then reenter, making it consistent.
      if(request.indexOf('moz') !== -1 && elem !== this.element) {
        this.exit();
      }
      elem[ request ](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
      // Work around Safari 5.1 bug: reports support for
      // keyboard in fullscreen even though it doesn't.
      if(!document.isFullscreen) {
        elem[ request ]();
      }
    },
    exit : function() {
      document[ methods[1] ]();
    },
    toggle : function(elem) {
      if(this.isFullscreen) {
        this.exit();
        $('#fullscreen').show();
        $('#exitfullscreen').hide();
      } else {
        this.request(elem);
        $('#fullscreen').hide();
        $('#exitfullscreen').show();
      }
    },
    onchange : function() {
    }
  };
  if(!methods) {
    return;
  }
  document.addEventListener(methods[2], function(e) {
    screenfull.isFullscreen = document[methods[3]];
    screenfull.element = document[methods[4]];
    screenfull.onchange(e);
  });
  window.screenfull = screenfull;
})(window, document);

// GAME START
var game = new Game();
var interval = null;
var gameInterval = null;
game.debug = false;
window.m = {
  game : game
};
window.m.interv = function() {
  interval = setTimeout("window.m.game.mouse.moving = false; document.getElementById('moving').value = false; window.m.intervClear();", 500);
}
window.m.intervClear = function() {
  clearInterval(interval)
}
window.m.stopGame = function() {
  clearInterval(gameInterval);
  
  game.started = false;
  window.m.stopSFX();
  window.cancelAnimationFrame(game.interval);

  $('#home').addClass('active');

  $('#play').show();
  $('.control').hide();
  
  $('#canvas').hide();
  $('.content').show();

}
window.m.startGame = function() {
  game.video.play();
  gameInterval = setInterval(function() { game.remaining_time--; },1000);
  game.started = true;
  //resizeGame();
  window.m.startSFX();
  loop();
  $('#home').removeClass('active');
  $('#canvas, .control').show();
  $('.content, #play, #exitfullscreen, #sfx, #autosnap').hide();
}
window.m.pauseGame = function() {
  game.video.pause();
  clearInterval(gameInterval);
  game.started = false;
  window.cancelAnimationFrame(game.interval);

  $('#play').show();
  $('.control').hide();  
}
window.m.stopSFX = function() {
  window.m.game.drip.volume = 0.0;
  window.m.game.twang.volume = 0.0;
  window.m.game.drip.pause();
  window.m.game.twang.pause();
  $('#sfxoff').hide();
  $('#sfx').show();
}
window.m.startSFX = function() {
  window.m.game.drip.volume = 1.0;
  window.m.game.twang.volume = 1.0;
  $('#sfxoff').show();
  $('#sfx').hide();
}
window.m.autoSnap = function() {
  window.m.game.auto_snap = true;
  $('#autosnapoff').show();
  $('#autosnap').hide();
}
window.m.autoSnapOff = function() {
  window.m.game.auto_snap = false;
  $('#autosnapoff').hide();
  $('#autosnap').show();
}

function start() {
  window.m.startGame();
}
function stop() {
  window.m.stopGame();
}
function pause() {
  window.m.pauseGame();
}

function loop() {
  game.interval = window.requestAnimationFrame(loop, game.canvas);
  game.canvas.width = game.canvas.width;
  game.context.scale(game.scale, game.scale);
  game.render();

  var elapsed = game.getTimer() - game.time;
  game.time = game.getTimer();

  //elapsed = Math.min(20, Math.max(-20, elapsed));
  if(elapsed > game.maxElapsedTime)
    game.maxElapsedTime = elapsed;

  /*
  game.context.fillText("scale: " + game.scale, 50, 70);
  game.context.fillText("loaded items: " + game.loaded_items, 50, 80);
  game.context.fillText(">>> " + elapsed, 50, 90);
  game.context.fillText("maxElapsedTime>>> " + game.maxElapsedTime, 50, 100);
  game.context.fillText(game.remaining_time, 50, 110);
  game.context.fillText(game.auto_snap, 50, 120);
  */

}

function loadAssets(g,assets) {
  //alert('>>'+atttr);
  for(i=0; i<assets.length; i++){
    if(assets[i].type == "image"){
      //IMAGE
      eval("g."+assets[i].slug+' = new Image();');
      eval("g."+assets[i].slug+'.src = "'+assets[i].src+'";');
      eval("g."+assets[i].slug+'.onload = g.loaded_items++;');
    }
    else if(assets[i].type == "audio"){
      //AUDIO
      eval("g."+assets[i].slug+' = document.createElement(\'audio\');');
      eval("g."+assets[i].slug+'.addEventListener(\'canplaythrough\', itemLoaded(g), false);');
      var source= document.createElement('source');
      if(Modernizr.audio.ogg){
        source.type= 'audio/ogg';
        source.src= assets[i].src+'.ogg';
      }
      else if(Modernizr.audio.mp3){
        source.type= 'audio/mpeg';
        source.src= assets[i].src+'.mp3';
      }
      if(source.src != ""){
        eval("g."+assets[i].slug+'.appendChild(source);');
      }
      else{
        // no MP3 or OGG audio support
        g.itens_to_load--;
      }
    }
    else if(assets[i].type == "video"){
      //VIDEO
      eval("g."+assets[i].slug+' = document.createElement(\'video\');');
      eval("g."+assets[i].slug+'.addEventListener(\'canplaythrough\', itemLoaded(g), false);');
      var source= document.createElement('source');
      var vid= document.createElement('source');
      if(Modernizr.video.ogg){
        source.type= 'video/ogg';
        source.src= assets[i].src+'.ogg';
      }
      else if(Modernizr.video.h264){
        source.type= 'video/mp4';
        source.src= assets[i].src+'.mp4';
      }
      if(source.src != ""){
        eval("g."+assets[i].slug+'.appendChild(source);');
        eval("g."+assets[i].slug+'.appendChild(source);');
        eval("vid.appendChild(g."+assets[i].slug+");");
      }
      else{
        // no MP3 or OGG audio support
        g.itens_to_load--;
      }
    }
  }
}

function itemLoaded(g) {
  g.loaded_items++;
}

function resizeGame() {
  document.getElementById('canvas').width = window.innerWidth;
  document.getElementById('canvas').height = window.innerHeight;
  console.log("canvas: " + window.innerWidth + ", " + window.innerHeight)
  if(game.started)
    game.init();
  else
    game.draw_splash();
}

window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);
window.addEventListener('load', game.draw_splash(), false);