import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyJWT } from "../utils/auth";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const getTransactionsRouter = Router();

getTransactionsRouter.get("/transactions", verifyJWT, async (req, res) => {
  const token = req.headers["authorization"];

  const userData = jwt.decode(token as string);
  const id = userData?.userId;

  const user = await prisma.users.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return res.status(400).send({ error: "User not found!" });
  } else {
    const debitedAccount = await prisma.transactions.findFirst({
      select: {
        debitedAccountId: true,
      },

      where: {
        debitedAccountId: user.accountId,
      },
    });

    const creditedAccount = await prisma.transactions.findFirst({
      select: {
        creditedAccountId: true,
      },

      where: {
        creditedAccountId: user.accountId,
      },
    });

    if (debitedAccount || creditedAccount) {
      const transaction = await prisma.transactions.findFirst({
        where: {
          OR: [
            { creditedAccountId: creditedAccount?.creditedAccountId },
            { debitedAccountId: debitedAccount?.debitedAccountId },
          ],
        },
      });

      return res.status(200).send({ transaction });
    } else {
      return res.status(400).send({ error: "No transactions found!" });
    }
  }
});
