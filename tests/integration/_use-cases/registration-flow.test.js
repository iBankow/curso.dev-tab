import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Use case: Registration Flow(all successful)", () => {
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

    const createdUser = await createUserResponse.json();

    expect(createUserResponse.status).toBe(201);

    expect(createdUser).toEqual({
      id: createdUser.id,
      username: "NewUser",
      email: "newuser@email.com",
      features: ["read:activation_token"],
      password: createdUser.password,
      created_at: createdUser.created_at,
      updated_at: createdUser.updated_at,
    });
  });

  test("Receive activation email", async () => {});
});
