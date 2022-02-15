import { useMutation } from '@apollo/client'
import { Button, Checkbox, TextInput } from '@mantine/core'
import { useForm } from '@mantine/hooks'
import type { NextPage } from 'next'
import Router from 'next/router'
import styled from 'styled-components'
import { LOGIN_MUTATION } from '../apollo/mutations/Login'
import { LoginResponse } from '../types'
export const CenterForm = styled.form`
    display: grid;
    place-content: center;
    height: 100vh;
`

const Login: NextPage = () => {
    const form = useForm({
        initialValues: {
            username: '',
            password: ''
        },

        validationRules: {
            username: value => /^\w{3,}$/.test(value)
        },
        errorMessages: {
            username: 'Ayo needs to be longer than 3',
            password: 'hi'
        }
    })
    const [login] = useMutation(LOGIN_MUTATION, {
        onCompleted: ({ userLogin: res }: LoginResponse) => {
            console.log(res)
            if (res.errors !== null) {
                return res.errors.forEach(err => {
                    form.setFieldError(err.field as 'password' | 'username', err.message)
                })
            }
            localStorage.setItem('token', res.accessToken)
            Router.push('/')
        }
    })
    return (
        <>
            <CenterForm
                onSubmit={form.onSubmit(values => login({ variables: { userLoginOptions2: values } }))}
            >
                <TextInput
                    required
                    label="Username"
                    placeholder="Username"
                    {...form.getInputProps('username')}
                    my={10}
                />
                <TextInput
                    type="password"
                    required
                    label="Password"
                    placeholder="Password"
                    {...form.getInputProps('password')}
                    my={10}
                />
                <Button type="submit">Submit</Button>
            </CenterForm>
        </>
    )
}

export default Login
