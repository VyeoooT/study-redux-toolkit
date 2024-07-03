import { createAction, createReducer, current, nanoid } from "@reduxjs/toolkit"
import { initalPostList } from "../../constants/blog"
import { PostType } from "types/blog.type"

interface BlogStateType {
    postList: PostType[]
    editingPost: PostType | null
}

const initialState: BlogStateType= {
    postList: initalPostList,
    editingPost: null
}

// prepare callback
export const addPost = createAction('blog/addPost', function(post: Omit<PostType, 'id'>) {
    return {
        payload: {
            ...post,

            // su dung nanoid cua redux
            id: nanoid()
        }
    }
})

// code theo kieu cu: createAction, createReducer

// export const addPost = createAction<PostType>('blog/addPost')
export const deletePost = createAction<string>('blog/deletePost')

// flow khi edit se co 2 action rieng biet
export const startEditingPost = createAction<string>('blog/startEditingPost')

// khi cancel thi nghia la lam rong, lam rong thi khong can truyen kieu `<string>` vao cho Payload
export const cancelEditingPost = createAction('blog/cancelEditingPost')

export const finishEditingPost = createAction<PostType>('blog/finishEditingPost')

// day la cach dung voi `builder` callback
const blogReducer = createReducer<BlogStateType>(initialState, (builder) => {
    builder
    .addCase(addPost, (state, action) => {
        // immerjs giup chung ta mustate mot cach an toan
        const post = action.payload
        state.postList.push(post)
    })
    .addCase(deletePost, (state, action) => {
        // dung `current` log xem truoc va sau khi xoa
        console.log('start', current(state))

        const postId = action.payload
        const foundPostIndex = state.postList.findIndex((post) => post.id === postId)

        if (foundPostIndex != -1) {
            state.postList.splice(foundPostIndex, 1)
        }

        console.log('end', current(state));
    })
    .addCase(startEditingPost, (state, action) => {
        const postId = action.payload
        const foundPost = state.postList.find((post) => post.id === postId) || null

        state.editingPost = foundPost
    })
    .addCase(cancelEditingPost, (state) => {
        state.editingPost = null
    })
    .addCase(finishEditingPost, (state, action) => {
        const postId = action.payload.id
        console.log(postId)

        state.postList.some((post, idx) => {
            if (post.id === postId) {
                state.postList[idx] = action.payload
                return true
            }

            return false
        })

        state.editingPost = null
    })

    // dynamic case `addMatcher`
    .addMatcher((action) => action.type.includes('cancel'), (state) => {
        console.log(current(state))
    })
})

export default blogReducer
