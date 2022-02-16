import { gql } from '@apollo/client'

export const GET_POSTS_QUERY = gql`
    query GetPosts {
        getPosts {
            _id
            title
            content
            likes
            owner {
                _id
                username
                displayName
                email
            }
            comments {
                _id
                content
                likes
                author {
                    username
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
                likes
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
