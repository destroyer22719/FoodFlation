import { useEffect } from "react";
import type { AppProps } from "next/app";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { CssBaseline } from "@mui/material";

import createEmotionCache from "../util/createEmotionCache";
import { useRouter } from "next/router";
interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
    const {
        Component,
        emotionCache = clientSideEmotionCache,
        pageProps,
    } = props;
    const router = useRouter();

    useEffect(() => {
        // since this is a SPA TinyAnalytics won't work after the first page load or refresh
        // this code makes it so it deletes the script tag and inserts the script tag again on route changes
        const handleRouteChange = () => {
            const head = document.querySelector("head")!;
            const originalScript = document.getElementById("tinyAnalytics")!;
            originalScript.remove();
            const script = document.createElement("script");
            script.id = "tinyAnalytics";
            script.defer = true;
            script.src = process.env.NEXT_PUBLIC_TINYANALYTICS_URI || "";
            head.appendChild(script);
        };

        router.events.on("routeChangeStart", handleRouteChange);

        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
        };
    }, []);

    return (
        <CacheProvider value={emotionCache}>
            <CssBaseline />
            <Component {...pageProps} />
        </CacheProvider>
    );
};

export default MyApp;
