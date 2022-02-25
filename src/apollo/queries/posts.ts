import { gql } from '@apollo/client'

export const GET_POSTS_QUERY = gql`
    query GetPosts {
        getPosts {
            _id
            title
            content
            likes
            commentCount
            owner {
                _id
                username
                displayName
                email
            }
            comments {
                _id
                content
                attachment
                likes
                likedUsers
                author {
                    username
                    displayName
                    _id
                }
            }
            attachment
            likedUsers
            createdAt
            updatedAt
        }
    }
`

export const GET_POST_QUERY = gql`
    query GetPost($post_id: String!) {
        getPost(post_id: $post_id) {
            _id
            title
            content
            attachment
            likes
            likedUsers
            commentCount
            createdAt
            updatedAt
            owner {
                _id
                username
                displayName
                avatar
                isStaff
                createdAt
                updatedAt
            }
            comments {
                _id
                content
                attachment
                likes
                likedUsers
                author {
                    _id
                    username
                    displayName
                    avatar
                    isStaff
                    createdAt
                    updatedAt
                }
                createdAt
                updatedAt
            }
        }
    }
`
export const POST_LIKE_MUTATION = gql`
    mutation LikePost($likePostPostId2: String!) {
        likePost(post_id: $likePostPostId2) {
            errors {
                message
            }
            post {
                _id
                content
                owner {
                    _id
                    username
                }
                likedUsers
            }
        }
    }
`

export const GET_USER_POSTS = gql`
    query GetUserPosts($userId: String!, $limit: Float) {
        getUserPosts(user_id: $userId, limit: $limit) {
            _id
            createdAt
            updatedAt
            content
            attachment
            title
            likedUsers
            commentCount
            owner {
                _id
                updatedAt
                createdAt
                username
                displayName
                avatar
                isStaff
            }
            comments {
                _id
                content
                attachment
                updatedAt
                createdAt
                likedUsers
                author {
                    username
                    displayName
                    avatar
                    isStaff
                }
                updatedAt
            }
        }
    }
`
