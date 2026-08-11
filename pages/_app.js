import "@primer/primitives/dist/css/functional/themes/light.css";
import { BaseStyles, ThemeProvider } from "@primer/react";

function RootLayout({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <BaseStyles>
        <Component {...pageProps} />
      </BaseStyles>
    </ThemeProvider>
  );
}

export default RootLayout;
