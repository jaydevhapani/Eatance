import { TYPE_SAVE_NAVIGATION_SELECTION } from "../actions/Navigation";

const initalState = {
  selectedItem: "Home"
};

export function navigationOperation(state = initalState, action) {
  switch (action.type) {
    case TYPE_SAVE_NAVIGATION_SELECTION: {
      return Object.assign({}, state, {
        selectedItem: action.value
      });
    }
    default:
      return state;
  }
}
