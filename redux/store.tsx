import {
  Action,
  combineReducers,
  configureStore,
  createAction,
  getType,
  ThunkAction,
} from '@reduxjs/toolkit'

import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer, { initialStateAuth } from './authReducer'
import commentReducer, { initialStateComment } from './commentReducer'
import commonReducer, { initialStateCommon } from './commonReducer'
import dialogReducer, { initialStateDialog } from './dialogReducer'
import intlReducer, { initialStateIntl } from './intlReducer'
import liveReducer, { initialStateLive } from './liveReducer'
import loginReducer, { initialStateLogin } from './loginReducer'
import shortsReducer, { initialStateShort } from './shortsReducer'
import snackbarReducer, { initialStateSnackBar } from './snackbarReducer'
import studioReducer, { initialStateStudio } from './studioReducer'
import uploadReducer, { initialStateUpload } from './uploadReducer'
import videoReducer, { initialStateVideo } from './videoReducer'

export const clearStoreAfterLogout = createAction('clearStoreAfterLogout')

const initialState = {
  auth: initialStateAuth,
  intl: initialStateIntl,
  snackbar: initialStateSnackBar,
  shortVideo: initialStateShort,
  common: initialStateCommon,
  comment: initialStateComment,
  videoPlayer: initialStateVideo,
  live: initialStateLive,
  studio: initialStateStudio,
  dialog: initialStateDialog,
  upload: initialStateUpload,
  login: initialStateLogin,
}

const persistConfig = {
  key: 'root',
  version: 1.1,
  storage,
  blacklist: ['video', 'live', 'upload', 'snackbar'],
}

function createRootReducer() {
  const reducers = combineReducers({
    auth: authReducer,
    intl: intlReducer,
    snackbar: snackbarReducer,
    shortVideo: shortsReducer,
    comment: commentReducer,
    common: commonReducer,
    live: liveReducer,
    studio: studioReducer,
    videoPlayer: videoReducer,
    dialog: dialogReducer,
    upload: uploadReducer,
    login: loginReducer,
  })

  return (state, action: any) => {
    if (state && action.type === getType(clearStoreAfterLogout)) {
      return reducers(initialState, action)
    }
    return reducers(state, action)
  }
}

const persistedReducer = persistReducer(persistConfig, createRootReducer())

export function makeStore() {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            FLUSH,
            REHYDRATE,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER,
            'video/setPlayerVideo',
            'live/setSocket',
            'short/setPlayerShort',
          ],
          ignoredPaths: [
            'shortVideo.player',
            'shortVideo.quality',
            'shortVideo.metadata.quality',
            'videoPlayer.metadata.quality',
            'videoPlayer.player',
            'videoPlayer.quality',
            'live.socket',
          ],
        },
      }),
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

let persistor = persistStore(store)

export { store, persistor }
