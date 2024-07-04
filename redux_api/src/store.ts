import { configureStore } from "@reduxjs/toolkit"
import blogReducer from "./pages/blog/blog.slice"
import { useDispatch } from "react-redux"

export const store = configureStore({
    reducer: {
        // khi minh viet 1 file reducer rieng roi thi minh bo vao `store` de no luu tru
        blog: blogReducer
    }
})

// lay RootState va AppDispatch tu store cua chung ta
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// dispatch cho AsynThunk
export const useAppDispatch = () => useDispatch<AppDispatch>()
