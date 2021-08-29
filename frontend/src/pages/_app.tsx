import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "../contexts/AuthenticationContext";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ChakraProvider resetCSS>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  );
}

export default MyApp;
