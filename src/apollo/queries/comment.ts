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
