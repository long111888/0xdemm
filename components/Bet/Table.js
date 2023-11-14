import styles from "../../styles/Log.module.css";
import {useCallback, useMemo, useState, useContext, useEffect, useRef} from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Modal, { ConfirmationModal, useModal } from '../Tips';
import { store, SET_ACTION } from '../../store/store'
import useDispatch from '../../store/useDispatch'
import { BetStatus } from '..//constant'
import Image from 'next/image'
import useToast from '../Toast'
import { useAccount } from "wagmi";

function StickyHeadTable({columns, data, maxHeight="478px", type=null}) { 
    const {address} = useAccount()
    const [rows, setRows] = useState(data);
    const {isShown, toggle} = useModal();
    const {ToastUI, showToast} = useToast()
    const [modelMsg, setModelMsg] = useState('');
    const [modelHeader, setModelHeader] = useState('');
    const [loadingMsg, setLoadingMsg] = useState("Loading, please wait...")
    useEffect(()=>{setTimeout(() => {
        setLoadingMsg("No record")
    }, 15000)}, [])

    useEffect(()=>{
        setRows(data)
    }, [data])

    const onConfirm = () => {
        toggle()
    };
    
    const onCancel = () => toggle();

    // const getWinNumberPos = (h, odds) => {
    //     let hash = h.slice(2)
    //     let i = null;
    //     switch (odds) {
    //         case 5:
    //             i = hash.search(/[0-4]/)
    //             return [i+2]
    //         case 10:
    //             i = hash.search(/[0-9]/)
    //             return [i+2]
    //         case 100:
    //             i = hash.search(/[0-9]/)
    //             let j = hash.slice(i+1).search(/[0-9]/)+i+1
    //             console.log(i, j);
    //             return [i+2, j+2]
    //         default:
    //             return -1
    //     }
    // }
    // const getWinNumber = (h, odds)=>{
    //     let hash = h.slice(2)
    //     let i = null;
    //     switch (odds) {
    //         case 5:
    //             i = hash.search(/[0-4]/)
    //             return h[i+2]
    //         case 10:
    //             i = hash.search(/[0-9]/)
    //             return h[i+2]
    //         case 100:
    //             i = hash.search(/[0-9]/)
    //             let j = hash.slice(i+1).search(/[0-9]/)+i+1
    //             return h[i+2] + h[j+2]
    //         default:
    //             return ''
    //     }
    // }
    const getTitle = (odds)=>{
    let title = { 5: '1-Star (5x)', 10: '1-Star (10x)', 100: '2-Star (100x)', '5': '1-Star (5x)', '10': '1-Star (10x)', '100': '2-Star (100x)' }
    return title[odds]
  }
    const clickView = (accessor,row) => {
        console.log(row);
        // console.log( `clickView ${row.win}` );
        // if ( row.win[0] == 2 || row.win[0] == 0 ) {
        //     const h = row.blockHash;
        //     const i = getWinNumberPos(h, row.odds);
        //     setModelMsg(hashContent(h, i, row.number))
        //     setModelHeader(getTitle(row.odds))
        //     toggle()
        // }
    }
    const clickHeight = (item) => {
        console.log(item);
        window.open("https://testnet.bscscan.com/block/"+item.height, '_bank')
    }
    const clickTime = (item) => {
        if (!item.transactionHash) {
            return
        }
        console.log(item);
        window.open("https://testnet.bscscan.com/tx/"+item.transactionHash, '_bank')
    }


    const clickBetTime = async (item) => {
        console.log(item);
        const transactionHash = item.transactionHash
        if ( transactionHash ) {
            console.log(transactionHash);
            window.open("https://testnet.bscscan.com/tx/"+ transactionHash, '_bank')
        }
    }
    const clickAddress = (item) => {
         window.open("https://testnet.bscscan.com/address/"+item.winner, '_bank')
    }
    const formatNumber = (n, i) => {
        if (i != 1) {
            if(n < 10) {
                return '0' + parseInt( n )
            }
        }
        return parseInt( n );
    }
    const padStart = (x) => {
        return new Intl.NumberFormat(undefined, {
            minimumIntegerDigits: 2,
            useGrouping: false
        }).format(x)
    } 
    const formatTime = (timestamp, needYear=false, onlyTime=false) => {
        let d = new Date(timestamp)
        if (onlyTime) {
            return `${padStart(d.getHours())}:${padStart(d.getMinutes())}:${padStart(d.getSeconds())}`
        }
        return `${needYear?padStart(d.getFullYear())+"-":""}${padStart(d.getMonth()+1)}-${padStart(d.getDate())} ${padStart(d.getHours())}:${padStart(d.getMinutes())}:${padStart(d.getSeconds())}`
    }

    // const hashContent= (h, i, bet)=>{
    //     return (<div className={styles.message}>
    //         <div>Block Hash</div>
    //         <div>
    //         {i.length == 1?<div style={{wordWrap:'break-word', wordBreak: 'break-all', fontSize: "20px"}}>{h.slice(0, i[0])}<span style={{color: '#75fdfd',fontSize: "32px"}}>{h[i[0]]}</span>{h.slice(i[0]+1)}</div>
    //             : <div style={{wordWrap:'break-word', wordBreak: 'break-all', fontSize: "20px"}}>{h.slice(0, i[0])}<span style={{color: '#75fdfd',fontSize: "32px"}}>{h[i[0]]}</span>{h.slice(i[0]+1, i[1]-1)}<span style={{color: '#75fdfd',fontSize: "32px"}}>{h[i[1]]}</span>{h.slice(i[1]+1)}</div>}
    //         <img src='favicon.ico' style={{height: '30px', width: '30px'}} />
    //         </div>
    //         <div style={{color: '#F59A23',fontSize: "16px"}}>Tips：The marked cyan number is the winning numbers.</div>
            
    //         {bet!=null&& <div style={{fontSize: "16px"}}>Your choice: <span style={{color: '#f00',fontSize: "32px"}}>{formatNumber(bet, i.length)}</span></div>}
    //     </div>)
    // }

    const clickNumer = (row) => {
        console.log(row);
        // if (row.blockHash) {
        //     const h = row.blockHash;
        //     const i = getWinNumberPos(h, row.odds);
        //     setModelMsg(hashContent(h, i))
        //     setModelHeader(getTitle(row.odds))
        //     toggle()
        // }
    }

    const numberColor = (col, row)=>{
        if (row.odds === 5) {
            return "#2b3dd3"
        } else if (row.odds === 10) {
            return "#e46c06"
        } else if (row.odds === 100) {
            return "#8c06e4"
        }
        return "#fff"
    }

    const copyAddress = (v) => {
        navigator.clipboard.writeText(v);
        showToast('Address copied')
    }
    
    const buttonStyle = (status) => {
        
        if (status == -1) {
            return {backgroundColor: "#f59a23", border: "none", fontSize: '16px',cursor: 'pointer'} 
        } else if ( status == 1 || status == 3) {
            return {backgroundColor: "#4ea45c", border: "none", fontSize: '16px',cursor: 'pointer'} 
        }

        return {backgroundColor: "#fff", border: "none", color: '#2471fe', fontSize: '16px', cursor: 'pointer'} 
    }
    
    return (
        <>
        <Paper sx={{ backgroundColor: '#fff', overflow: 'hidden', color: "black" }}>
            <TableContainer sx={maxHeight!=null && { maxHeight: maxHeight }}>
                <Table stickyHeader size="small">
                    <TableHead sx={{ height: '48px'}}>
                        <TableRow >
                            {columns.map((column) => (
                                <TableCell sx={{color: "black", 
                                     borderBottomStyle: 'solid',
                                     borderColor: '#333333',
                                     backgroundColor: '#fff'}} 
                                    key={column.accessor}
                                    align={column.align} >
                                    {column.Header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    
                    <TableBody>
                        {(rows||[]).map((row, i) => {
                                return (
                                    <TableRow key={row.id}>
                                        {columns.map((column) => {
                                            const value = row[column.accessor];
                                            return (
                                                column.accessor==='number'?
                                                    <TableCell sx={{display: 'flex', cursor: "default", justifyContent: 'center'}} key={column.accessor} align={column.align}>
                                                        <div className={styles.number} style={{backgroundColor: numberColor(column, row)}}>{formatNumber(value, row.odds==100?2:1)}</div>
                                                    </TableCell>
                                                    :
                                                column.accessor==='winner' || column.accessor === 'address'?
                                                    <TableCell sx={{color: (type=='ranking' && i == 0 && row.address==address?.toLowerCase())?"yellow":"#000",}} key={column.accessor} align={column.align} >
                                                        <div style={{display: "flex", direction: "row", justifyContent: "center", columnGap: "4px"}}>
                                                        {column.format(value)}
                                                        <div onClick={()=>copyAddress(value)}>
                                                        <Image src="/copy.png" width="16" height="16" alt="" style={{marginTop: '2px'}}/>
                                                        </div>
                                                        </div>
                                                    </TableCell>
                                                    :
                                                column.accessor==='amount' ?
                                                    <TableCell sx={{color: column.accessor==='profit'?"#6300bf":"black" }} key={column.accessor} >
                                                        <div style={{textAlign: 'right', width: "10%", direction: 'rtl', position: 'relative', left: '50%'}} >
                                                            {column.format(value)}
                                                        </div>
                                                    </TableCell>
                                                    :
                                                column.accessor==='profit' ?
                                                    <TableCell sx={{color: value>0?"#6300bf":"black" }} key={column.accessor} >
                                                        <div style={{textAlign: 'right', width: "10%", direction: 'rtl', position: 'relative', left: '50%'}} >
                                                            {column.format(value)}
                                                        </div>
                                                    </TableCell>
                                                    :
                                                column.accessor==='total'?
                                                    <TableCell sx={{color: (type=='ranking' && i == 0 && row.address==address?.toLowerCase())?"yellow":"#fff"}} key={column.accessor} >
                                                        <div style={{textAlign: 'right', width: "10%", direction: 'rtl', position: 'relative', left: '55%'}} >
                                                            {column.format(value, row.amount)}
                                                        </div>
                                                    </TableCell>
                                                    :
                                                column.accessor==='id'?
                                                     <TableCell sx={{color: "#02A7F0",  cursor: 'pointer' }} key={column.accessor} align={column.align} onClick={e=>clickTime(row)} >
                                                        {formatTime(value)}
                                                    </TableCell>
                                                    :
                                                column.accessor==='time'?
                                                     <TableCell sx={{color: "#02A7F0",}} key={column.accessor} align={column.align} >
                                                        <a style={{cursor: 'pointer'}} onClick={e=>clickBetTime(row)}> {typeof value == "string"? value : formatTime(value)} </a>
                                                    </TableCell>
                                                    :
                                                column.accessor==='random'?
                                                    <TableCell sx={{ display: 'flex', justifyContent: column.align}} key={column.accessor} align={column.align} >
                                                        {row.status === BetStatus.submitted || row.status === BetStatus.started ?  row.random : 
                                                            (row.status == BetStatus.win || row.status == BetStatus.withdrawed)?
                                                                <div className={styles.number} style={{backgroundColor: '#129f66',cursor: 'default'}}>{formatNumber(row.random, row.odds==100?2:1)}</div>:
                                                                (row.status == BetStatus.timeout)?
                                                                    row.random:
                                                                    (row.status == BetStatus.failed)?
                                                                        <div className={styles.number} style={{backgroundColor: '#f00',cursor: 'default'}}>{formatNumber(row.random, row.odds==100?2:1)}</div>:
                                                                        row.random}
                                                    </TableCell>
                                                    :
                                                column.accessor==='action'?
                                                    <TableCell sx={{color: "#fff" }} key={column.accessor} align={column.align} >
                                                        {row.win!=BetStatus.started && <button onClick={column.click(row)} style={buttonStyle(row.status)}>{row.status==BetStatus.submitted?"query":row.status==BetStatus.win||row.status==BetStatus.timeout?"withdraw":"view"}</button>}
                                                    </TableCell>
                                                    :
                                                column.accessor==='yesterday'?
                                                    <TableCell sx={{color: (type=='ranking' && i == 0 && row.address==address?.toLowerCase())?"yellow":"#6300bf"}} key={column.accessor} align={column.align} >
                                                        {column.format
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>
                                                    :
                                                    <TableCell sx={{color:(type=='ranking' && i == 0 && row.address==address?.toLowerCase())?"yellow":"#000"}} key={column.accessor} align={column.align} >
                                                        {column.format
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>

                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
                {rows?.length == 0 && <div style={{zIndex: 88, lineHeight: 'calc(478px - 48px)', alignItems: 'center', textAlign:"center", position: 'relative', top: '50%', color: "#6300bf"}}>
                    {loadingMsg}
                </div>}
            </TableContainer>
        </Paper>
        <ToastUI />
        <Modal
                isShown={isShown}
                hide={toggle}
                headerText={modelHeader}
                closeIcon={
                'x'
                }
                modalContent={
                <ConfirmationModal
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    message={modelMsg}
                    sureText='Got it'
                    sureColor='red'
                    sureHoverColor='#f0f'
                    cancelColor='lightgrey'
                    cancelHoverColor='grey'
                />
                }
            />
        </>
    );
}

export default StickyHeadTable;