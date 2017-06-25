import * as types from '../constants/menuOptionType'

export function hideMenu() {
  return {
    type: types.HIDE_MENU,
    article
  }
}

export function showMenu(article,arrowDown,top) {
  return {
    type: types.SHOW_MENU,
    article,
    arrowDown,
    top
  }
}