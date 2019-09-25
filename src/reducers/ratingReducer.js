import { FETCH_RATINGS, NEW_RATING, REMOVE_RATING, UPDATE_RATING } from '../actions/types';

const initialState = {
  items: null,
  item: {},
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_RATINGS:
      return {
        ...state,
        items: action.payload,
        item: {},
        error: action.error
      };
    case NEW_RATING:
      return {
        ...state,
        item: action.payload,
        error: action.error
      };
    case REMOVE_RATING:
      return {
        ...state,
        item: action.payload,
        error: action.error
      }
    case UPDATE_RATING:
      return {
        ...state,
        item: action.payload,
        error: action.error
      }

    default:
      return state;
  }
}