import { gql } from '@apollo/client'

export const GET_USER_BY_USERNAME_QUERY = gql`
    query FindUser($username: String!) {
        findUser(username: $username) {
            _id
            updatedAt
            username
            createdAt
            displayName
            email
            followers {
                _id
                username
            }
            avatar
            isStaff
        }
    }
`

export const FOLLOW_USER_MUTATION = gql`
    mutation Follow($userId: String!) {
        follow(user_id: $userId) {
            user {
                _id
                username
                email
                avatar
                followers {
                    _id
                    username
                }
                isStaff
                displayName
                updatedAt
                createdAt
            }
            errors {
                message
            }
        }
    }
`

export const UNFOLLOW_USER_MUTATION = gql`
    mutation Unfollow($userId: String!) {
        unfollow(user_id: $userId) {
            errors {
                message
            }
            user {
                _id
                username
                followers {
                    _id
                    username
                }
                isStaff
                avatar
                email
                displayName
                updatedAt
                createdAt
            }
        }
    }
`
