import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
/** This is the convention - fromUi */
import * as fromUi from './shared/ui.reducer';

export interface State {
  ui: fromUi.State;
}

export const reducers: ActionReducerMap<State> = {
  ui: fromUi.uiReducer,
};

// this is like: state.ui. ...
export const getUiState = createFeatureSelector<fromUi.State>('ui');
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);
