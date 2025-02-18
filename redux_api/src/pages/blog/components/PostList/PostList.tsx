import { useSelector } from "react-redux"
import PostItem from "../PostItem"
import { RootState, useAppDispatch } from "../../../../store"
import { deletePost, getPostList, startEditingPost } from "../../blog.slice"
import { useEffect } from "react"
import SkeletonLoadingPost from "../Skeleton"

// goi API trong useEffect()
// neu goi thanh cong thi dispatch action type: "blog/getPostListSuccess"
// neu goi that bai thi dispatch action type: "blog/getPostListFailed"
// -> xu ly bat dong bo trong component, khong xu ly bat dong bo trong ```creataSlice > reducers```

export default function PostList() {
    const dispatch = useAppDispatch()

    // lay ra du lieu
    const postList = useSelector((state: RootState) => state.blog.postList)

    // loading
    const loading = useSelector((state: RootState) => state.blog.loading)

    useEffect(() => {
        const promise = dispatch(getPostList())

        // reject get data 1 lan
        return () => {
            promise.abort()
        }
    }, [dispatch])


    // xoa 1 item, truyen callback lay id cua postItem
    const handleDelete = (postId: string) => {
        // truyen id cua post vao de dispatch len store
        dispatch(deletePost(postId))
    }

    // edit 1 item, lay toan bo du lieu cua post qua id
    const handleStartEditing = (postId: string) => {
        dispatch(startEditingPost(postId))
    }

    return (
        <div className='bg-white py-6 sm:py-8 lg:py-12'>
            <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
                <div className='mb-10 md:mb-16'>
                    <h2 className='mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl'>Được Dev Blog</h2>
                    <p className='mx-auto max-w-screen-md text-center text-gray-500 md:text-lg'>
                        Đừng bao giờ từ bỏ. Hôm nay khó khăn, ngày mai sẽ trở nên tồi tệ. Nhưng ngày mốt sẽ có nắng
                    </p>
                </div>
                <div className='grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8'>
                    {/* call loading */}
                    {loading && (
                        <>
                            <SkeletonLoadingPost />
                            <SkeletonLoadingPost />
                            <SkeletonLoadingPost />
                            <SkeletonLoadingPost />
                        </>
                    )}

                    {!loading &&
                        postList.map((item) => (
                            <PostItem key={item.id} post={item} handleDelete={handleDelete} handleStartEditing={handleStartEditing}/>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
