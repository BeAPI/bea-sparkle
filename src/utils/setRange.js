export const setRange = obj => {
  for (let k in obj) {
    if (obj[k] === undefined) {
      obj[k] = [0, 0]
    } else if (typeof obj[k] === 'number') {
      obj[k] = [-1 * obj[k], obj[k]]
    }
  }
}