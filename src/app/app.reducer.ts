export interface State {
  isLoading: boolean;
}

const initialState: State = {
  isLoading: false
};

export function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'START_LOADING':
      return {
        isLoading: true
      };
    case 'STOP_LOADING':
      return {
        isLoading: false
      };
    default:
      return state;
  }
}


// import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
// import * as fromUi from './shared/ui.reducer';

// export interface State {
//   ui: fromUi.State;
// }

// const reducers: ActionReducerMap<State> = {
//   ui: fromUi.uiReducer,
// };

// // this is like: state.ui. ...
// export const getUiState = createFeatureSelector<fromUi.State>('ui');
// export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);
