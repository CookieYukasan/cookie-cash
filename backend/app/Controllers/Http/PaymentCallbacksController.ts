import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Transaction from "App/Models/Transaction";
import User from "App/Models/User";
import { checkPaymentApprove } from "App/Services/MercadoPago";

export default class PaymentCallbacksController {
  public async mercadopago({ request, response }: HttpContextContract) {
    const {
      action,
      data: { id },
    } = request.body();

    if (action !== "payment.updated") return response.badRequest("ERROR");

    const body = await checkPaymentApprove(id);

    console.log(request.body(), body);

    const transaction = await Transaction.find(id);
    if (transaction) transaction.status = body.status;

    if (body.status === "approved") {
      const user = await User.find(transaction?.userId);
      if (user)
        user.balance =
          user.balance + body.transaction_details.total_paid_amount;
      user?.save();
      transaction?.save();
    }

    return response.send("OK");
  }
}
