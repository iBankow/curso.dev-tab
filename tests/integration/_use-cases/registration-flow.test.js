import { version as uuidVersion } from "uuid";
import webserver from "infra/webserver";
import activation from "models/activation";
import user from "models/user";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Use case: Registration Flow(all successful)", () => {
  let createdUser;
  let activationToken;
  let createSessionResponseBody;
  test("Create user account", async () => {
    const createUserResponse = await fetch(
      "http://localhost:3000/api/v1/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "NewUser",
          email: "newuser@email.com",
          password: "validpassword",
        }),
      },
    );

    createdUser = await createUserResponse.json();

    expect(createUserResponse.status).toBe(201);

    expect(createdUser).toEqual({
      id: createdUser.id,
      username: "NewUser",
      features: ["read:activation_token"],
      created_at: createdUser.created_at,
      updated_at: createdUser.updated_at,
    });
  });

  test("Receive activation email", async () => {
    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<no-reply@email.com>");
    expect(lastEmail.recipients[0]).toBe("<newuser@email.com>");
    expect(lastEmail.subject).toBe("Activate your account");
    // expect(lastEmail.text).toContain("RegistrationFlow");

    const activationTokenId = orchestrator.extractUUID(lastEmail.text);

    expect(lastEmail.text).toContain(
      `${webserver.origin}/cadastro/ativar/${activationTokenId}`,
    );

    activationToken = await activation.findOneValidById(activationTokenId);

    expect(activationToken).toEqual({
      id: activationTokenId,
      used_at: null,
      user_id: createdUser.id,
      expires_at: activationToken.expires_at,
      updated_at: activationToken.updated_at,
      created_at: activationToken.created_at,
    });

    expect(uuidVersion(activationToken.id)).toBe(4);
    expect(uuidVersion(createdUser.id)).toBe(4);

    expect(Date.parse(activationToken.created_at)).not.toBeNaN();
    expect(Date.parse(activationToken.updated_at)).not.toBeNaN();
    expect(Date.parse(activationToken.expires_at)).not.toBeNaN();

    expect(activationToken.expires_at > new Date()).toBe(true);
  });

  test("Activate account", async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/activations/${activationToken.id}`,
      {
        method: "PATCH",
      },
    );

    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(Date.parse(responseBody.used_at)).not.toBeNaN();
    expect(responseBody.used_at > responseBody.created_at).toBe(true);
    expect(responseBody.updated_at > responseBody.created_at).toBe(true);

    const updatedUser = await user.findOneByUsername("NewUser");

    expect(updatedUser.features).toEqual([
      "create:session",
      "read:session",
      "read:user:self",
      "update:user",
    ]);
  });

  test("Login", async () => {
    const createSessionResponse = await fetch(
      "http://localhost:3000/api/v1/sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "newuser@email.com",
          password: "validpassword",
        }),
      },
    );

    expect(createSessionResponse.status).toBe(201);

    createSessionResponseBody = await createSessionResponse.json();

    expect(createSessionResponseBody.user_id).toEqual(createdUser.id);
  });

  test("Get user information", async () => {
    const userResponse = await fetch("http://localhost:3000/api/v1/user", {
      headers: {
        cookie: `session_id=${createSessionResponseBody.token}`,
      },
    });

    expect(userResponse.status).toBe(200);

    const userResponseBody = await userResponse.json();

    expect(userResponseBody.id).toEqual(createdUser.id);
  });
});
