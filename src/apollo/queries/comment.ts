import { gql } from '@apollo/client'

export const COMMENT_LIKE_MUTATION = gql`
    mutation LikeComment($commentId: String!) {
        likeComment(comment_id: $commentId) {
            errors {
                message
            }
            comment {
                _id
                updatedAt
                content
                createdAt
                likedUsers
                author {
                    _id
                    updatedAt
                    createdAt
                    displayName
                    username
                    avatar
                    isStaff
                }
            }
        }
    }
`

export const GET_COMMENTS_AFTER = gql`
    query GetCommentsAfter($after: String!, $postId: String!) {
        getCommentsAfter(after_id: $after, post_id: $postId) {
            _id
            updatedAt
            createdAt
            likes
            content
            attachment
            author {
                _id
                isStaff
                isStaff
                avatar
                email
                displayName
                username
                updatedAt
                createdAt
            }
        }
    }
`
