import { gql } from '@apollo/client'

export const ADD_COMMENT_MUTATION = gql`
    mutation AddComment($postid: String!, $addContent: String!, $addImage: Upload) {
        addComment(post_id: $postid, content: $addContent, image: $addImage) {
            errors {
                message
            }
            post {
                _id
                updatedAt
                createdAt
                attachment
                content
                likedUsers
                owner {
                    _id
                    username
                    displayName
                    avatar
                    isStaff
                }
                comments {
                    _id
                    attachment
                    content
                    likedUsers
                    author {
                        _id
                        displayName
                        username
                        avatar
                        isStaff
                    }
                }
            }
        }
    }
`
