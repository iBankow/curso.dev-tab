import email from "infra/email";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "Test <test@example.com>",
      to: "recipient@example.com",
      subject: "Teste de assunto",
      text: "Teste de corpo.",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<test@example.com>");
    expect(lastEmail.recipients[0]).toBe("<recipient@example.com>");
    expect(lastEmail.subject).toBe("Teste de assunto");
    expect(lastEmail.text).toBe("Teste de corpo.\n");
  });
});
