import { gql } from "@apollo/client";

export const ME_QUERY = gql`
    query Me {
        me {
            _id
            email
            username
            displayName
            avatar
            followers {
                _id
                username
            }
            isStaff
        }
    }
`;
