import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import jwt from "jsonwebtoken";
import Env from "@ioc:Adonis/Core/Env";

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    const users = await User.all();

    return response.json(users);
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param("id");

    const user = await User.find(id);

    return response.json(user);
  }

  public async store({ request, response }: HttpContextContract) {
    const data = request.only(["username", "email", "password"]);

    const user = await User.create(data);
    const token = jwt.sign({ id: String(user.id) }, Env.get("JWT_SECRET"), {
      expiresIn: "1h",
    });

    return response.status(201).json({ user, token });
  }

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param("id");

    const user = await User.find(id);
    user?.delete();

    return response.send("OK");
  }
}
