import { gql } from '@apollo/client'

export const CREATE_MESSAGE_MUTATION = gql`
    mutation CreateMessage($content: String!, $channelId: String!) {
        createMessage(content: $content, channel_id: $channelId) {
            message {
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
            errors {
                message
            }
        }
    }
`
