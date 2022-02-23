import produce from 'immer'
import create, { GetState, SetState, StoreApi } from 'zustand'
import { StoreApiWithSubscribeWithSelector } from 'zustand/middleware'
import { PostType } from '../types'

export interface PostStoreHEHEHE {
    posts: { [key: string]: PostType }
    getPost: (id: string) => PostType | undefined
    setPosts: (posts: PostType[]) => void
    updatePost: (post: PostType) => void
}

export const _postStore = create<
    PostStoreHEHEHE,
    SetState<PostStoreHEHEHE>,
    GetState<PostStoreHEHEHE>,
    StoreApi<PostStoreHEHEHE>
>((set, get) => ({
    posts: {},
    getPost: (id: string) => get().posts[id],
    setPosts: (posts: PostType[]) =>
        set(state => {
            const temp: { [key: string]: PostType } = {}
            posts.forEach(post => (temp[post._id] = post))
            return { ...state, posts: temp }
        }),
    updatePost: (post: PostType) =>
        set(
            produce((state: PostStoreHEHEHE) => {
                state.posts[post._id] = post
            })
        )
}))
