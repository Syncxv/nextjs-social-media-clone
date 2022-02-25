import { gql } from '@apollo/client'

export const GET_CHANNELS_QUERY = gql`
    query GetChannels {
        getChannels {
            _id
            members {
                _id
                avatar
                email
                displayName
                username
                updatedAt
                createdAt
                isStaff
            }
        }
    }
`
