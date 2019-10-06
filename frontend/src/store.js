import {
  applyMiddleware,
  createStore, 
  combineReducers 
} from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import { LOGOUT } from 'actions/user';
import userReducer from 'reducers/user';

const appReducer = combineReducers({
  user: userReducer,
})

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    storage.removeItem('persist:root')

    state = undefined;
  }

  return appReducer(state, action)
}

const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewares = [thunk];
const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

const configureStore = () => {
  const store = createStoreWithMiddleware(persistedReducer);
  const persistor = persistStore(store);
  return {
    store,
    persistor,
  }
}

export default configureStore;
