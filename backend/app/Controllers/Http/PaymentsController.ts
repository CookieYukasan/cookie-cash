import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import JwtToUserId from "App/Helpers/JwtToUserId";
import User from "App/Models/User";
import { changebackPixPayment, generatePix } from "App/Services/MercadoPago";

export default class PaymentsController {
  public async store({ request, response }: HttpContextContract) {
    const { value } = request.only(["value"]);
    const userId = JwtToUserId(request.header("Authorization"));

    const user = await User.find(userId);

    if (!user) {
      return response.send("ERRO");
    }

    const body = await generatePix(value, user);

    const { qr_code, qr_code_base64 } =
      body.point_of_interaction.transaction_data;

    user.related("transactions").create({
      id: body.id,
      status: body.status,
      type: "pix",
      value,
      qrCode: qr_code,
      qrCodeBase64: qr_code_base64,
    });

    return response.json({ qr_code, qr_code_base64 });
  }

  public async destroy({ request, response }: HttpContextContract) {
    const paymentId = request.param("id");
    await changebackPixPayment(paymentId);
    return response.send("OK");
  }
}
