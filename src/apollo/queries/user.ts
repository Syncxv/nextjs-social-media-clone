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
