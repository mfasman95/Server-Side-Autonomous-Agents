import { createStore, combineReducers } from 'redux';
import routerReducer from './reducers/router.reducer';
import mainReducer from './reducers/main.reducer';

export default createStore(combineReducers({
  route: routerReducer,
  main: mainReducer,
}));
