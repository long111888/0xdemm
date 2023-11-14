
import { erc20ABI as abi } from '@wagmi/core'
import { useCallback, useState, useEffect, useMemo } from "react";
import {ethers} from "ethers"
import { useContract, useAccount, useBalance, useWalletClient, useNetwork, useToken } from "wagmi";
import { readContract, writeContract, prepareWriteContract,waitForTransaction } from "@wagmi/core";
import { ADDRESSES } from '../config/constants/address' 
import { defaultChainId } from "../config/constants/chainId";
import { formatAmount } from "../components/utils";

export const useTokenContract = ()  => {
    const dead = "0x000000000000000000000000000000000000dead";
    const {chain, chains} = useNetwork()
    const chainId = useMemo(()=>{ return chain!=undefined && chain?.id &&  chains.map(c=>c.id).indexOf(chain.id) != -1 ? chain.id : defaultChainId}, [chain])
    const addressTokenContract = ADDRESSES[chainId].token
     // const addressTokenContract = useMemo(()=> {return ADDRESSES[97]?.token})

    const { data: signer, error, isLoading } = useWalletClient()
    const {address, isConnected} = useAccount();
    const [symbol, setSymbol] = useState("")

    // const [balance, setBalance] = useState("")
    const { data: deadBalance } = useBalance({
        address: dead,
        token: addressTokenContract,
        watch: true
    })
    
    const { data: b } = useBalance({
        address: address,
        token: addressTokenContract,
        watch: true,
    })

    const { data: token } = useToken({
        address: addressTokenContract,
    })
    
    const allowance = useCallback(async (owner, addr, success, fail)=>{
        console.log('allowance');
        const result = await readContract({
            address: addressTokenContract,
            abi: abi,
            functionName: 'allowance',
            args: [owner, addr],
        }).then((result) => {
            success(result)
            return true
        }).catch((e)=>{
            console.log(e); 
            fail(e)
            return false;
        })
       
    }, [addressTokenContract])

    const approve = useCallback( async (addr, amount, success, fail)=>{
        console.log('approve');
        const config = await prepareWriteContract({
            address: addressTokenContract,
            abi: abi,
            functionName: 'approve',
            args: [addr, amount],
        }).then( async (config)=>{
            const data = await writeContract(config).then(async({hash})=>{
                await success("write", hash)
                const receipt = await waitForTransaction({
                    hash,
                    onReplaced: (transaction) => console.log(transaction),
                })
                await success("wait", receipt)
            }).catch((e)=>{
                fail(e)
            })
        }).catch((e)=>{
            fail(e)
        })

    }, [addressTokenContract])

    return { balance: formatAmount(b?.formatted), deadBalance: formatAmount(deadBalance?.formatted), allowance, approve, addressTokenContract, token}
}

export default useTokenContract