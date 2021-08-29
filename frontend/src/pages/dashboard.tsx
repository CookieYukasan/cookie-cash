import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { withSSRAuth } from "../utils/withSSRAuth";
import Head from "next/head";
import { useAuth } from "../contexts/AuthenticationContext";
import { api } from "../services/api";
import { useState } from "react";

type CreatePaymentResponse = {
  qr_code: string;
  qr_code_base64: string;
};

export default function Dashbaord() {
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState<CreatePaymentResponse>(null);

  async function handleCreatePixPayment() {
    const { data } = await api.post<CreatePaymentResponse>("payments", {
      type: "PIX",
      value: 0.1,
    });
    setQrCode(data);
  }

  return (
    <Box>
      <Head>
        <title>Cookie Shop | Dashboard</title>
      </Head>
      <Heading>Saldo: {user?.readableBalance}</Heading>
      <Button onClick={handleCreatePixPayment}>Criar Pagamento</Button>
      {qrCode && (
        <Flex flexDir="column">
          <Text>Pix Copia e Cola: {qrCode.qr_code}</Text>
          <img
            src={`data:image/jpeg;base64,${qrCode.qr_code_base64}`}
            width="260px"
            height="260px"
          />
        </Flex>
      )}
    </Box>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
