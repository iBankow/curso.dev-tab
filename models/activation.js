import user from "models/user";
import email from "infra/email";
import database from "infra/database";
import webserver from "infra/webserver";
import { ForbiddenError, NotFoundError } from "infra/errors";
import authorization from "./authorization";

const EXPIRATION_IN_MILLISECONDS = 60 * 15 * 1000; // 15 minutes

async function findOneValidById(activationTokenId) {
  const activationTokenObject = await runSelectQuery(activationTokenId);
  return activationTokenObject;

  async function runSelectQuery(tokenId) {
    const results = await database.query({
      text: `
        SELECT 
          *
        FROM 
          user_activation_tokens
        WHERE 
          id = $1
          AND expires_at > NOW()
          AND used_at IS NULL
        LIMIT 
          1
        `,
      values: [tokenId],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message:
          "O token de ativação utilizado não foi encontrado no sistema ou expirou.",
        action: "Faça um novo cadastro",
      });
    }

    return results.rows[0];
  }
}

async function create(userId) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newToken = await runInsertQuery(userId, expiresAt);
  return newToken;

  async function runInsertQuery(userId, expiresAt) {
    const results = await database.query({
      text: `
        INSERT INTO 
          user_activation_tokens (user_id, expires_at)
        VALUES 
          ($1, $2)
        RETURNING 
          *
        `,
      values: [userId, expiresAt],
    });

    return results.rows[0];
  }
}

async function markTokenAsUsed(activationTokenId) {
  const usedActivationToken = await runUpdateQuery(activationTokenId);

  return usedActivationToken;

  async function runUpdateQuery(activationTokenId) {
    const results = await database.query({
      text: `
        UPDATE 
          user_activation_tokens
        SET 
          used_at = timezone('utc', NOW()),
          updated_at = timezone('utc', NOW())
        WHERE 
          id = $1
        RETURNING 
          *
        `,
      values: [activationTokenId],
    });

    return results.rows[0];
  }
}

async function activateUserByUserId(userId) {
  const userToActivate = await user.findOneById(userId);

  if (!authorization.can(userToActivate, "read:activation_token")) {
    throw new ForbiddenError({
      message: "Você não pode mais utilizar tokens de ativação.",
      action: "Entre em contato com o suporte.",
    });
  }

  const activatedUser = await user.setFeature(userId, [
    "create:session",
    "read:session",
    "update:user",
  ]);

  return activatedUser;
}

async function sendEmailtoUser(user, activationToken) {
  await email.send({
    from: "Curso.dev <no-reply@email.com>",
    to: user.email,
    subject: "Activate your account",
    text: `Hello ${user.username},\n\nPlease click the link below to activate your account:
\n\n${webserver.origin}/cadastro/ativar/${activationToken.id}`,
  });
}

const activation = {
  create,
  sendEmailtoUser,
  findOneValidById,
  markTokenAsUsed,
  activateUserByUserId,
};
export default activation;
