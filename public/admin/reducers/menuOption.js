import * as types from '../constants/menuOptionType'

const menuOption = (state={
  show:false,
  article:null,
  arrowDown:false,
  top:0
}, action) => {
  switch (action.type) {
    case types.HIDE_MENU: 
      return Object.assign({},state,{show:false})
    case types.SHOW_MENU:
      return Object.assign({},state,{
        show:true,
        article:action.article,
        arrowDown:action.arrowDown,
        top:action.top
      });
    default: return state;
  }
};

export default menuOption;