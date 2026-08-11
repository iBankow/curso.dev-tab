import DefaultLayout from "interface/DefaultLayout";

function Home() {
  return (
    <DefaultLayout
      metadata={{
        description:
          "Bem-vindo ao Curso.dev, um curso gratuito de desenvolvimento web.",
      }}
    >
      <h1>Bem-vindo ao Curso.dev, um curso gratuito de desenvolvimento web.</h1>
    </DefaultLayout>
  );
}

export default Home;
