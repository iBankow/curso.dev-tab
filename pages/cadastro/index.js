import DefaultLayout from "interface/DefaultLayout";

export default function RegisterPage() {
  return (
    <DefaultLayout
      metadata={{
        title: "Cadastro",
        description: "Crie sua conta de forma gratuita.",
      }}
    >
      <h1>Cadastro</h1>

      <form>
        <label>
          Nome de usuário:
          <input type="text" name="username" />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" />
        </label>
        <br />
        <label>
          Senha:
          <input type="password" name="password" />
        </label>
        <br />
        <button type="submit">Criar Cadastrar</button>
      </form>
    </DefaultLayout>
  );
}
