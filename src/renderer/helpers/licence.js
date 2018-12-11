export default () => {
    var letterArr = ('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890').split('')
    // ['a', 'F', 'S', 'H', 'n', 'K', 'i', 'P', 'U', 'T', 'Y', 'q', 'X', 'V', 'L', 'R', 'O', 'Z', 'b', 'z', 'C']
    var licence = ''
    for (var i = 0; i < 64; i++) {
      licence = licence + letterArr[Math.floor(Math.random() * (60 - 1 + 1) + 1)]
    }
    return licence
  }