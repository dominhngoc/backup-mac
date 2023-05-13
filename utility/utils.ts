export function extractHTMLContent(html) {
  if (!html) {
    return null
  }
  return new DOMParser().parseFromString(html, 'text/html').documentElement
    .textContent
}

export const generalPath = (path) => {
  if (path.startsWith('/')) {
    return path
  } else {
    return `/${path}`
  }
}

export const numberFormatter = (num, digits) => {
  return num
  // const lookup = [
  //   { value: 1, symbol: '' },
  //   { value: 1e3, symbol: 'k' },
  //   { value: 1e6, symbol: 'M' },
  //   { value: 1e9, symbol: 'Tỷ' },
  // ]
  // const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  // var item = lookup
  //   .slice()
  //   .reverse()
  //   .find(function (item) {
  //     return num >= item.value
  //   })
  // return item
  //   ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
  //   : '0'
}

export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}
