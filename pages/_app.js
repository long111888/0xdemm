// import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import '../styles/common.css'
import "@rainbow-me/rainbowkit/styles.css";

import { RainbowKitProvider, darkTheme} from "@rainbow-me/rainbowkit"; 
import { chains, wagmiClient } from "../config/wagmi";
import { WagmiConfig } from "wagmi";
import { StateProvider } from '../store/store'
import { useState, useEffect } from "react";

import UAParser from 'ua-parser-js';
import Router from 'next/router';

function MyApp({ Component, pageProps }) {
  const [loaded, setLoaded] = useState(false)
  useEffect(()=>{
    setLoaded(true)

    const uaParser = new UAParser();
    const userAgent = uaParser.getResult();

    // 判断终端类型
    const isMobile = userAgent.device && userAgent.device.type === 'mobile';

    // 根据终端类型跳转页面
    // if (isMobile) {
    //   Router.push('/mobile');
    // } else {
    //   Router.push('/');
    // }

  }, [])

  return <> 
    {loaded && (
      <StateProvider>
        <WagmiConfig config={wagmiClient}>
          <RainbowKitProvider chains={chains} theme={darkTheme()}>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      </StateProvider>
    )}
  </>
}

export default MyApp
