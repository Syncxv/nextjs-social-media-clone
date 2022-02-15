import { Button, Checkbox, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import type { NextPage } from "next";
import styled from "styled-components";
export const CenterForm = styled.form`
    display: grid;
    place-content: center;
    height: 100vh;
`;

const Login: NextPage = () => {
    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },

        validationRules: {
            email: (value) => /^\S+@\S+$/.test(value),
        },
        errorMessages: {
            email: "Not a valid email eh",
            password: "hi",
        },
    });
    return (
        <>
            <CenterForm onSubmit={form.onSubmit((values) => console.log(values))}>
                <TextInput required label="Email" placeholder="your@email.com" {...form.getInputProps("email")} my={10} />
                <TextInput required label="Password" placeholder="your@email.com" {...form.getInputProps("password")} my={10} />
                <Button type="submit">Submit</Button>
            </CenterForm>
        </>
    );
};

export default Login;
