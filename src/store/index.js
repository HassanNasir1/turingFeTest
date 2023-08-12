// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers

import calls from 'src/store/apps/calls'

export const store = configureStore({
  reducer: {
    calls
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
