export interface Timestamp {
    createdAt: string
    updatedAt: string
}

export interface Follower extends Timestamp {
    _id: string
    username: string
}

export interface UserType extends Timestamp {
    _id: string
    username: string
    displayName: string
    email: string
    avatar: string
    followers: Follower[]
    isStaff: boolean
}

export interface Errors {
    message: string
}

export interface FieldError extends Errors {
    field: Fields
}

export interface LoginResponse {
    userLogin: {
        errors: FieldError[]
        user: UserResponse
        accessToken: string
        __typename: string
    }
}

export interface RegisterResponse {
    userRegister: {
        errors: FieldError[]
        user: UserResponse
        accessToken: string
        __typename: string
    }
}
export interface UserResponse extends UserType {
    __typename: string
}
export enum Fields {
    USERNAME = 'username',
    PASSWORD = 'password',
    EMAIL = 'email',
    CAPTION = 'caption',
    UNKOWN = 'unkown'
}

export interface CommentType extends Timestamp {
    _id: string
    content: string
    attachment?: string
    likes: number
    likedUsers: string[]
    author: UserType
}

export interface PostType extends Timestamp {
    _id: string
    title: string
    content: string
    attachment?: string
    likes: number
    likedUsers: string[]
    commentCount: number
    owner: UserType
    comments: CommentType[]
}

export interface ChannelType extends Timestamp {
    _id: string
    members: UserType[]
}

export interface MessageType extends Timestamp {
    _id: string
    content: string
    author: UserType
    channel: ChannelType
}

export enum MESSAGE_STATES {
    SENDING = 'SENDING',
    SENT = 'SENT',
    ERROR = 'ERROR'
}

export const deafultPfp = 'https://i.imgur.com/JUVFPMN.png'
export const apiUrl = 'http://localhost:8000/'
