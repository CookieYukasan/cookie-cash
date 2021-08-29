import { Button, Flex, Heading, Input, VStack } from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";
import { useAuth } from "../contexts/AuthenticationContext";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();

  async function handleSignIn(event) {
    event.preventDefault();
    await signIn({ email, password });
  }

  return (
    <Flex as="main" h="100vh" justify="center" align="center">
      <Head>
        <title>Cookie Shop | Entrar</title>
      </Head>
      <VStack
        as="form"
        spacing="4"
        flexDir="column"
        p="5"
        borderRadius="md"
        minW="350px"
        onSubmit={handleSignIn}
      >
        <Heading fontSize="5xl">COOKIE SHOP</Heading>
        <Input
          placeholder="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button w="100%" colorScheme="blue" type="submit">
          Entrar
        </Button>
      </VStack>
    </Flex>
  );
}
