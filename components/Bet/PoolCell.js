import { useCallback, useState, useEffect } from "react";
import styles from "../../styles/BetCell.module.css";
import { useGameContract } from "../../data/game";
import BetArea from "./BetArea";
import BetRecord from "./BetRecord"
import LiveBettingRecord from "./LiveBettingRecord"
import useTokenContract from "../../data/token"
import { formatAmount } from "../utils";
import { BigNumber } from "wagmi"

const Pool = () => {
  
  const [info, setInfo] = useState({})
  const { poolDetails } = useGameContract()
  const [type, setType] = useState("official")
  const {deadBalance, addressTokenContract, token} = useTokenContract()
  const [light, setLight] = useState(true)

  const onChangeType = (e)=>{
    setType(e.target.value)
  }

  useEffect(()=>{
    console.log('set interval');
    let a = 0;
    let i = setInterval(() => {
      a += 1
      setLight(a&1)
    }, 500);
    return ()=>clearInterval(i)
  }, [])
  return (
    <div className={styles.container}>
      {/* <div className={styles.poolTypeAndBurn}>
        <div className={styles.radio}>
          <div >
            <input type="radio" value="official" defaultChecked onClick={onChangeType}/>
            <label className={type=='official'?styles.selected:null}>Official Pool</label>
          </div>
        </div>
        <div className={styles.burn}>
          Burned: <a style={{textDecoration: 'none3', color: '#2471fe'}} target="_blank" rel="noreferrer" href={`https://testnet.bscscan.com/token/${addressTokenContract}?a=0x000000000000000000000000000000000000dead`}>{deadBalance}</a> CDNT
        </div>
      </div> */}
      <div className={styles.info}>
       <div className={styles.info_item}>
        <div className={styles.title}> Initial Pool Fund</div>
        <div className={styles.content}>{poolDetails?formatAmount(poolDetails[0]/1000000000000000000n):'--'} <span style={{color: '#7F7F7F', fontSize: "12px"}}> {token?.symbol} </span></div>
       </div>
       <div className={styles.info_item}>
         <div className={styles.title}> Current Pool Balance</div>
         <div className={styles.content}>{poolDetails?formatAmount(poolDetails[1]/1000000000000000000n):'--'} <span style={{color: '#7F7F7F', fontSize: "12px"}}> {token?.symbol} </span></div>
       </div>
       <div className={styles.info_item}>
        <div className={styles.title}> Total Burned</div>
        <div className={styles.content}> 
          {formatAmount(deadBalance)} <span style={{color: '#7F7F7F', fontSize: "12px"}}>{token?.symbol}</span>
          <a target="_blank" rel="noreferrer" href={`https://testnet.bscscan.com/token/${addressTokenContract}?a=0x000000000000000000000000000000000000dead`}><img style={{marginLeft: '4px', width: '12px', height: '12px'}} src="jump.png"/></a>
        </div>
       </div>
      </div>
      <div className={styles.main}>
        <div className={styles.aera}>
          <div className={styles.bet}>
            <BetArea />
          </div>
        </div>
        <div className={styles.log}>
            <BetRecord />
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.livebetting}>
          <div className={styles.dot} style={{backgroundColor: light?"#6300bf":"#142d23", borderColor: light?"#6300bf":"#142d23"}}/>
          <div className={styles.text}>
            Live Betting
          </div>
        </div>
        <div className={styles.record}>
          <LiveBettingRecord />
        </div>
      </div>
    </div>
  )
}

export default Pool