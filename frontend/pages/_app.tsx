import type { AppProps } from "next/app";
import { CacheProvider, EmotionCache } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { Analytics } from "@vercel/analytics/react";

import createEmotionCache from "../util/createEmotionCache";
import StoreContextProvider from "../providers/storeContext";

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <>
      <CacheProvider value={emotionCache}>
        <CssBaseline />
        <StoreContextProvider>
          <Component {...pageProps} />
        </StoreContextProvider>
      </CacheProvider>
      <Analytics />
    </>
  );
};

export default MyApp;
