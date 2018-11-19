import { TweenMax } from 'gsap/TweenMax'
import { setRange, getMousePos, getTransformProperty } from './utilities'

class Parallax {
  /**
   * Spread link of a content to his top level element
   * @param {string} selector
   */
  static bind(selector) {
    ;[].forEach.call(document.querySelectorAll(selector), element => {
      if (element) {
        return new Parallax(element)
      }
    })
  }

  /**
   * @param {HTMLElement} el
   */
  constructor(el) {
    console.log('construct')
    this.allowTilt = true
    this.DOM = {
      el: el,
      // ANIMATION PARTS
      animatable: {
        image: el.querySelector('.img'),
        pebble: el.querySelector('.pebble'),
      },
    }

    this.options = {
      image: {
        translation: { x: -3, y: -3, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
      },
      pebble: {
        translation: {
          xPercent: 0,
          yPercent: 0,
          x: -20,
          y: -20,
          z: 0,
        },
        rotation: { x: 0, y: 0, z: 0 },
      },
    }

    this.initEvents()
  }

  initEvents() {
    let enter = false

    if (this.DOM.animatable.pebble) {
      this.options.pebble.translation.xPercent = `${getTransformProperty(this.DOM.animatable.pebble).x}%`
      this.options.pebble.translation.yPercent = `${getTransformProperty(this.DOM.animatable.pebble).y}%`
    }

    this.mouseenterFn = () => {
      if (enter) {
        enter = false
      }

      clearTimeout(this.mousetime)
      this.mousetime = setTimeout(() => (enter = true), 40)
    }

    this.mousemoveFn = ev =>
      requestAnimationFrame(() => {
        if (!enter) {
          return
        }
        this.tilt(ev)
      })

    this.wheel = ev =>
      requestAnimationFrame(() => {
        this.tilt(ev)
      })

    this.mouseleaveFn = ev =>
      requestAnimationFrame(() => {
        if (!enter || !this.allowTilt) {
          return
        }
        enter = false
        clearTimeout(this.mousetime)

        for (let key in this.DOM.animatable) {
          if (this.DOM.animatable[key] === undefined || this.options[key] == undefined) {
            continue
          }
          TweenMax.to(
            this.DOM.animatable[key],
            this.options[key].reverseAnimation !== undefined ? this.options[key].reverseAnimation.duration || 0 : 1.5,
            {
              ease:
                this.options[key].reverseAnimation !== undefined
                  ? this.options[key].reverseAnimation.ease || 'Power2.easeOut'
                  : 'Power2.easeOut',
              x: 0,
              y: 0,
              z: 0,
              rotationX: 0,
              rotationY: 0,
              rotationZ: 0,
            }
          )
        }
      })

    this.DOM.el.addEventListener('wheel', this.wheel.bind(this))
    this.DOM.el.addEventListener('mouseenter', this.mouseenterFn.bind(this))
    this.DOM.el.addEventListener('mousemove', this.mousemoveFn.bind(this))
    this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn.bind(this))

    window.addEventListener('resize', () => {
      this.options.pebble.translation.xPercent = `${getTransformProperty(this.DOM.animatable.pebble).x}%`
      this.options.pebble.translation.yPercent = `${getTransformProperty(this.DOM.animatable.pebble).y}%`
    })
  }

  /**
   * @event
   */
  tilt(ev) {
    if (!this.allowTilt) return
    const mousepos = getMousePos(ev)

    // Document scrolls
    const docScrolls = {
      left: document.body.scrollLeft + document.documentElement.scrollLeft,
      top: document.body.scrollTop + document.documentElement.scrollTop,
    }

    const bounds = this.DOM.el.getBoundingClientRect()

    // Mouse position relative to the main element (this.DOM.el)
    const relmousepos = {
      x: mousepos.x - bounds.left - docScrolls.left,
      y: mousepos.y - bounds.top - docScrolls.top,
    }

    // Movement settings for the animatable elements.
    for (let key in this.DOM.animatable) {
      if (this.DOM.animatable[key] === undefined || this.options[key] === undefined) {
        continue
      }

      let t =
        this.options[key] !== undefined ? this.options[key].translation || { x: 0, y: 0, z: 0 } : { x: 0, y: 0, z: 0 }
      let r =
        this.options[key] !== undefined ? this.options[key].rotation || { x: 0, y: 0, z: 0 } : { x: 0, y: 0, z: 0 }

      setRange(t)
      setRange(r)

      const transforms = {
        translation: {
          x: ((t.x[1] - t.x[0]) / bounds.width) * relmousepos.x + t.x[0],
          y: ((t.y[1] - t.y[0]) / bounds.height) * relmousepos.y + t.y[0],
          z: ((t.z[1] - t.z[0]) / bounds.height) * relmousepos.y + t.z[0],
        },
        rotation: {
          x: ((r.x[1] - r.x[0]) / bounds.height) * relmousepos.y + r.x[0],
          y: ((r.y[1] - r.y[0]) / bounds.width) * relmousepos.x + r.y[0],
          z: ((r.z[1] - r.z[0]) / bounds.width) * relmousepos.x + r.z[0],
        },
      }

      TweenMax.to(this.DOM.animatable[key], 1.5, {
        ease: 'Power1.easeOut',
        xPercent: this.options[key].translation.xPercent || 0,
        yPercent: this.options[key].translation.yPercent || 0,
        x: transforms.translation.x,
        y: transforms.translation.y,
        z: transforms.translation.z,
        rotationX: transforms.rotation.x,
        rotationY: transforms.rotation.y,
        rotationZ: transforms.rotation.z,
      })
    }
  }
}

export default Parallax
Parallax.bind('.hero .hero__media')
