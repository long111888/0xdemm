import styles from "../../styles/Log.module.css";
import {useCallback, useMemo, useState, useContext, useEffect, useRef} from "react";
import { store, SET_ACTION } from '../../store/store'
import useDispatch from '../../store/useDispatch'
import StickyHeadTable from "./Table";
import { formatAmount } from "../utils"
import {BetStatus} from "../constant"
import { useAccount } from "wagmi";

const BetRecord = () => {
    const {
            state: { betLogs },
    } = useContext(store)
    const dispatch = useDispatch()
    const {isConnected} = useAccount();
    const columns = useMemo(
        () => [
            {
                Header: "Tx Time",
                accessor: "time", // accessor is the "key" in the data
                align: "center",
            },
            {
                Header: "Bet Number",
                accessor: "number",
                align: "center",
            },
            {
                Header: "Bet Amount",
                accessor: "amount",
                align: "center",
                format: (i)=>{
                    return formatAmount(i); 
                }
            },
            
            {
                Header: "Multplier",
                accessor: "odds",
                align: "center",
                format: (i)=>{
                    return parseInt(i)+"X"; 
                }
            },
            {
                Header: "WN",
                accessor: "random",
                align: "center",
            },
            {
                Header: "Action",
                accessor: "action",
                align: "center",
                click: (row) => () => {
                    console.log("click button");
                    if (row.status==BetStatus.submitted){
                        dispatch({
                            type: SET_ACTION,
                            payload: { ...row,  action: 'query' }
                        })
                    } else if (row.status==BetStatus.win || row.status==BetStatus.timeout ) {
                        dispatch({
                            type: SET_ACTION,
                            payload: { ...row,  action: 'withdraw' }
                        })
                    } else if ( row.status==BetStatus.confirmed) {
                        dispatch({
                            type: SET_ACTION,
                            payload: { ...row,  action: 'view' }
                        })
                    } else if ( row.status==BetStatus.started ) {
                        
                    } else {
                        window.open("https://testnet.bscscan.com/tx/"+row.transactionHash, '_bank')
                    }
                }
            },
      
        ],
        []
    )
  
    return (
        <>
            { !isConnected?<div style={{alignItems: 'center', textAlign:"center", position: 'relative', top: '50%'}}>The betting records will be displayed here after the wallet is connected.</div>:<StickyHeadTable  columns={columns} data={betLogs} /> }
        </>
    )
}


export default BetRecord;