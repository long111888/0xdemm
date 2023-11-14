import * as React from 'react';
import {Tabs, Tab, Box, Card, Typography, IconButton, CardActionArea, Checkbox} from '@mui/material'
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Image from 'next/image'
import StickyHeadTable from "../Bet/Table";
import {getUrl} from "../../pages/api/axios";
import { styled } from '@mui/material/styles';
import {formatAmount} from "../utils"
import { ADDRESSES } from '../../config/constants/address' 
import { defaultChainId } from "../../config/constants/chainId";
import { useNetwork, useAccount } from "wagmi";
import { useRouter } from 'next/router';


// Generate Order Data
function createData(id, ranking, address, count,  total) {
  return { id: id, ranking: ranking, address: address, count: count, total: total };
}

function preventDefault(event) {
  event.preventDefault();
}

export default function Ranking({width = '920px'}) {
  const [value, setValue] = React.useState(0);
  const [winRows, setWinRows] = React.useState([]);
  const [betRows, setBetRows] = React.useState([]);
  const [pointsRows, setPointsRows] = React.useState([]);
  const [countdown, setCountdown] = React.useState('--:--:--');
  const [over, setOver] = React.useState("--:--:--")
  const [ended, setEnded] = React.useState(false)
  const [started, setStarted] = React.useState(true)
  
  const [showPointsRules, setShowPointsRules] = React.useState(false);
  const moreRef = React.useRef()

  const {chain, chains} = useNetwork()
  const {address} = useAccount()
  const router = useRouter()
  const chainId = React.useMemo(()=>{ return chain != undefined && chain?.id &&  chains.map(c=>c.id).indexOf(chain.id) != -1 ? chain.id : defaultChainId}, [chain])
  const addressGameContract = ADDRESSES[chainId]?.game;

  const handleChange = (event, newValue) => {
      setValue(newValue);
  };
  React.useEffect(()=>{
    setWinRows([])
    getWinLogs()

    setBetRows([])
    getBetLogs()
  }, [address])

  React.useEffect(()=>{
    const i = setInterval(() => {
      let now = new Date()
      //2023/10/10 00:00 - 2023/10/31 00:00 (UTC+0)
      let start = new Date("2023-11-10 00:00:00Z")
      let end = new Date("2023-12-10 00:00:00Z")
      let rm = (24*3600) - ((now/1000) % (24*3600)) - 1  
      if (now > start && now < end) {
        let dur = `${(Math.floor(rm/3600)).toString().padStart(2,0)}:${(Math.floor((rm%3600)/60)).toString().padStart(2,0)}:${(Math.floor(rm%60)).toString().padStart(2,0)}`
        setCountdown(dur)
      }
      if (now < start) {
        setStarted(()=>false)
      }
      if (now > end) {
        setEnded(()=>true)
      }
      let te = (end - now)/1000
      if (now < start) {
        te = (start - now)/1000
      }
      if (te > 0) {
        let d = Math.floor(te/(24*3600))
        let dur = (d>0?`${d.toString().padStart(2,0)}D `:'')+`${(Math.floor(rm/3600)).toString().padStart(2,0)}:${(Math.floor((rm%3600)/60)).toString().padStart(2,0)}:${(Math.floor(rm%60)).toString().padStart(2,0)}`
        setOver(dur)
      }
    }, 1000);

    return ()=>clearInterval(i)
  }, [])

    const shutdown = (event)=>{
      console.log(`${showPointsRules}`);
     
      setShowPointsRules((pre)=>{
        if( pre ) {
          return false;
        }
      })
    }

    React.useEffect(() => {
      document.body.addEventListener('click', shutdown)
      return () => {
            document.body.removeEventListener('click', shutdown);
        };
    }, []);
  
  const getWinLogs = React.useCallback(async ()=>{
    try {
      const logs = await getUrl("/bet_ranking", {params : {type: "win", address: address}})
      let r = logs.data.map((item, i)=>{
        return createData(i+1, item["ranking"]+1, item["address"], item["win_count"], item["total_win"])
      })

      setWinRows(r)
    } catch (error) {
      console.log(error);
    }
  }, [address])

  const getBetLogs = React.useCallback(async ()=>{
    let start = new Date("2023-11-10 00:00:00Z")
    let end = new Date("2023-12-10 00:00:00Z")
    let now = new Date()
    if (now < start) {
      return
    }

    try {
      const logs = await getUrl("/bet_ranking_cur_phase", {params : {type: "bet", address: address}})
      let r = logs.data.map((item, i)=>{
        return {id: i+1, ranking: item["ranking"]+1, address: item["address"], count: item["bet_count"], total: item["total_bet"],
            total_points: item['total_point'], base_points: item['base_point'], yesterday: 0 }; //createData(i+1, item["address"], item["bet_count"], item["total_bet"])
      })
      
      const pr = await getUrl("/points_record")
      if (pr.data.length != 0) {
        pr.data.map((item)=>{
          for(let record_bet of r) {
            if (record_bet['address'] == item['player']) {
              record_bet.yesterday = item['points']
            }
          }
        })
      }

      setBetRows(r)
    } catch (error) {
      console.log(error);
    }
  }, [address])

  React.useEffect(()=>{
    getBetLogs()
    getWinLogs()
    const i = setInterval(() => {
      getWinLogs()
      getBetLogs()
    }, 30000);

    return ()=>clearInterval(i)
  }, [])

  const stopPropagation = (e) => {
    e.nativeEvent.stopImmediatePropagation();
  }
  const handleShowTip = (e) => {
    stopPropagation(e);
    setShowPointsRules((pre)=>{
      return !pre
    })
    
  }
  const betColumns = React.useMemo(
        () => [
            {
                Header: "Ranking",
                accessor: "ranking",
                align: "center"
            },
            {
                Header: "Player",
                accessor: "address",
                align: "center",
                format: (address)=>{
                    return address.slice(0, 12) + '...' + address.slice(38)
                }
            },
            {
                Header: "Bet Count",
                accessor: "count",
                align: "center",
            },
            {
                Header: "Bet Amount",
                accessor: "total",
                align: "center",
                format: (x)=>{
                  return formatAmount(x)
                }
            },
            {
                Header: "Yesterday Reward",
                accessor: "yesterday",
                align: "center",
                format: (i)=>{
                    return i===undefined?0:"+"+i
                }
            },
            {
                Header: "Base Points",
                accessor: "base_points",
                align: "center"
            },
             {
                Header: "Total Points",
                accessor: "total_points",
                align: "center"
            }
        ],
        []
    )

  const winColumns = React.useMemo(
        () => [
            {
                Header: "Ranking",
                accessor: "ranking",
                align: "center"
            },
            {
                Header: "Player",
                accessor: "address",
                align: "center",
                format: (address)=>{
                    return address.slice(0, 12) + '...' + address.slice(38)
                }
            },
            {
                Header: "Win Count",
                accessor: "count",
                align: "center",
            },
            {
                Header: "Total Net Profit",
                accessor: "total",
                align: "center",
                format: (x)=>{
                  return formatAmount(x)
                }
            }
        ],
        []
    )

    const pointsColumns = React.useMemo(
        () => [
            {
                Header: "Ranking",
                accessor: "ranking",
                align: "center",
                
            },
            {
                Header: "Address",
                accessor: "address",
                align: "center",
                format: (address)=>{
                    return address.slice(0, 12) + '...' + address.slice(38)
                }
            },
            {
                Header: "Bet Count(24H)",
                accessor: "bet_count",
                align: "center",
            },
            {
                Header: "Bet Amount(24H)",
                accessor: "bet_amount",
                align: "center",
                format: (x)=>{
                  return formatAmount(x)
                }
            },
            {
                Header: "Points(24H)",
                accessor: "points",
                align: "center",
                // format: (x)=>{
                //   return formatAmount(x)
                // }
            },
            {
                Header: "Boost(24H)",
                accessor: "boost",
                align: "center",
                // format: (x)=>{
                //   return formatAmount(x)
                // }
            },
            {
                Header: "Base Points",
                accessor: "base_points",
                align: "center",
                // format: (x)=>{
                //   return formatAmount(x)
                // }
            },
            {
                Header: "Total Points",
                accessor: "total_points",
                align: "center",
                // format: (x)=>{
                //   return formatAmount(x)
                // }
            }
            
        ],
        []
    )

  const StyledTabs = styled(Tabs)({
    // borderBottom: '1px solid #e8e8e8',
    '& .MuiTabs-indicator': {
      display: 'none',
    },
  });

  const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      textTransform: 'none',
      // fontWeight: theme.typography.fontWeightRegular,
      // fontSize: theme.typography.pxToRem(15),
      // marginRight: '48px',
      marginBottom: '32px',
      marginLeft: '16px',
      
      // border: '1px solid #6300bf',
      borderRadius: '75px',
      width: '180px',
      color: '#fff',
      font: '700 normal 16px sans',
      minHeight: '40px',
      height: '40px',
      border: '1px solid white',

      '&.Mui-selected': {
        backgroundColor: '#049659',
        borderColor: '#049659',
        color: '#fff',
      },
      '&.Mui-focusVisible': {
        color:'#fff',
      },
    }),
  );

  return (
    <React.Fragment>
      <Stack direction='row' alignItems='baseline' sx={{columnGap: '4px'}} >
        <Image  alt="" src='./fire.png' width='32' height='32' />
        <Typography component='div' sx={{marginTop: '18px', font: '700 normal 36px Arial'}}>
          Betting Summit Challenge: Phase 3
        </Typography>
      </Stack>
      <Typography component='div' sx={{marginTop: '14px', font: '400 normal 20px Arial'}}>
        2023/11/10 00:00 - 2023/12/10 00:00 (UTC+0)
      </Typography>
      <Typography component='div' sx={{marginTop: '14px', font: '700 normal 18px Arial'}} color='#aaaaaa'>
        Climb the leaderboard to boost your points!
      </Typography>
      <Typography component='div' sx={{ font: '700 normal 18px Arial'}} color='#aaaaaa'>
        Top 30 in the event get exclusive NFTs. Top rewards: Gold NFTs at $500 floor price.
        <a href="https://docs.0xDemo.io/testnet-guides/ranking-rules/summit-challenge-phase-3" target="_blank" rel="noreferrer" style={{color: '#02A7F0', cursor: "pointer"}}> More&gt;&gt;</a>
      </Typography>
      <Typography component='div' sx={{marginTop: '14px', font: '700 normal 18px Arial'}} color='#aaaaaa'>
        <Stack direction='row' alignItems='baseline' sx={{columnGap: '8px'}} >
        { !started ? (<>Starts in: <span style={{font: '700 normal 28px Arial', color: 'yellow'}}>{over}</span></>):
          ended ? (<span style={{font: '700 normal 28px Arial', color: 'yellow'}}>Event Ended</span>):
          (<>Ends in: <span style={{font: '700 normal 28px Arial', color: 'yellow'}}>{over}</span></>) 
        }
        <Image alt=""  ref={moreRef} src="./ask.png" width='18' height='18' style={{cursor: 'pointer'}} onClick={handleShowTip} />
        </Stack>
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', margin: '68px 0 0 0px' }} >
          <StyledTabs onChange={handleChange} value={value} selectionFollowsFocus={true}>
            {/* <StyledTab disableRipple label="Points Ranking" index={0} /> */}
            <StyledTab disableRipple label="Points Ranking" index={0} />
            <StyledTab disableRipple label="Winning Ranking" index={1} />
          </StyledTabs>
      </Box>
      {/* <Typography component='div' sx={{ font: '700 normal 16px Arial', width: '70%'}} color='#aaaaaa'>
        Update in: <span style={{font: '700 normal 18px Arial', color: 'yellow'}}>{countdown}</span>
      </Typography> */}
      {/* <Box hidden={value!==0} sx={{
        width: width,
      }}>
        <Typography ref={moreRef} component='div' sx={{font: '400 normal 14px Arial', textAlign: 'right', cursor:'pointer'}} color='#8080FF' onClick={()=>setShowPointsRules(!showPointsRules)}>
          Points Rules
        </Typography>
        <Box sx={{
          border: '1px solid #333333',
          borderRadius: '5px',
          borderTop: '1px solid #6300bf',
          boxShadow: '5px 5px 5px rgba(85, 85, 85, 0.34901960784313724)'
        }}>
        <StickyHeadTable columns={pointsColumns} data={pointsRows} maxHeight={null}/>
        </Box>
      </Box> */}
      <Box hidden={value!==1} sx={{
        width: width,
        border: '1px solid #333333',
        borderRadius: '5px',
        borderTop: '1px solid #6300bf',
        boxShadow: '5px 5px 5px rgba(85, 85, 85, 0.34901960784313724)',
      }}>
        <StickyHeadTable columns={winColumns} data={winRows} maxHeight={null} type='ranking'/>
      </Box>
      <Box hidden={value!==0} sx={{
        width: width,
        border: '1px solid #333333',
        borderRadius: '5px',
        borderTop: '1px solid #6300bf',
        boxShadow: '5px 5px 5px rgba(85, 85, 85, 0.34901960784313724)'
      }}>
        <StickyHeadTable columns={betColumns} data={betRows} maxHeight={null} type='ranking'/>
      </Box>

      <Box sx={{width: '70%', margin: '56px 0px 24px 0px', display:"flex", flexDirection: "column"}}>
        <Typography sx={{ font: '700 normal 20px Arial', marginBottom: '16px'}}>
          Previous Campaigns
        </Typography>
        <Link href="https://docs.0xDemo.io/testnet-guides/nft-airdrop/phase-1-top50-airdrop" target="_blank" rel="noreferrer" sx={{color: '#6300bf', font: '700 normal 18px Arial'}}>
          Betting Summit Challenge: Phase 1
        </Link>
        <Link href="https://docs.0xDemo.io/testnet-guides/nft-airdrop/betting-challenge/phase-2-top30-airdrop" target="_blank" rel="noreferrer" sx={{color: '#6300bf', font: '700 normal 18px Arial', maginTop: "8px"}}>
          Betting Summit Challenge: Phase 2
        </Link>
      </Box>
      
      {showPointsRules && <Box sx={{ position: 'absolute',
          left: moreRef.current.getBoundingClientRect().right + 2,
          top: moreRef.current.getBoundingClientRect().top,
          width: "360px",
          height: ended?"100px":"250px",
          zIndex: '999',
          backgroundColor: "#272a2e",
          borderRadius: "8px"
          }} >
          <Typography component='div' color='yellow' sx={{ padding: '16px 16px 0px 16px', font: '500 normal 16px Arial'}}>
            Tips
          </Typography>
          <Typography component='div' sx={{ font: '400 normal 14px Arial'}}>
            { !ended ? (
            <ul style={{padding: '0px 8px 0px 20px'}}>
            <li style={{margin: "8px"}}>
            The top 30 participants will receive rare NFT rewards and role promotions.
            </li>
            <li style={{margin: "8px"}}>
            Rankings are based on total accumulated points, with higher points leading to a higher rank.
            </li>
            <li style={{margin: "8px"}}>
            In the event of a tie in points, users with more bets are prioritized.
            </li>
            <li style={{margin: "8px"}}>
            If points and bet counts are the same, the user who bet earlier ranks higher.
            </li>
             <li style={{margin: "8px"}}>
             TotalPoints=(BetCount∗20)+(BetAmount/10)
            </li>
            
            </ul>) : (<div style={{padding: '0px 8px 0px 20px'}}>Thank you for your attention and participation! For users ranked in the top 30, the reward claim portal will be provided within a week. Please stay tuned.</div>)}
          </Typography>
          {/* <Typography component='div' sx={{ font: '400 normal 14px sans'}}>
            * Users ranked 1-10 will get 2.0x their POINTS earned in 24H
          </Typography>
          <Typography component='div' sx={{ font: '400 normal 14px sans'}}>
            * Users ranked 11-25 will get 1.5x their POINTS earned in 24H
          </Typography>
          <Typography component='div' sx={{ font: '400 normal 14px sans'}}>
            * Users ranked 31-50 will get 1.2x their POINTS earned in 24H
          </Typography> */}
      </Box>}
    </React.Fragment>
  );
}
