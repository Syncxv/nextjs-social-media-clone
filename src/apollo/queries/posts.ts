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
