class RevealFx {
  constructor(direction = 'lr', backgroundColor = '#f0f0f0', duration = 1, easing = 'Quint.easeInOut', coverArea = 0) {
    this.el = el
    this.isContentHidden = true
    this.revealSettings = {
      direction,
      backgroundColor,
      duration,
      easing,
      coverArea,
    }

    // Callback for when the revealer is covering the element (halfway through of the whole animation).
    this.onCover = (contentEl, revealerEl) => false
    // Callback for when the animation starts (animation start).
    this.onStart = (contentEl, revealerEl) =>  false
    // Callback for when the revealer has completed uncovering (animation end).
    this.onComplete = (contentEl, revealerEl) => false
  }

  extend(a, b) {
    for(var key in b) { 
      if( b.hasOwnProperty( key ) ) {
        a[key] = b[key]
      }
    }
    return a
  }

  createDOMEl(type, className, content) {
    var el = document.createElement(type)
    el.className = className || ''
    el.innerHTML = content || ''
    return el
  }

  init() {
    this.layout()
  }

  layout() {
    var position = getComputedStyle(this.el).position
    if( position !== 'fixed' && position !== 'absolute' && position !== 'relative' ) {
      this.el.style.position = 'relative'
    }

    // Content element.
    this.content = createDOMEl('div', 'block-revealer__content', this.el.innerHTML)
    if( this.options.isContentHidden) {
      this.content.style.opacity = 0
    }

    // Revealer element (the one that animates)
    this.revealer = createDOMEl('div', 'block-revealer__element')
    this.el.classList.add('block-revealer')
    this.el.innerHTML = ''
    this.el.appendChild(this.content)
    this.el.appendChild(this.revealer)
  }

  getTransformSettings(direction) {
    var val, origin, originTmp

    switch (direction) {
      case 'lr':
        val = 'scale3d(0,1,1)'
        origin = '0 50%'
        originTmp = '100% 50%'
        break
      case 'rl':
        val = 'scale3d(0,1,1)'
        origin = '100% 50%'
        originTmp = '0 50%'
        break
      case 'tb':
        val = 'scale3d(1,0,1)'
        origin = '50% 0'
        originTmp = '50% 100%'
        break
      case 'bt':
        val = 'scale3d(1,0,1)'
        origin = '50% 100%'
        originTmp = '50% 0'
        break
      default:
        val = 'scale3d(0,1,1)'
        origin = '0 50%'
        originTmp = '100% 50%'
        break
    }

    return {
      // transform value.
      val: val,
      // initial and halfway/final transform origin.
      origin: {initial: origin, halfway: originTmp},
    }
  }

  reveal(){
    // Do nothing if currently animating.
    if ( this.isAnimating ) {
      return false
    }
    this.isAnimating = true

    // Set the revealer element´s transform and transform origin.
    const defaults = { // In case revealSettings is incomplete, its properties deafault to:
      duration: 0.5,
      easing: 'Quint.easeInOut',
      delay: 0,
      backgroundColor: '#f0f0f0',
      direction: 'lr',
      coverArea: 0
    }

    const revealSettings = revealSettings || this.options.revealSettings
    const direction = revealSettings.direction || defaults.direction
    const transformSettings = this.getTransformSettings(direction)

    this.revealer.style.WebkitTransform = this.revealer.style.transform =  transformSettings.val
    this.revealer.style.WebkitTransformOrigin = this.revealer.style.transformOrigin =  transformSettings.origin.initial
    this.revealer.style.backgroundColor = revealSettings.backgroundColor || defaults.backgroundColor
    this.revealer.style.opacity = 1

    // Animate it.
    var self = this,
        duration = revealSettings.duration || defaults.duration,
        targets = this.revealer,
        from = {},
        fromTmp = {},
        to = {
            delay: revealSettings.delay || defaults.delay,
            ease:revealSettings.easing || defaults.easing,
            onComplete: function() {
              self.revealer.style.WebkitTransformOrigin = self.revealer.style.transformOrigin = transformSettings.origin.halfway
              if( typeof revealSettings.onCover === 'function' ) {
                revealSettings.onCover(self.content, self.revealer)
              }
              TweenMax.fromTo(targets, duration, fromTmp, toTmp)
            }
        },
        toTmp = {
          ease: revealSettings.easing || defaults.easing,
          onComplete: function() {
            self.isAnimating = false
            if( typeof revealSettings.onComplete === 'function' ) {
              revealSettings.onComplete(self.content, self.revealer)
            }
          }
        }

    var coverArea = revealSettings.coverArea || defaults.coverArea
    if ( direction === 'lr' || direction === 'rl' ) {
      from.scaleX = 0
      to.scaleX = 1
      fromTmp.scaleX = 1
      toTmp.scaleX = coverArea/100
    } else {
      from.scaleY = 0
      to.scaleY = 1
      fromTmp.scaleY = 1
      toTmp.scaleY = coverArea/100
    }

    if( typeof revealSettings.onStart === 'function' ) {
      revealSettings.onStart(self.content, self.revealer)
    }
    TweenMax.fromTo(targets, duration, from, to)
  }
}

export default RevealFx
