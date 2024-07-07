import { configureStore } from "@reduxjs/toolkit"
import blogReducer from "./pages/blog/blog.slice"
import { blogApi } from "./pages/blog/blog.service"
import { setupListeners } from "@reduxjs/toolkit/query"
import { rtkQueryErrorLogger } from "./middleware"

export const store = configureStore({
  reducer: {
    // khi minh viet 1 file reducer rieng roi thi minh bo vao `store` de no luu tru
    blog: blogReducer,
    
    // them reducer duoc tao tu API Slice
    [blogApi.reducerPath]: blogApi.reducer
  },

  // them API Middleware de enable cac tinh nang nhu `catching`, `invalidation`, `polling` cua `RTK Query`
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(blogApi.middleware, rtkQueryErrorLogger)
})

// Optional, nhung bat buoc neu dung tinh nang refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch)

// lay RootState va AppDispatch tu store cua chung ta
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// dispatch cho AsynThunk
// export const useAppDispatch = () => useDispatch<AppDispatch>()
