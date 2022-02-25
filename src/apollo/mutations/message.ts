import { gql } from '@apollo/client'

export const CREATE_MESSAGE_MUTATION = gql`
    mutation CreateMessage($content: String!, $channelId: String!) {
        createMessage(content: $content, channel_id: $channelId) {
            _id
            channel {
                _id
                members {
                    username
                    _id
                    isStaff
                    avatar
                    email
                    displayName
                    updatedAt
                    createdAt
                }
            }
            author {
                _id
                isStaff
                avatar
                email
                displayName
                username
                updatedAt
                createdAt
            }
            content
        }
    }
`
