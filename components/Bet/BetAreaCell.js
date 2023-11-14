import { useCallback, useState, useRef, useEffect, useContext } from "react";
import { useTokenContract } from "../../data/token";
import { useGameContract } from "../../data/game";
import {ethers} from "ethers"
import styles from "../../styles/BetCell.module.css";
import Fireworks from "../animPaper";
import ReactLoading from 'react-loading';
import { store, SET_LOG_CHANGE, SET_ACTION} from '../../store/store'
import useDispatch from '../../store/useDispatch'
import Modal, { ConfirmationModal, useModal } from '../Tips';
import { useAccount, useNetwork} from 'wagmi';
import useToast from '../Toast'
import { useConnectModal, useChainModal } from '@rainbow-me/rainbowkit';
import { formatAmount, isDictEmpty } from "../utils";
import { BetStatus } from "../constant"
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import Typography from '@mui/material/Typography';
import StepLabel from '@mui/material/StepLabel';
import CustomizedSteppers from './Progress'
import axios from "axios";

const BetAreaCell = () => {
  const rules = [{key: 0, value: '1-Star (5x)', number: 5, select: 1, odds: 5}, {key: 1, value: '1-Star (10x)', number: 10, select: 1, odds: 10}, {key: 2, value: '2-Star (100x)', number: 10, select: 2, odds: 100}]
  const [stepNodes, setStepNodes] = useState({ bet: [{name: 'Comfirm in Wallet', cost: 0}, {name: 'Bet completed', cost: 0}, {name: 'Result fetched', cost: 0}], 
               approve: [{name: 'Approve submited',cost: 0}, {name: 'Approve completed', cost: 0}], 
              withdraw: [{name: 'Withdraw submited', cost: 0},  {name: 'Withdraw completed', cost: 0}] })

  const [stepInfo, setStepInfo] = useState({steps: [], active: 0, isShow: false, stepTitle: '', stepMsg: ''})
  const {steps, active, isShow, stepTitle, stepMsg, costInfo} = stepInfo

  const [title, setTitle] = useState(rules[0])
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [numbers, setNumbers] = useState([])
  const [showFireworks, setShowFireworks] = useState(false)
  const [costTime, setCostTime] = useState(0)
  const [tipInfo, setTipInfo] = useState({})

  const dispatch = useDispatch()
  const {
        state: { betAction, betLogs },
  } = useContext(store)
  const {ToastUI, showToast} = useToast()

  const {address, isConnected} = useAccount()
  const {balance, token} = useTokenContract()
  const {poolDetails, bet, result, withdraw, last} = useGameContract(true)
  const {chain, chains} = useNetwork()
  const {openConnectModal} = useConnectModal()
  const { openChainModal } = useChainModal();

  useEffect(()=>{
    if (address && last && !isDictEmpty(last)) {
      console.log(`last record: ${JSON.stringify(last)}`);
      setTipInfo(last)
    }}, [])

  useEffect(()=>{
    let l = JSON.parse(localStorage.getItem("LAST_STEPNODEINFO"))
    if ( l != null && l != undefined) {
      setStepNodes(l)
    }
  }, [])

  useEffect(()=>{
    if (address) {
      console.log(last);
      let l = JSON.parse(localStorage.getItem("BET_LOG_" + address))
      if ( l == null || l == undefined || l.length==0) {
        l = []
        localStorage.setItem("BET_LOG_"  + address, "[]");
      } 
      dispatch({
        type: SET_LOG_CHANGE,
        payload: l
      })
    }
  }, [address])

  useEffect(()=>{
    if ( address ) {
      if ( betLogs != null && betLogs != undefined && betLogs.length > 0 ) {
        localStorage.setItem("BET_LOG_" + address, JSON.stringify(betLogs));
      }
    }
  }, [betLogs])

  useEffect(()=>{
    console.log(`useEffect tipInfo changed ${JSON.stringify(tipInfo)}`);
    if (tipInfo === null || isDictEmpty(tipInfo)) {
      return;
    }
    console.log(betLogs);
    //update betlogs
    if ( betLogs!= null && betLogs != undefined && betLogs.length != 0 ) {
      for (let index = 0; index < betLogs.length; index++) {
        if (tipInfo.id === betLogs[index].id) {
          //update old
          if ( tipInfo.status === BetStatus.revert) {
            betLogs.splice(index, 1)
          } else if (betLogs[index].status === BetStatus.withdrawed &&  tipInfo.status === BetStatus.win) {
            
          } else {
            tipInfo.time = betLogs[index].time
            tipInfo.transactionHash = betLogs[index].transactionHash
            betLogs[index] = tipInfo
          }

          dispatch({
            type: SET_LOG_CHANGE, 
            payload: [...betLogs]
          })
          return
        }
      }
      if (tipInfo.time === undefined || tipInfo.time === null) {
        tipInfo.time = Date.parse(new Date())
      }
      //new
      dispatch({
        type: SET_LOG_CHANGE, 
        payload: [tipInfo, ...betLogs]
      })
    } else { 
      if (tipInfo.time === undefined || tipInfo.time === null) {
        tipInfo.time = Date.parse(new Date())
      }
      dispatch({ 
        type: SET_LOG_CHANGE,
        payload: [tipInfo]
      })
    }
  }, [tipInfo])
 
  const getTitle = (odds)=>{
    let title = { 5: '1-Star (5x)', 10: '1-Star (10x)', 100: '2-Star (100x)', '5': '1-Star (5x)', '10': '1-Star (10x)', '100': '2-Star (100x)' }
    return title[odds]
  }
 
  useEffect(()=>{
    if (address == undefined) {
      // showToast('please connect the wallet!', 'error' )
      return
    }

    if (chain == undefined) {
      return
    }

    if (!chains.find((c)=>{return c.id==chain?.id})) {
      // showToast('wrong chain! please switch chain in wallet!', 'error' )
      return
    }

    if (betAction == null) {
      return
    } else if (betAction.action==="view") {
      setTipInfo(betAction)
      setIsLoading(true)
      setStepInfo((pre)=>{return {...pre, stepMsg: InfoTip(betAction)}})

      dispatch({
        type: SET_ACTION,
        payload: {}
      })
    } else if (betAction.action==="query") {
      setTipInfo(betAction)
      setIsLoading(true)
      setStepInfo((pre)=>{return {...pre, stepMsg: InfoTip(betAction)}})
      queryResult(betAction.id)

      dispatch({
        type: SET_ACTION,
        payload: {}
      })
    } else if (betAction.action==="withdraw") {
      console.log('betAction:' + JSON.stringify(betAction));
      setTipInfo(betAction)
      betAction.status === BetStatus.win ? withdrawWin(betAction) : withdrawTimeout(betAction);
      dispatch({
        type: SET_ACTION,
        payload: {}
      })
    }
    
  }, [betAction])
  
  //update const time in stepper 
  useEffect(()=>{
    if ( stepInfo.active === 0 && stepTitle != '' ) {
      setStepNodes((pre)=>{
        let node = pre[stepTitle]
        for (let index = 0; index < node.length; index++) {
          node[index].cost = 0;
        }
        return pre
      })
      return 
    }

    if ( stepInfo.active > 0 && stepInfo.active < stepNodes[stepTitle].length ) {
      const interval = setInterval(() => {
        setStepNodes((pre)=>{
          let node = pre[stepTitle]
          node[stepInfo.active].cost += 1
          return pre
        })
      }, 1000);

      return (()=>{
        console.log("-----------------");
        localStorage.setItem("LAST_STEPNODEINFO", JSON.stringify(stepNodes))
        clearInterval(interval)
      })
    }
  }, [stepInfo])
  
  const ruleClick = useCallback((t)=>()=>{
    setTitle(t);
    setNumbers([])
  }, [setTitle])

  const numberSelect = useCallback((n, l)=>()=>{
    if (title.select == 1) {
      setNumbers([n])
    } else {
      numbers[l] = n
      setNumbers(numbers.slice(0))
    }
    
  }, [numbers, setNumbers])
  
  const formatNumber = () => {
    if (numbers.length === 1) {
      return numbers[0]
    }
    return numbers[0]*10 + numbers[1]
  }

  const handleChange = useCallback(
      (e) => {
          e.target.value = e.target.value.replace(/[^\d]/g, "")
          setAmount(e.target.value)
      },
      [setAmount],
  )

  const withdrawTimeout = (info)=>{
    setIsLoading(true)
    setActiveStep('withdraw', 0, InfoTip(info))
    
    withdraw(info.id, ()=>{
      setIsLoading(false)
      showToast('Withdraw Successful', 'success')
      setBetResult(BetStatus.withdrawed_timeout)
    }, (e)=>{
      setIsLoading(false)
      let msg = e.shortMessage || e.reason || e.data?.message || e.message;
      showToast(msg, 'error')
      console.log(msg);
      //fix status
      if ( msg?.indexOf("no betting") != -1 ) {
        setBetResult(BetStatus.withdrawed_timeout)
      }
    }, setActiveStep)
  }

  const withdrawWin = (info)=>{
    setIsLoading(true)
    setActiveStep('withdraw', 0, InfoTip(info))

    withdraw(info.id, ()=>{
      setStepInfo((pre)=>{
        return {...pre, stepMsg: getStepMsg("CONGRATULATIONS", <div style={{color: 'white'}}>WITHDRAW SUCCEED!</div>)}
      })
      setBetResult(2)
    }, (e)=>{
      setIsLoading(false)
      showToast(e.shortMessage || e.reason || e.data?.message || e.message, 'error')
      console.log(e.reason);
      //fix status
      if ( e.reason?.indexOf("no betting") != -1 ) {
        setBetResult(2)
      }
    }, setActiveStep)
  }

  const setBetResult = (result, random='-') => {
    console.log(`entry setBetResult`);
    setTipInfo((preTip)=>{
      console.log(`preLog ${JSON.stringify(preTip)}`);
      if (preTip != null && preTip != undefined) {
        return {...preTip, status: result, action: null}
      }
    })
  } 
   
  const queryResult = (id)=>{
    setActiveStep('bet', 2)
    let i = setInterval(() => {
        result(id, (r)=>{
          clearInterval(i)

          console.log(`entry result success`);
          setActiveStep('bet', 3)
          if (r[1] && r[0].toNumber() == id) {
              setShowFireworks(true)
              setTimeout(() => {
                setShowFireworks(false)
              }, 4000);

            setTipInfo((preTip)=>{
              return {...preTip, status: BetStatus.win, action: null, random: preTip.number}
            })

            setStepInfo((pre)=>{
              return {...pre, stepMsg: getStepMsg("CONGRATULATIONS", "YOU WIN THE BET!")}
            })

            console.log('you win');
          } else {
            setTipInfo((preTip)=>{
              return {...preTip, status:BetStatus.failed, random: r[2],  action: null}
            })

            setStepInfo((pre)=>{
              return {...pre, stepMsg: (<>
                <span style={{font: '650 20px normal sans', color: '#420080', textAlign: 'center', padding: '40px 0px 20px 0px'}}>YOU LOST THE BET</span>
                <div style={{paddingBottom: '20px'}}>
                <span style={{font: '650 18px normal sans', color: '#FFFFFF', textAlign: 'center'}}><p>Not Every Losing Bet Is A Bad Beat.<br/>Next time, you will definitely win.<br/>Go for it!</p></span>
                </div>
                </>)
                }
            })
            console.log('you lose');
          }
         
        }, (e)=>{
          console.log(`entry result fail`);
          // console.log(e);
          if ( e?.reason != undefined && e?.reason?.indexOf("no result") != -1 ) {
            return
          }
          clearInterval(i)
          // setIsLoading(false)
          console.log(e);

          if ( e?.reason != undefined && e?.reason?.indexOf("timeout") != -1) {
            console.log('timeout');
            // showModel(<span style={{color: '#F59A23', textAlign: 'center', fontWeight: 'bold'}}><p>Your betting is timeout,</p> <p>you can withdraw your amount!</p></span>, 'Timeout', "Withdraw");
            setBetResult(BetStatus.timeout, '-')
            setActiveStep('bet', 3, <>
                <span style={{font: '650 20px normal sans', color: '#420080', textAlign: 'center', padding: '40px 0px 20px 0px'}}>TIME OUT</span>
                <div style={{paddingBottom: '20px'}}>
                <span style={{font: '650 18px normal sans', color: '#FFFFFF', textAlign: 'center'}}><p>Due to network congestion, there has been a timeout. <br />Please withdraw the principal of this bet and bet again.</p></span>
                </div>
                </>)
          } else if (e?.reason != undefined && e?.reason?.indexOf("no betting") != -1){
            setBetResult(BetStatus.revert, '-')
            setActiveStep('bet', 3, <>
                <span style={{font: '650 20px normal sans', color: '#420080', textAlign: 'center', padding: '40px 0px 20px 0px'}}>NO RECORD</span>
                <div style={{paddingBottom: '20px'}}>
                <span style={{font: '650 18px normal sans', color: '#FFFFFF', textAlign: 'center'}}><p>No bet record found. <br />Maybe some error in local storage!</p></span>
                </div>
                </>)
          }
        })
      }, 3000);
  }

  const getStepMsg = (title, content) => {
    return (<><div style={{color: '#8400FF', font: '700 20px normal sans', paddingBottom: '24px'}}>{title}</div><div style={{color: '#6300bf', font: '700 28px normal sans'}}>{content}</div></>)
  } 

  const betSuccess = useCallback((r)=>{
      console.log(`entry betSuccess`);
      setTipInfo((pre)=>{
        queryResult(pre.id)
        return {...pre, transactionHash: r.transactionHash, status: BetStatus.submitted}
      })
    }, [amount, numbers, title, isLoading, tipInfo])

  const betFail = useCallback((err)=>{
      console.log(`entry betFail`);
      setIsLoading(false)
      if (err.reason && err.reason.indexOf("you win, please withdraw") != -1) {
        setTipInfo((preTip)=>{
          return {...preTip, status: BetStatus.revert}
        })
        // showModel(<span style={{color: '#F59A23', textAlign: 'center', fontWeight: 'bold'}}><p></p> <p>please withdraw first before placing your bet</p></span>, "Please withdraw first before betting", 'Withdraw')
        showToast("You have a non-withdrawal record, please withdraw before placing your bet!", 'error')
      } else {
        setTipInfo((preTip)=>{
          return {...preTip, status: BetStatus.revert}
        })
        showToast(err.reason || err.data?.message || err.message || "Bet failed, please try again!", 'error')
      }
    }, [amount, numbers, title, isLoading, tipInfo, setTipInfo])

  const setActiveStep = (type, step, msg=null)=>{
    if (type === 'bet' && step === 1) {
      setTipInfo((pre)=>{ return {...pre, status: BetStatus.confirmed}})
    }
    console.log('-------' + step + '-------');
    setStepInfo((pre)=>{
      return {...pre, steps: stepNodes[type], active: step, stepTitle: type, isShow: true, stepMsg: msg || pre.stepMsg}
    })
  }

  const submitBet = ()=>{
    if (!isConnected) {
      openConnectModal()
      return
    }
    console.log(chain);
    if (chains.map(c=>c.id).indexOf(chain?.id) === -1) {
      openChainModal()
      return
    }

    if ( !amount || amount === 0 ) {
      showToast('input amount please!', 'error' )
      return
    }

    const poolRemainBalance = poolDetails?poolDetails[1].hex/1000000000000000000:10e8
    if ( parseFloat(amount)>poolRemainBalance*title.odds ) {
      showToast('amount too large!', 'error' )
      return
    }

    console.log(numbers[0], title.select);
    if ( !numbers || numbers.length != title.select) {
      showToast(`select ${title.select?'one number':'two numbers'} please!`, 'error' );
      return;
    }

    const id = Date.parse(new Date).toString()
    setTipInfo(()=>{
      return {id: id, time: Date.parse(new Date),  type: title.value, number: formatNumber(numbers), amount: amount, odds: title.odds, status: BetStatus.started, random: '-'}
    })

    setIsLoading(true)
    setStepInfo({ 
      stepMsg:  InfoTip({type:title.value, odds:title.odds, number:formatNumber(numbers), amount:amount, win:false})
    })
    
    if (!bet(id, amount, title.key, formatNumber(numbers), betSuccess, betFail, setActiveStep)){
      setIsLoading(false)
      showToast("connect wallet first!",  'error')
    }
  }
  const showTipButton = () => {
    if ( tipInfo.status >= BetStatus.failed ) {
      if ( stepInfo.active === 0 && stepInfo.active < 2 ) {
        return false
      }
      return true
    }
    return false
  }

  const InfoTip = ({type, odds, number, amount, status=-3}) => {
    const formatNumber = (number, odds) => {
      if (number == 'undefined' || odds == 'undefined') {
        return '';
      }

      if (typeof number == 'number' ) 
      {
        number = number.toString()
      }

      if (odds > 10) {
        return number.padStart(2, '0')
      } else {
        return number
      }
    }

    return (<>
        <div className={styles.tipLine}>
          <div className={styles.tipTilte}>Type</div>
          <div className={styles.tipValue}>{type?type:''}</div>
        </div>
        <div className={styles.tipLine}>
          <div className={styles.tipTilte}>Multiplier</div>
          <div className={styles.tipValue}>{odds?odds:''}x</div>
        </div>
        <div className={styles.tipLine}>
          <div className={styles.tipTilte}>Bet Number</div>
          <div className={styles.number} style={formatNumber(number, odds).length>=2?{fontSize: '16px'}:{}}>{formatNumber(number, odds)}</div>
        </div>
        <div className={styles.tipLine}>
          <div className={styles.tipTilte}>Bet Amount</div>
          <div className={styles.tipValue}>{formatAmount(amount?amount:'')}</div>
        </div>
        <div className={styles.tipLine}>
          <div className={styles.tipTilte}>{status==BetAreaCell.win?'Payout':'Potential Payout' }</div>
          <div className={styles.tipValue}>{formatAmount(amount*odds)}</div>
        </div>
        <div className={styles.tipLine}>
          <div className={styles.tipTilte}>{status==BetAreaCell.win?'Net Win':'Potential Net Win'}</div>
          <div className={styles.tipValue}>{formatAmount(amount*odds-amount)}</div>
        </div>
        <div className={styles.tipLine}>
          <div className={styles.tipTilte}>{status==BetAreaCell.win?'Net Profit':'Potential Net Profit'}</div>
          <div className={styles.tipValue}>{formatAmount(amount*((odds-1)*0.8+1))}</div>
        </div></>)
  }

  return (
    <div className={styles.bet_container}>
      {isLoading && <div className={`${isLoading?styles.display:styles.displayNone} ${styles.umask}`}>
        <div className={styles.loading_container}>
          <div style={{font: '700 18px normal sans-serif', padding: '0px 0 40px 0'}}>{stepTitle?stepTitle.charAt(0).toUpperCase() + stepTitle.slice(1):''} tracking</div>
          {!isShow?
            <ReactLoading type='spinningBubbles' color='#6300bf' height={'16%'} width={'12%'} />:
            <CustomizedSteppers steps={steps} curStep={active} />}
          <div style={{color: '#AAAAAA', textAlign: 'left', width: '90%', font: '650 16px normal sans', paddingBottom: '8px'}}>{stepTitle?stepTitle.charAt(0).toUpperCase() + stepTitle.slice(1):''} Information</div>
          <div className={styles.tipContent}>
            {stepMsg}
          </div>
          <button disabled={(!stepInfo || !stepTitle || stepInfo?.active !== stepNodes[stepTitle]?.length)? true : false} style={{height: '48px', border: 'none', cursor: 'pointer', width: '90%', marginTop: '8px', backgroundColor: (!stepInfo || !stepTitle || stepInfo?.active != stepNodes[stepTitle]?.length)? '#333':'#f40000'}}  onClick={()=>{
            tipInfo.status == BetStatus.win && stepTitle === 'bet'? withdrawWin(tipInfo) : setIsLoading(false)
            }}>
            { stepInfo.active != stepNodes[stepTitle]?.length? 
                "Processing...":
                (tipInfo.status === BetStatus.win || tipInfo.status === BetStatus.timeout) && stepTitle === 'bet' ?
                    "Withdraw":"Got It"
            }
          </button>
        </div>
      </div>}

      <div className={styles.play_area}>
           <div className={styles.rule_tab}>
       { rules.map(r => {
          return <div className={styles.rule_button} key={r.key} onClick={ruleClick(r) } style={{
            backgroundColor: r.value===title.value?"#142d23":"", 
            // borderRight: r.key!==2?"solid 1px #333":"",
            borderBottom: r.value===title.value?"2px solid #6300bf":"none"}}>{r.value}</div>
         })
        }
      </div>

        <div className={styles.pool_title}>
          <div className={styles.line_title}>
            {title.value}
          </div>
          <div className={styles.content_text}>
            Winning occurs when the chosen number matches the result of the random number draw.
          </div>
        </div>
        <div className={styles.line}>
          <div className={styles.content_text}>
            Bet number
          </div>
          <div className={styles.content_text}>
            Multiplier: <span style={{color: "#6300bf"}}> {title.odds}x </span>
          </div>
        </div>
        
        <div className={styles.number_list}>
          <div className={styles.number_line}>
            { [...Array(title.number).keys()].map(r => {
                return <div className={numbers[0]==r?styles.number_selected:styles.number} key={r} onClick={numberSelect(r, 0)}>{r}</div>
              })
            }
          </div>
          {title.select==2 && <div className={styles.number_line}>
            { [...Array(title.number).keys()].map(r => {
                return <div className={numbers[1]==r?styles.number_selected:styles.number} key={r} onClick={numberSelect(r, 1)}>{r}</div>
              })
            }
          </div>}
        </div>

        <div className={styles.line}>
          <div className={styles.content_text}>
            Bet Amount
          </div>
          <div className={styles.content_text}>
            Balance:  {balance=="--"?balance:formatAmount(balance)} {token?.symbol}
          </div>
        </div>
        <div className={styles.amount}>
          <input className={styles.input} style={{width: '80%'}} type='numbmic' placeholder='Input amount' value={amount} onChange={handleChange}/>
          <button className={styles.input} style={{cursor: 'pointer'}} onClick={()=>setAmount(parseInt(balance))} > MAX </button>
        </div>
        <button className={styles.submit} onClick={submitBet} style={chains.map(c=>c.id).indexOf(chain?.id) != -1 && (amount === '' || numbers.length !== title.select || numbers[0]===undefined) ?{}:{font: 'bold 16px sans'}} disabled={chains.map(c=>c.id).indexOf(chain?.id) != -1 && (amount === '' || numbers.length !== title.select || numbers[0]===undefined) }>
          { isConnected ? chains.map(c=>c.id).indexOf(chain?.id) != -1 ?  (numbers.length != title.select || numbers[0]===undefined) ? `Please choose ${title.select==2?"two numbers":"a number"}` : amount === '' ? "Please input amount" : "Bet" : `Switch to ${chains[0].name}` : "Connect Wallet" }
        </button>
      </div>
      <ToastUI />
      {/* <Modal
        isShown={isShown}
        hide={toggle}
        headerText={modelHeader}
        closeIcon={'x'}
        modalContent={
          <ConfirmationModal
              isShown={isShown}
              onConfirm={onConfirm}
              message={modelMsg}
              sureText={sureText}
              sureColor='red'
              sureHoverColor='#f0f'
              cancelColor='lightgrey'
              cancelHoverColor='grey'
          />
        }
      /> */}
      {showFireworks && <div className={styles.umask} style={{background: 'rgba(32, 33, 34, 0)'}}>
        <Fireworks />
      </div>}
    </div>
  )
}


export default BetAreaCell