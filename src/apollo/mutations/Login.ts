import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
    mutation UserLogin($userLoginOptions2: UserLoginArgs!) {
        userLogin(options: $userLoginOptions2) {
            errors {
                field
                message
            }
            user {
                _id
                username
                email
                avatar
                isStaff
            }
            accessToken
        }
    }
`;
