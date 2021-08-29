import User from "App/Models/User";
import { v4 as uuid } from "uuid";
import mercadopago from "mercadopago";
import Env from "@ioc:Adonis/Core/Env";

mercadopago.configurations.setAccessToken(Env.get("MERCADOPAGO_TOKEN"));

export async function generatePix(pixValue: number, user: User) {
  var payment_data = {
    installments: 1,
    transaction_amount: pixValue,
    description: `Pedido #${uuid()}`,
    payment_method_id: "pix",
    payer: {
      email: user.email,
      first_name: user.username,
      last_name: "Silva",
      identification: {
        type: "CPF",
        number: "00431028400",
      },
      address: {
        zip_code: "06233200",
        street_name: "Av. das Nações Unidas",
        street_number: "3003",
        neighborhood: "Bonfim",
        city: "Osasco",
        federal_unit: "SP",
      },
    },
  };

  const { body } = await mercadopago.payment.create(payment_data);

  return body;
}

export async function checkPaymentApprove(id: number) {
  const { body } = await mercadopago.payment.findById(id);
  return body;
}

export async function changebackPixPayment(id: number) {
  const data = await mercadopago.payment.refund(id);
  return data;
}
