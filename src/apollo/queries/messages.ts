import { gql } from '@apollo/client'

export const GET_MESSAGES_QUERY = gql`
    query GetMessages($before: String, $limit: Float, $channelId: String!) {
        getMessages(before: $before, limit: $limit, channel_id: $channelId) {
            _id
            channel {
                members {
                    _id
                    createdAt
                    email
                    displayName
                    isStaff
                    avatar
                }
                _id
            }
            content
            author {
                _id
                displayName
                username
                avatar
                isStaff
                updatedAt
                createdAt
                email
            }
        }
    }
`
