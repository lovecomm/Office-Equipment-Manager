export function determineItemHasSubContent (item, hardwareDescription) {
  console.log('in determineItemHasSubContent, hardwareDescription', hardwareDescription)
  console.log('in determineItemHasSubContent, item', item)
  if (item.photo === undefined) {
    if (item.note !== '' || hardwareDescription !== '') {
      return true
    } else {
      return false
    }
  } else {
    if (item.note !== '' || item.photo.size !== undefined || hardwareDescription !== '') {
      return true
    } else {
      return false
    }
  }
}