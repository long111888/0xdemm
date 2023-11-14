/* eslint-disable @next/next/no-html-link-for-pages */
// import { Link } from 'react-router-i18n'
import { useCallback, useState, useEffect, useContext} from "react";
import { ethers } from "ethers";
import styles from "../../styles/Header.module.css";
import { store, SET_SELECTED_ADDR, SET_ACTION } from '../../store/store'
import useDispatch from '../../store/useDispatch'
import useTokenContract from "../../data/token";
import Link from "next/link";
import BaseLink from './BaseLink';
import { useRouter } from 'next/router';
import useToast from '../Toast'
import {formatAmount} from '../utils'

import { InjectedConnector } from 'wagmi/connectors/injected';
// import { signIn, signOut, useSession } from 'next-auth/react';
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';

// import { useAuthRequestChallengeEvm } from '@moralisweb3/next';
import {
  useConnectModal,
  // useAccountModal,
  useChainModal,
  // ConnectButton
} from '@rainbow-me/rainbowkit';


const Header = ({showMenu=true}) => {
  const {balance, token} = useTokenContract()
  const [curRouter, setCurRouter] = useState('')
  const [showWalletInfo, setShowWalletInfo] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter();
  const {ToastUI, showToast} = useToast()

  const { disconnectAsync } = useDisconnect();
  const { address, isConnected, isDisconnected} = useAccount();
  // const [ correctNetwork, setCorrectNetwork ] = useState(false)
  // const { data } = useSession();
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  
  const {chain, chains} = useNetwork();

  const disconnect = ()=>{
    dispatch({
        type: SET_SELECTED_ADDR,
        payload: ''
    })
    disconnectAsync()
    setShowWalletInfo(false)
  }

  useEffect(()=>{
    setCurRouter(router.pathname)
  }, [])

  const walletButton = (e) => {
    if (e.target.innerText == 'Launch App >') {
      // router.push('/app.html')
      showToast("Coming soon")
      return
    }

    if (!isConnected ) {
      openConnectModal()
    } else {
      stopPropagation(e);
      setShowWalletInfo(!showWalletInfo)
    }
  }

  const copyAddress = (e) => {
    navigator.clipboard.writeText(address);
    stopPropagation(e);
    showToast('Address copied')
  }

  const onShowPending = ()=>{
    dispatch({
        type: SET_ACTION,
        payload: 'view'
    })
  }

  const link = (e) => {
    stopPropagation(e);
    window.open(`https://testnet.bscscan.com/address/${address}`, "_blank")
  }

  const stopPropagation = (e) => {
    e.nativeEvent.stopImmediatePropagation();
  }

  const shutdown = (event)=>{
      if (showWalletInfo) {
        setShowWalletInfo(false)
      }
  }

  useEffect(() => {
    document.body.addEventListener('click', shutdown)
    return () => {
          document.body.removeEventListener('click', shutdown);
      };
  }, [showWalletInfo]);

  
  return (
    <>
      <ToastUI />
      <header className={styles.header} >
        <Link href='/'>
          <div className={styles.title}>
            <img src="demo.png" className={styles.image}/>
            <div className={styles.logo} style={{cursor: 'pointer'}}>
              <span style={{color: "#D9001B"}}>0x</span>Demo
            </div>
            <div className={styles.envLabel}>
              Alpha
            </div>
          </div>
        </Link>
      
        { showMenu && <div className={styles.menu}>
          <div className={styles.menuItem} style={curRouter=='/'?{color: '#6300bf', borderColor: '#6300bf'}:{}}>
              <BaseLink href="/" >App</BaseLink>
              {/* {curRouter=='/app' && <div className={styles.underline} style={{width: }}></div>} */}
          </div>
          {/* <div className={styles.menuItem} style={curRouter=='/ido'?{color: '#6300bf'}:{}}>
              <BaseLink href="/ido" >IDO</BaseLink>
              {curRouter=='/ido' && <div className={styles.underline}></div>}
          </div>
          <div className={styles.menuItem} style={curRouter=='/swap'?{color: '#6300bf'}:{}}>
              <BaseLink href="/swap" >Swap</BaseLink>
              {curRouter=='/swap' && <div className={styles.underline}></div>}
          </div>*/}
          
          <div className={styles.menuItem} style={curRouter=='/ranking'?{color: '#6300bf', borderColor: '#6300bf'}:{}}>
              <BaseLink href="/ranking" >Ranking</BaseLink>
          </div> 
           
           <div className={styles.menuItem} style={curRouter=='/airdrop'?{color: '#6300bf', borderColor: '#6300bf'}:{}}>
              <BaseLink href="/airdrop" >Airdrop</BaseLink>
          </div>
          {/* <div className={styles.menuItem} style={curRouter=='/nft'?{color: '#6300bf', borderColor: '#6300bf'}:{}}>
              <BaseLink href="/nft" >NFT</BaseLink>
          </div> */}
          <div className={styles.menuItem} style={curRouter=='/faucet'?{color: '#6300bf', borderColor: '#6300bf'}:{}}>
              <BaseLink href="/faucet" >Faucet</BaseLink>
          </div>
          <div className={styles.menuItem}>
              <a href="https://docs.0xDemo.io/" target="_blank" rel="noreferrer">Docs</a>
          </div>
        </div>}
        <div className={styles.wallet + ' ' + styles.walletFont } onClick={walletButton}>
          { !isConnected ? "Connect Wallet" : address.slice(0, 6) + '...' + address.slice(38) }
          { address && <img className={styles.icon } style= {showWalletInfo?{transform: 'rotate(-180deg)'}:{}} src="down.png" />}
        </div>
      </header>
      {showWalletInfo && <div className={styles.walletDetailContainer + ' ' + styles.walletFont}>
        <div className={styles.addressRow}>
          <div >
            {address.slice(0, 6) + '...' + address.slice(38)}
          </div>
          <div onClick={copyAddress}>
            <img className={styles.icon} src="copy.png" />
          </div>
          {/* <div onClick={link}>
            <img className={styles.icon} src="link.png" />
          </div> */}
        </div>
        <div className={styles.balanceRow}>
          <div >
            Balance
          </div>
          <div>
            {formatAmount(balance)} <span className={styles.demoLabel}> {token?.symbol} </span>
          </div>
        </div>
        <div className={styles.separate} />
        {/* <button className={styles.walletButton} style={{backgroundColor: '#c00017'}} onClick={()=>window.open("https://discord.gg/6b6JFrNzsT", '_bank')}>Get {token?.symbol}</button> */}
        <a className={styles.walletButton} style={{backgroundColor: '#6300bf', paddingTop: '8px'}} href="/nft">My NFT</a>
        <button className={styles.walletButton} style={{backgroundColor: '#333333'}} onClick={disconnect}>Disconnect</button>
      </div>}
    </>
  )
}

export default Header
