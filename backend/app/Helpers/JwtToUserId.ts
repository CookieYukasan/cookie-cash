import jwt from "jsonwebtoken";
import Env from "@ioc:Adonis/Core/Env";

export default function JwtToUserId(jwtEncoded) {
  const decoded: any = jwt.verify(jwtEncoded, Env.get("JWT_SECRET"));

  return decoded.id;
}
