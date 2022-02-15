import "../styles/main.scss";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { ApolloProvider } from "@apollo/client";
import client from "../apollo/client";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={client}>
            <MantineProvider
                theme={{
                    // Override any other properties from default theme
                    fontFamily: "Poppins, sans-serif",
                    spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 },
                }}
            >
                <Component {...pageProps} />
            </MantineProvider>
        </ApolloProvider>
    );
}

export default MyApp;
