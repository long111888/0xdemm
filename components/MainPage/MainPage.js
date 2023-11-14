import styles from '../../styles/MainPage.module.css'
import { useState } from "react";
import Ranking from "./Ranking"
import { useTokenContract } from "../../data/token";
import { formatAmount } from "../utils";
import useToast from '../Toast'
import Image from 'next/image'

const MainPage = () => {
    const [questionIndex, setQuestionIndex] = useState(0)
    const {balance, token, deadBalance} = useTokenContract();
    const {ToastUI, showToast} = useToast();
    return <>
        <ToastUI />
        <div className={`${styles.container} ${styles.flex_row}`} style={{columnGap: '8px'}} >
            {/* <div className={styles.header + ' ' + styles.flex_row}>
                <img src='demo.png' className={styles.img} />
                
                <div className={`${styles.fontNormal} ${styles.word_style} ${styles.dialog}`}>
                    The <span className={styles.yellow}>Testnet</span> is about to launch, and users who participate in the testnet will have the opportunity to win <span className={styles.yellow}>airdrops</span>. Please stay tuned.
                </div>
                <div className={styles.triangle}/>
               
            </div> */}

            <div className={`${styles.flex_column} ${styles.stress}`} style={{alignItems: "flex-start"}}>
                <div className={styles.fontLargeTilte }>
                    <span style={{color: "#D9001B"}}>0x</span>Demo
                </div>
                <div className={styles.fontBigTitle + ' ' + styles.yellow + ' ' + styles.midlleStress }>
                    Binance Smart Chain Betting DEX.
                </div> 
                <div className={styles.fontTitle + ' ' + styles.white + ' ' + styles.midlleStress}>
                    The world&apos;s first coin-centric betting DEX.
                </div> 
                <div className={styles.fontTitle + ' ' + styles.gray}>
                    Open-source, decentralized，and Community-governed
                </div> 
                
                {/* <div className={styles.fontBigTitle + ' ' + styles.bigStress }>
                    <span style={{color: "#D9001B"}}>0x</span>Demo <span style={{color: "#027DB4"}}>alpha</span> about to go live...
                </div> 

                <div className={`${styles.flex_row} ${styles.buttonRow} ${styles.topStress}`}>
                    <div className={styles.button} onClick={()=>showToast("Coming soon")}>
                            Why 0xDemo?
                    </div>
                    <div className={styles.button} onClick={()=>showToast("Coming soon")}>
                            Tokenomics
                    </div>
                    <div className={styles.button} onClick={()=>showToast("Coming soon")}>
                            Rodmap
                    </div>
                    <div className={styles.button} onClick={()=>{showToast("Coming soon")}}>
                            FAQ
                    </div>
                </div> */}
            </div> 

            <Image width='500' height='500' alt='0xDemo image' src='/cardinal02.png' />
            {/* <div className={`${styles.fontBigTitle} ${styles.bigStress}`}>
                   Burned: <span style={{color: '#D9001B'}}>-{formatAmount(deadBalance)} {token?.symbol}</span> <span style={{color: '#02A7F0'}}>({(deadBalance/(token?.totalSupply.value/1e18)*100).toFixed(6)}%)</span>
            </div> */}

            
            {/* <Ranking /> */}
        </div>
    </>
}

export default MainPage;