import { useState, useCallback, useEffect, useMemo} from "react";
import {FaucetABI as abi} from '../../data/abi/Faucet'
import s from "../../styles/Faucet.module.css";
import {  useAccount, useBalance, useNetwork } from "wagmi";
import ReactLoading from 'react-loading';
import { readContract, writeContract, prepareWriteContract, waitForTransaction} from "@wagmi/core";
import useToast from '../Toast'
import { ADDRESSES } from '../../config/constants/address' 
import { defaultChainId } from "../../config/constants/chainId";
import {
  useConnectModal,
  useChainModal
} from '@rainbow-me/rainbowkit';
import CircularProgress from '@mui/material/CircularProgress';
import useTokenContract from "../../data/token"

const Faucet = () => {
    const {chain, chains} = useNetwork()
    const {token} = useTokenContract()
    const chainId = useMemo(()=>{ return chain?.id ? chain.id : defaultChainId}, [chain])
    const faucetContractAddress = ADDRESSES[chainId]?.faucet;
   
    // const faucetContractAddress = useMemo(()=> {return ADDRESSES[97]?.faucet})
    
    const [timeRequest, setTimeRequest] = useState('')
    const [timeRemain, setTimeRemain] = useState('')
    const [canRequest, setCanRequest] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    
    const {address, isConnected} = useAccount()
    const {balance} = useBalance();
    const {ToastUI, showToast} = useToast()
    const { openConnectModal } = useConnectModal();
    const { openChainModal } = useChainModal();

    const MINDURATION = 4*60*60*1000;
    useEffect(()=>{
        if (isConnected) {
            let r = localStorage.getItem('LAST_REQUEST_' + address)
            if (r) {
                console.log(`setTimeRequest ${r}`);
                setTimeRequest(r)
            } else {
                setTimeRequest(0)
            }

            let t = Date.now()
            if ((t - r) > MINDURATION) {
                setCanRequest(true)
            } else {
                setCanRequest(false)
                setTimeRemain(formatTime())
            }
            
            let i = setInterval(() => {
                setTimeRemain(formatTime())
                let t = Date.now()
                console.log((timeRequest));
                if ((t - timeRequest) > MINDURATION) {
                    setCanRequest(true)
                } 
            }, 10000);
            return ()=>clearInterval(i)
        }

    }, [timeRequest, timeRemain, canRequest])

    const getWater = useCallback( async()=>{
        if (!canRequest) {
            return
        }
       
        console.log('faucet');
        const config = await prepareWriteContract({
            address: faucetContractAddress,
            abi: abi,
            functionName: 'faucet',
        }).catch( (e)=>{
            console.log(e);
            showToast(e?.reason || e?.message, 'error');
        })
        if (config === undefined) {
            console.log('config error');
            return;
        }

        setIsLoading(true)
        const data = await writeContract(config).then(async(data)=>{
            const d = await waitForTransaction({
                hash: data?.hash,
            }).then((data)=>{
                showToast('success!');
                let t = Date.now()
                localStorage.setItem('LAST_REQUEST', t);
                setTimeRequest(t)
                setCanRequest(false)
                setIsLoading(false)
            }).catch( (e)=>{
                showToast(e.message, 'error');
                setIsLoading(false)
            })
        }).catch((e)=>{
            console.log(e);
            showToast(e?.reason || e.message, 'error');
            setIsLoading(false)
        })
    })

    const addChain = ()=>{
        window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: '0x61',
                chainName: 'BSC Testnet',
                nativeCurrency: {
                    name: 'tBNB',
                    symbol: 'tBNB',
                    decimals: 18
                },
                // rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                rpcUrls: ['https://bsc-testnet.publicnode.com'],
                blockExplorerUrls: ['https://testnet.bscscan.com']
            }]
        }).then(()=>{
            showToast('success!')
        })
        .catch((error) => {
            console.log(error)
        }) 
    }

    const addAsset = ()=>{
        if ( !isConnected ) {
            openConnectModal();
            return;
        }
        
        if ( chain != undefined && chain?.id &&  chains.map(c=>c.id).indexOf(chain.id) == -1 ) {
            openChainModal();
            return
        }

        console.log(ADDRESSES[chainId]?.token, token?.symbol, token?.decimals );
        window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: ADDRESSES[chainId]?.token, // The address that the token is at.
                    symbol: token?.symbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: token?.decimals // The number of decimals in the token
                },
            }
        }).then(()=>{
            showToast('success!')
        })
        .catch((error) => {
            console.log(error)
        }) 
    }

    const formatTime = ()=>{
        let t = Date.now()
        let usedTime = MINDURATION - (t - timeRequest)
        var days = Math.floor(usedTime / (24 * 3600 * 1000));
        var leave1 = usedTime % (24 * 3600 * 1000);  
        var hours = Math.floor(leave1 / (3600 * 1000));
        var leave2 = leave1 % (3600 * 1000);        
        var minutes = Math.floor(leave2 / (60 * 1000));
        var time =  hours + " hours " + minutes + " minutes";
        return time;
    }

    return <>
        <div className={s.container}  >
            <ToastUI /> 
            {isLoading&&<div className={s.umask}>
                <ReactLoading type='spinningBubbles' color='#6300bf' height={'4%'} width={'4%'} />
            </div>}
            <div className={s.title} >
               { canRequest? `Request Testnet ${token?.symbol}` : <>Successfully requested <span style={{color: 'blue'}}>1000</span> CNDT</> }
            </div>
            <img src={canRequest?'Token.png':'Done.png'} className={s.image} />
            {/* {isConnected ? deleted
                <div className= {s.button_gray}>
                    <img src='MetaMask.png' className={s.icon} style={{flex: 2, marginLeft: "8px"}}/>
                    <div style={{flex: 16}} />
                    <div onClick={openConnectModal} style={{flex: 9}}>
                        {address.slice(0, 6) + '...' + address.slice(38)}
                    </div>
                </div> :
                <div onClick={()=>window.open("https://discord.com/invite/bnbchain", '_bank')}  className={s.button_red}>
                    Get {token?.symbol} from Discord
                </div>
            } */}
            <div onClick={()=>window.open("https://discord.gg/6b6JFrNzsT", '_bank')}  className={s.button_red}>
                    Get {token?.symbol} from Discord
                </div>
            <div className={s.button_gray} style={{marginTop: '10px'}} onClick={()=>window.open("https://discord.com/invite/bnbchain", '_bank')}>
                    Get Testnet BNB from Discord
            </div>
            {/* <div className={s.tip}>
                    {canRequest?`Request testnet $${token?.symbol} once 4 hours to use for 0xDemo Bet.`: <>Request again after <span style={{color: 'red'}}>{timeRemain}</span></>}
            </div> */}
            <div className={s.separate}>
            </div>
            <div className={s.button_circle + ' ' + s.pointer_cursor} onClick={addAsset}>
                <img src='MetaMask.png' className={s.icon}/>
                <div >
                    Add {token?.symbol} to Metamask
                </div>
            </div>
            {/* <div className={s.font_blue + ' ' + s.pointer_cursor} onClick={()=>window.open("https://discord.com/invite/bnbchain", '_bank')}>
            Get Testnet BNB from Faucet &gt;&gt;
            </div> */}
        </div>
    </>
}

export default Faucet;