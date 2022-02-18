import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { FOLLOW_USER_MUTATION, UNFOLLOW_USER_MUTATION } from '../apollo/queries/user'
import { userStore } from '../stores/user'
import { UserType } from '../types'

export const useFollow = (followUser?: UserType) => {
    const user = userStore(state => state.user)!
    const [isFollowing, setFollow] = useState(
        user ? followUser?.followers.map(s => s._id).includes(user!._id) || false : false
    )
    const [followers, setFollowers] = useState(followUser?.followers?.length || 0)
    const [follow] = useMutation<{ follow: { user: UserType } }>(FOLLOW_USER_MUTATION, {
        variables: { userId: followUser?._id },
        onCompleted: ({ follow: { user: resUser } }) => {
            if (resUser) {
                setFollow(resUser.followers.map(s => s._id).includes(user._id))
                setFollowers(resUser.followers.length)
            }
        }
    })
    const [unfollow] = useMutation<{ unfollow: { user: UserType } }>(UNFOLLOW_USER_MUTATION, {
        variables: { userId: followUser?._id },
        onCompleted: ({ unfollow: { user: resUser } }) => {
            if (resUser) {
                setFollow(resUser.followers.map(s => s._id).includes(user._id))
                setFollowers(resUser.followers.length)
            }
        }
    })
    useEffect(() => {
        if (followUser) {
            setFollow(followUser?.followers.map(s => s._id).includes(user!._id))
            setFollowers(followUser.followers.length)
        }
    }, [followUser])

    return { unfollow, follow, followers, isFollowing }
}
