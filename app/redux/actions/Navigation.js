export const TYPE_SAVE_NAVIGATION_SELECTION = "TYPE_SAVE_NAVIGATION_SELECTION";

export function saveNavigationSelection(data) {
  return {
    type: TYPE_SAVE_NAVIGATION_SELECTION,
    value: data
  };
}
