import { useState, useCallback, useEffect, useContext } from "react";
import { ethers } from "ethers";

import { store, SET_SELECTED_ADDR } from '../store/store'
import useDispatch from '../store/useDispatch'

const useAddress = () => {
    const dispatch = useDispatch()
    const {
            state: { selectedAddress },
        } = useContext(store)

    const [connected, setConnected] = useState(false)

    useEffect(()=>{
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        // provider.on('network', (newNetwork, old)=>{
        //     console.log(old, newNetwork);
        // })
        // provider.on('accounts', (n, o)=>{
        //     console.log(o, n);
        // })

        return ()=>{
            // provider.removeAllListeners('networks')
            // provider.removeAllListeners('accounts')
        }
    }, [])


    const connect = useCallback( async () => {
        if (typeof window === 'undefined' ) {
            return
        }

        if ( typeof window.ethereum === 'undefined') {
            Alert('MetaMask is not installed!');
            return
        }

        console.log( `network: ${window.ethereum}`);
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.send("eth_requestAccounts", []);

        dispatch({
            type: SET_SELECTED_ADDR,
            payload: accounts[0],
        })

        console.log(`connect to matemask ${accounts[0]}`);

        setConnected(true)

    }, [selectedAddress, dispatch])


    return { selectedAddress, connect }
}

export default useAddress