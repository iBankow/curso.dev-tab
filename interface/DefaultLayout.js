import Head from "next/head";

import { Header, PageLayout, Text } from "@primer/react";

export default function DefaultLayout({ children, metadata = {} }) {
  return (
    <>
      <Head>
        <title>
          {metadata.title ? `${metadata.title} · Curso.dev` : "Curso.dev"}
        </title>
        <meta
          name="description"
          content={
            metadata?.description ||
            "Curso.dev é um curso gratuito de desenvolvimento web."
          }
        />
      </Head>
      <Header>
        <Header.Item full>
          <Header.Link href="/">Curso.dev</Header.Link>
        </Header.Item>
        <Header.Item>
          <Header.Link href="/">Login</Header.Link>
        </Header.Item>
        <Header.Item>
          <Header.Link href="/cadastro">Cadastrar</Header.Link>
        </Header.Item>
      </Header>
      <PageLayout>
        <PageLayout.Content>{children}</PageLayout.Content>
        <PageLayout.Footer divider={"line"}>
          <Text size="small">© {new Date().getFullYear()} Curso.dev.</Text>
        </PageLayout.Footer>
      </PageLayout>
    </>
  );
}
