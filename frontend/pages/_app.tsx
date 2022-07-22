import {useEffect} from "react";
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

    const handleRouteChange = () => {
        const head = document.querySelector("head");
        const script = document.createElement("script");
        const originalScript = document.getElementById("tinAnalytics");
        script.defer = true;
        script.src = process.env.NEXT_PUBLIC_TINYANALYTICS_URI!;
        script.id = "tinAnalytics";
        originalScript?.remove();
        head!.appendChild(script);
    };

    useEffect(() => {
        router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        }
    }, [router.events]);

    return (
        <CacheProvider value={emotionCache}>
            <CssBaseline />
            <Component {...pageProps} />
        </CacheProvider>
    );
};

export default MyApp;
