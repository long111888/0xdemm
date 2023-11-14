import styles from "../../styles/Log.module.css";
import {useCallback, useMemo, useState, useContext, useEffect, useRef} from "react";
import { store, SET_ACTION } from '../../store/store'
import useDispatch from '../../store/useDispatch'
import StickyHeadTable from "./Table";
import { formatAmount } from "../utils"
import {getUrl} from "../../pages/api/axios";

const LiveBettingRecord = () => {
    const [betRows, setBetRows] = useState([]);

    useEffect(()=>{
        let i = setInterval(async () => {
            const logs = await getUrl("/bet_record", {})
            const r = logs.data.map((item, i)=>{
                return { 
                    id: item["bet_time"] + item["player"],
                    time: new Date(item["bet_time"]+"Z"), 
                    winner: item["player"], 
                    amount: item["bet_amount"], 
                    odds: item["odds"],
                    profit: item["profit"],
                    transactionHash: item["trans_hash"]}
            })
            setBetRows(r)
        }, 10000);
        return () => {
            clearInterval(i)
        }
    }, [])

    const columns = useMemo(
        () => [
            {
                Header: "Tx Time",
                accessor: "time",
                align: "center",
            },
            {
                Header: "Player",
                accessor: "winner",
                align: "center",
                format: (address)=>{
                    return address.slice(0, 6) + '...' + address.slice(38)
                }
                
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
                Header: "Multiplier",
                accessor: "odds",
                align: "center",
                format: (i)=>{
                    return parseInt(i)+"x"; 
                }
            },
            {
                Header: "Net Profit",
                accessor: "profit",
                align: "center",
                format: (i)=>{
                    let s = formatAmount(i)
                    return i > '0'? s + '+':s.substr(1) + "-"; 
                }
            },
        ],
        []
    )

    return (<>
        {
            !betRows?<div style={{color: "#6300bf", textAlign:"center", lineHeight: "400px"}}>No Data</div>:<StickyHeadTable  columns={columns} data={betRows}/>
        }
        </>
    )
}

export default LiveBettingRecord;