/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";
import Hash from "@ioc:Adonis/Core/Hash";
import User from "App/Models/User";
import Env from "@ioc:Adonis/Core/Env";
import jwt from "jsonwebtoken";
import Transaction from "App/Models/Transaction";

Route.group(() => {
  Route.get("/me", async ({ request, response }) => {
    const token = request.header("authorization");

    const decoded: any = jwt.verify(String(token), Env.get("JWT_SECRET"));

    const user = await User.query().where("id", decoded.id).first();

    return response.json(user);
  });
  Route.post("/login", async ({ request, response }) => {
    const credentials = request.only(["email", "password"]);

    const user = await User.findByOrFail("email", credentials.email);

    if (!(await Hash.verify(user.password, credentials.password))) {
      return response.status(401);
    }

    const token = jwt.sign({ id: String(user.id) }, Env.get("JWT_SECRET"), {
      expiresIn: "1h",
    });
    return response.json({ user, token });
  });

  Route.get("/transactions", async ({ response }) => {
    const transactions = await Transaction.all();

    return response.json(transactions);
  });

  Route.post("/mercadopago/callback", "PaymentCallbacksController.mercadopago");

  Route.resource("/users", "UsersController").apiOnly();
  Route.resource("/payments", "PaymentsController").apiOnly();
}).prefix("/api");
