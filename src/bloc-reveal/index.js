document.documentElement.className = 'js';

(function() {
  // Fake loading.
  setTimeout(init, 1000);

  function init() {
    document.body.classList.remove('loading');

    var rev1 = new RevealFx(document.querySelector('#rev-1'), {RevealFx
      revealSettings : {
        backgroundColor: '#7f40f1',
        onCover: function(contentEl, revealerEl) {
          contentEl.style.opacity = 1;
        }
      }
    });
    rev1.reveal();

    var rev2 = new RevealFx(document.querySelector('#rev-2'), {
      revealSettings : {
        backgroundColor: '#fcf652',
        delay: 0.25,
        onCover: function(contentEl, revealerEl) {
          contentEl.style.opacity = 1;
        }
      }
    });
    rev2.reveal();
  }
})();

// Helper vars and functions.
function extend(a, b) {
  for(var key in b) { 
    if( b.hasOwnProperty( key ) ) {
      a[key] = b[key];
    }
  }
  return a;
}

function createDOMEl(type, className, content) {
  var el = document.createElement(type);
  el.className = className || '';
  el.innerHTML = content || '';
  return el;
}

// RevealFx obj.
function RevealFx(el, options) {
  this.el = el;
  this.options = extend({}, this.options);
  extend(this.options, options);
  this._init();
}

// RevealFx options.
RevealFx.prototype.options = {
  // If true, then the content will be hidden until it´s "revealed".
  isContentHidden: true,
  // The animation/reveal settings. This can be set initially or passed when calling the reveal method.
  revealSettings: {
    // Animation direction: left right (lr) || right left (rl) || top bottom (tb) || bottom top (bt).
    direction: 'lr',
    // Revealer´s background color.
    backgroundColor: '#f0f0f0',
    // Animation speed. This is the speed to "cover" and also "uncover" the element (seperately, not the total time).
    duration: 0.5,
    // Animation easing. This is the easing to "cover" and also "uncover" the element.
    easing: 'Quint.easeInOut',
    // percentage-based value representing how much of the area should be left covered.
    coverArea: 0,
    // Callback for when the revealer is covering the element (halfway through of the whole animation).
    onCover: function(contentEl, revealerEl) { return false; },
    // Callback for when the animation starts (animation start).
    onStart: function(contentEl, revealerEl) { return false; },
    // Callback for when the revealer has completed uncovering (animation end).
    onComplete: function(contentEl, revealerEl) { return false; }
  }
};

// Init.
RevealFx.prototype._init = function() {
  this._layout();
};

// Build the necessary structure.
RevealFx.prototype._layout = function() {
  var position = getComputedStyle(this.el).position;
  if( position !== 'fixed' && position !== 'absolute' && position !== 'relative' ) {
    this.el.style.position = 'relative';
  }
  // Content element.
  this.content = createDOMEl('div', 'block-revealer__content', this.el.innerHTML);
  if( this.options.isContentHidden) {
    this.content.style.opacity = 0;
  }
  // Revealer element (the one that animates)
  this.revealer = createDOMEl('div', 'block-revealer__element');
  this.el.classList.add('block-revealer');
  this.el.innerHTML = '';
  this.el.appendChild(this.content);
  this.el.appendChild(this.revealer);
};

// Gets the revealer element´s transform and transform origin.
RevealFx.prototype._getTransformSettings = function(direction) {
  var val, origin, origin_2;

  switch (direction) {
    case 'lr' : 
      val = 'scale3d(0,1,1)';
      origin = '0 50%';
      origin_2 = '100% 50%';
      break;
    case 'rl' : 
      val = 'scale3d(0,1,1)';
      origin = '100% 50%';
      origin_2 = '0 50%';
      break;
    case 'tb' : 
      val = 'scale3d(1,0,1)';
      origin = '50% 0';
      origin_2 = '50% 100%';
      break;
    case 'bt' : 
      val = 'scale3d(1,0,1)';
      origin = '50% 100%';
      origin_2 = '50% 0';
      break;
    default : 
      val = 'scale3d(0,1,1)';
      origin = '0 50%';
      origin_2 = '100% 50%';
      break;
  };

  return {
    // transform value.
    val: val,
    // initial and halfway/final transform origin.
    origin: {initial: origin, halfway: origin_2},
  };
};

// Reveal animation. If revealSettings is passed, then it will overwrite the options.revealSettings.
RevealFx.prototype.reveal = function(revealSettings) {
  // Do nothing if currently animating.
  if ( this.isAnimating ) {
    return false;
  }
  this.isAnimating = true;

  // Set the revealer element´s transform and transform origin.
  var defaults = { // In case revealSettings is incomplete, its properties deafault to:
      duration: 0.5,
      easing: 'Quint.easeInOut',
      delay: 0,
      backgroundColor: '#f0f0f0',
      direction: 'lr',
      coverArea: 0
    },
    revealSettings = revealSettings || this.options.revealSettings,
    direction = revealSettings.direction || defaults.direction,
    transformSettings = this._getTransformSettings(direction);

  this.revealer.style.WebkitTransform = this.revealer.style.transform =  transformSettings.val;
  this.revealer.style.WebkitTransformOrigin = this.revealer.style.transformOrigin =  transformSettings.origin.initial;

  // Set the Revealer´s background color.
  this.revealer.style.backgroundColor = revealSettings.backgroundColor || defaults.backgroundColor;

  // Show it. By default the revealer element has opacity = 0 (CSS).
  this.revealer.style.opacity = 1;

  // Animate it.
  var self = this,
      duration = revealSettings.duration || defaults.duration, 
      targets = this.revealer,
      from = {},
      from_2 = {},
      to = {
          delay: revealSettings.delay || defaults.delay,
          ease:revealSettings.easing || defaults.easing,
          onComplete: function() {
            self.revealer.style.WebkitTransformOrigin = self.revealer.style.transformOrigin = transformSettings.origin.halfway;     
            if( typeof revealSettings.onCover === 'function' ) {
              revealSettings.onCover(self.content, self.revealer);
            }
            TweenMax.fromTo(targets, duration, from_2, to_2);
            //anime(animationSettings_2);       
          }
      },
      to_2 = {
        ease: revealSettings.easing || defaults.easing,
        onComplete: function() {
          self.isAnimating = false;
          if( typeof revealSettings.onComplete === 'function' ) {
            revealSettings.onComplete(self.content, self.revealer);
          }
        }
      };

  var coverArea = revealSettings.coverArea || defaults.coverArea;
  if ( direction === 'lr' || direction === 'rl' ) {
    from.scaleX = 0;
    to.scaleX = 1;
    from_2.scaleX = 1;
    to_2.scaleX = coverArea/100;
  } else {
    from.scaleY = 0;
    to.scaleY = 1;
    from_2.scaleY = 1;
    to_2.scaleY = coverArea/100;
  }

  if( typeof revealSettings.onStart === 'function' ) {
    revealSettings.onStart(self.content, self.revealer);
  }
  TweenMax.fromTo(targets, duration, from, to);
  //anime(animationSettings);
};

window.RevealFx = RevealFx;