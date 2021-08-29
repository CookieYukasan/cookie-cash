import { User } from "../contexts/AuthenticationContext";

export function userFormatter(user: User) {
  return {
    ...user,
    readableBalance: new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(user.balance),
  };
}
