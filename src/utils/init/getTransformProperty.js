export const getTransformProperty = el => {
  if (!el) {
    return
  }

  const elementStyle = window.getComputedStyle(el, null)
  const transformProperties = elementStyle
    .getPropertyValue('transform')
    .split('(')[1]
    .split(')')[0]
    .split(',')

  return {
    x: (parseFloat(transformProperties[4]) / el.clientWidth) * 100,
    y: (parseFloat(transformProperties[5]) / el.clientHeight) * 100,
  }
}