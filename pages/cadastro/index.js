import { useState } from "react";
import { Button, FormControl, Heading, Stack, TextInput } from "@primer/react";
import DefaultLayout from "interface/DefaultLayout";

export default function RegisterPage() {
  return (
    <DefaultLayout
      contentWidth="small"
      metadata={{
        title: "Cadastro",
        description: "Crie sua conta de forma gratuita.",
      }}
    >
      <Stack gap="spacious">
        <Heading as="h1">Cadastro</Heading>
        <RegisterForm />
      </Stack>
    </DefaultLayout>
  );
}

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.status === 201) {
      location.href = "/cadastro/confirmar";
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="normal">
        <FormControl>
          <FormControl.Label>Nome de usuário</FormControl.Label>
          <TextInput
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            block
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>Email</FormControl.Label>
          <TextInput
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            block
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>Senha</FormControl.Label>
          <TextInput
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            block
          />
        </FormControl>
        <Stack.Item>
          <Button type="submit" variant="primary">
            Criar Cadastro
          </Button>
        </Stack.Item>
      </Stack>
    </form>
  );
}
