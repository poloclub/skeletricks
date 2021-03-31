
export function get_absolute_coord(element) {

  // If d3 element is input, convert it into a DOM element
  if ('_groups' in element) {
    element = element['_groups'][0][0]
  }

  // Get the outer rectangle of the element
  let box = element.getBoundingClientRect()

  // Absolute coordinates
  let left_x = box.x
  let right_x = box.x + box.width
  let top_y = box.y
  let bottom_y = box.y + box.height
  
  return [left_x, top_y, right_x, bottom_y]
}

export function pad_number(n, width, z) {
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

export function mk_1st_letter_capital(s) {
  return s.slice(0, 1).toUpperCase() + s.slice(1)
}

export function round_off(x, step) {
  var inv = 1.0 / step
  var val = Math.round(x * inv) / inv
  if (step == 1) {
    val = parseInt(val)
  }
  return val
}

export function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
