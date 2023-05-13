export const copyToClipboard = (text: string) => {
  const textArea = document.createElement('textarea')
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    var successful = document.execCommand('copy')
    return successful
  } catch (err) {
    return false
  } finally {
    document.body.removeChild(textArea)
  }
}

export const formatTimeVideo = (time?: number) => {
  if (!time) {
    return '00:00'
  }
  let hour = Math.floor(time / (60 * 60))
  let min = Math.floor((time - hour * 60 * 60) / 60)
  let sec = Math.floor(time - min * 60 - hour * 60 * 60)
  let string = ''
  if (hour) {
    string += hour.toString()
    string += ':'
  }
  if (min >= 10) {
    string += min.toString()
    string += ':'
  } else {
    string += `0${min}`
    string += ':'
  }
  if (sec >= 10) {
    string += sec.toString()
  } else {
    string += `0${sec}`
  }
  return string
}

export const getTimePlay = (time: number) => {
  if (!time) {
    return '0'
  }
  let totalSeconds = Number(time)
  let hours = Math.floor(totalSeconds / 3600) + ''
  totalSeconds %= 3600
  let minutes = Math.floor(totalSeconds / 60) + ''
  let seconds = (totalSeconds % 60) + ''
  if (hours != '0') {
    return (
      (hours.length == 1 ? '0' + hours : hours) +
      ':' +
      (minutes.length == 1 ? '0' + minutes : minutes) +
      ':' +
      (seconds.length == 1 ? '0' + seconds : seconds)
    )
  } else {
    if (minutes) {
      return (
        (minutes.length == 1 ? '0' + minutes : minutes) +
        ':' +
        (seconds.length == 1 ? '0' + seconds : seconds)
      )
    } else {
      return seconds.length == 1 ? '0' + seconds : seconds
    }
  }
}

export function iOS() {
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  )
}

export function getRandomIndex(usedIndexs, maxIndex) {
  var min = 0
  var max = maxIndex - 1
  var index = Math.floor(Math.random() * (max - min + 1) + min)

  if (maxIndex === 0) {
    return 0
  }
  while (usedIndexs.indexOf(index) > -1) {
    if (index < max) {
      index++
    } else {
      index = 0
    }
  }
  return index
}
