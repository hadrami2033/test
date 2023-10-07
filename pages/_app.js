import * as React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../src/theme/theme";
import createEmotionCache from "../src/createEmotionCache";
import FullLayout from "../src/layouts/FullLayout";
import "../styles/style.css";
import { useRouter } from "next/router";
import { AuthProvider } from "../src/context/AuthContext";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter()
  var res = router.route

  React.useEffect(() => {
    if(!localStorage.getItem("authTokens"))
    router.push("/login")
  }, [])

  return (
    <AuthProvider>
    <CacheProvider value={emotionCache}>
      <Head>
        <title>SOGEM</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <ThemeProvider theme={theme}>
        {res !== "/login" ?
          <FullLayout>
            <CssBaseline /> 
            <Component {...pageProps} />
          </FullLayout>
          :
          <Component {...pageProps} />
        }
      </ThemeProvider>

    </CacheProvider>
    </AuthProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
