
import {Tabs, Tab, Box, Card, Typography, Button, IconButton, CardActionArea, Checkbox, Link} from '@mui/material'
import {useState, useEffect, useCallback, useRef} from 'react'
import { useAccount } from 'wagmi'
import { useTokenContract } from "../../data/token";
import Image from 'next/image'
import s from '../../styles/NFT.module.css'
import useNFTContract from '../../data/nft'
import useToast from '../Toast'
import {findDOMNode} from 'react-dom'
import Modal, {ConfirmationModal, useModal} from '../Tips'

import {
  useConnectModal,
} from '@rainbow-me/rainbowkit';

const nftConstInfo = {
        3: {name: 'Gold',   dividend: 1,  fee: '6%', color: '#ffd700'}, 
        2: {name: 'Silver', dividend: 0,    fee: '4%', color: '#d7d7d7'}, 
        1: {name: 'Bronze', dividend: 0,    fee: '2%', color: '#00c0c0'}
    }

const NFTCard = ({index, nft, selected, click}) => {
    if (nft===undefined) {
        return <></>
    }
    const level = nft[3]
    const id = nft[0]
    return <>
        {nft&&<Card variant="outlined"  sx={{ display: 'flex', flexDirection: 'row', height: '96px', width: '380px', marginTop: '18px', borderColor: nftConstInfo[level].color}}>
            <CardActionArea onClick={click(index)} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',
                padding: '8px 8px 16px 16px',
                borderColor: nftConstInfo[level].color,
                color: (selected===index?'#fff':nftConstInfo[level].color),
                backgroundColor: (selected===index?nftConstInfo[level].color:'#000')}}>
                <Image width='76' height='76' alt='nft image' src='/demo.png' />
                <Box sx={{display: 'flex', flexDirection: 'column', marginLeft: '28px'}}>
                    <Typography component='div' sx={{fontSize: '18px', fontWeight: '650'}}>
                    #{nft[0]?.toString()}
                    </Typography>
                    <Typography component='div' sx={{fontSize: '18px', fontWeight: '400'}}>
                    Rank：{ (level==3?nft[4]?'Genesis ':'Fused ' : '') + nftConstInfo[level].name}
                    </Typography>
                    <Typography component='div' sx={{fontSize: '16`px', fontWeight: '400'}}>
                    Dividend Weighting：{nftConstInfo[level].dividend}
                    </Typography>
                </Box>
            </CardActionArea>
        </Card>}
    </>
}

const NFTDetail = ({nft}) => {
    const {ToastUI, showToast} = useToast()
    
    if (nft === undefined) {
        return <><div style={{textAlign:'center', lineHeight: '600px'}}>No data</div></>
    }
    const level = nft[3]
    const id = Number(nft[0])
    const ts = nft[2]*1000n
    return <>
        <ToastUI />
        {nft && <Box variant="outlined" sx={{ display: 'flex', flexDirection: 'row', padding: '8px 8px 12px 0px', height: '96px', width: '300px'}}>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '28px'}}>
                <Image width='300' height='340' alt='nft image' src='/demo.png' />
                <Button onClick={()=>showToast("Sales will be supported only after the mainnet is launched.","error")} variant="outlined" sx={{marginTop: '60px', height: '40px', width: '200px', borderRadius: '50px', color: nftConstInfo[level].color, borderColor: nftConstInfo[level].color}}>
                    Sale
                </Button>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', marginLeft: '32px', minWidth: '280px'}}>
                <Typography component='div' variant='h6' sx={{marginBottom: '20px'}}>
                Information
                </Typography>
                <Typography component='div' variant='subtitle1' sx={{color: nftConstInfo[level].color}}>
                    #{id}
                </Typography>
                <Typography component='div' variant='body2' sx={{color: nftConstInfo[level].color}}>
                    Rank：{ (level===3? (nft[4]?'Genesis ':'Fused ') : '') + nftConstInfo[level]?.name}
                </Typography>
                <Typography component='div' variant='body2' sx={{color: nftConstInfo[level].color}}>
                    Mint：{new Date(Number(ts)).toString()}
                </Typography>
                <Typography component='div' variant='h6' sx={{margin: '40px 0 20px 0'}}>
                Functionality
                </Typography>
                <Typography component='div' variant='subtitle1' sx={{color: nftConstInfo[level].color}}>
                    Fee Waiver：{nftConstInfo[level]?.fee}
                </Typography>
                <Typography component='div' variant='body2' sx={{color: nftConstInfo[level].color}}>
                    Dividend：{nftConstInfo[level]?.dividend==0?'No':'Yes'}
                </Typography>
                <Typography component='div' variant='body2' sx={{color: nftConstInfo[level].color}}>
                    Dividend Weighting：{nftConstInfo[level]?.dividend}
                </Typography>
                <Link href="https://docs.0xDemo.io/tokenomics/nfts" target="_blank" rel="noreferrer" underline="hover" sx={{margin: '60px 0 20px 0', fontSize: '18px', fontWeight: '400', fontStyle: 'normal', cursor: 'pointer', '&:hover': {color: 'blue'}}} >
                    What are the rules for NFTs?
                </Link>
            </Box>
        </Box>}
    </>
}

const Fuse = ({index, nftIDs, value, nfts}) => {
    const refList = useRef()

    const [selected, setSelected] = useState(0);
    const [nftSelected, setNftSelected] = useState([0,0,0])
    const [buttonSelected, setButtonSelected] = useState()
    const [visibility, setVisibility] = useState(false)

    const {balance, token} = useTokenContract()
    const {isShown, toggle} = useModal()
    const {ToastUI, showToast} = useToast()

    const selectNFT = useCallback((i)=>()=>{
        setVisibility(!visibility)
        setButtonSelected(i)
    }, [visibility])

    const onKeyDown = useCallback((e)=>{
        if (visibility && !refList.current.contains(e.target)) {
            setVisibility(!visibility)
        }
    }, [visibility])

    useEffect(() => {
        visibility ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = 'unset');
        document.addEventListener('mousedown', onKeyDown, false);
        return () => {
            document.removeEventListener('mousedown', onKeyDown, false);
        };
    }, [visibility]);

    const onConfirm = async ()=>{
        toggle(false)
        await fuse(nftSelected[2], nftSelected[1], nftSelected[0], (r)=>{
            showToast('Congrations!', 'success')
            setNftSelected([0,0,0])
        }, (e)=>{
            showToast(e.reason || e.message || e.data?.message, 'error')
        })
    }

    return <>
        <ToastUI />
        <div hidden={value !== index} >
            {visibility && <div className={s.fuseNFTList} ref={refList} >
                <div className={s.nftlist}>
                    {nftIDs && nfts.map((element, i) => {
                        if (buttonSelected===0 && element[3]!=2) {
                            return
                        }
                        if (buttonSelected>0 && element[3]!=1) {
                            return
                        }

                        return <NFTCard key={i} index={i} nft={element} selected={selected} click={(i)=>()=>{
                            let selectNft = nfts[i]
                            let id = selectNft[0]
                            let level = selectNft[3]
                            if (nftSelected.indexOf(id) != -1) {
                                showToast('already selected', 'error')
                                return;
                            }
                            if ((buttonSelected===0 && level!=2) ||(buttonSelected>0 && level!=1)) {
                                showToast(`illegal level, select ${i===0?'silver':'bronze'} nft please`, 'error')
                                return;
                            }
                            nftSelected[buttonSelected] = id
                            setNftSelected((pre)=>{
                                pre[buttonSelected] = id
                                return pre
                            })
                            setVisibility(false)
                        }}/>;
                    })}
                </div>
            </div>}
            <div className={s.fuse}>
                <div className={s.buttons}>
                    <div className={s.l1}>
                        <Button onClick={selectNFT(0)} sx={{width: '180px', height: '180px', lineHeight: '180px',border: "1px solid #d7d7d7", color: '#d7d7d7', font: "800 34px sans", borderRadius: '100%', background: nftSelected[0]?nftConstInfo[2].color: ''}}>
                            {nftSelected[0]? <Image width='180' height='180' alt='nft image' src='/demo.png' />: "+"}
                        </Button>
                    </div>
                    <div className={s.l2}>
                        <IconButton onClick={selectNFT(1)} sx={{width: '180px', height: '180px', lineHeight: '180px',border: "1px solid #00c0c0", color: '#00c0c0', font: "800 34px sans", borderRadius: '100%', background: nftSelected[1]?nftConstInfo[1].color: ''}}>
                            {nftSelected[1]? <Image width='180' height='180' alt='nft image' src='/demo.png' />: "+"}
                        </IconButton>
                        <div className={s.fee}>
                            <Typography component='div' sx={{textAlign: 'center', flex: 1, marginTop: '60px', fontSize: '16px'}} >
                                Fusion fee: 
                            </Typography>
                            <Typography component='div' variant='body2' sx={{textAlign: 'center', flex: 1, marginBottom: '60px', fontSize: '20px'}} >
                                1,000 {token?.symbol}
                            </Typography>
                        </div>
                        <IconButton onClick={selectNFT(2)} sx={{width: '180px', height: '180px', lineHeight: '180px',border: "1px solid #00c0c0", color: '#00c0c0', font: "800 34px sans", borderRadius: '100%', background: nftSelected[2]?nftConstInfo[1].color: ''}}>
                            {nftSelected[2]? <Image width='180' height='180' alt='nft image' src='/demo.png' />: "+"}
                        </IconButton>
                    </div>
                    <div className={s.l3}>
                            <Typography component='div' sx={{textAlign: 'center', fontSize: '12px'}} >
                            Balance：{balance} {token?.symbol}
                        </Typography>
                        <Button variant="contained" color="error" sx={{height: '40px', width: '200px', borderRadius: '50px'}} onClick={async ()=>{
                            // if (nftSelected.indexOf(0) != -1) {
                            //     showToast('please select one silver and tow bronze nfts', 'error')
                            //     return;
                            // }
                            toggle(true)
                        }}>
                            Start Fusing
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <Modal
            isShown={isShown}
            hide={()=>toggle()}
            headerText={'Fusion Confirmation'}
            closeIcon={'x'}
            modalContent={
            <ConfirmationModal
                isShown={isShown}
                onConfirm={onConfirm}
                onCancel={()=>toggle()}
                message={<div>Fusing 3 selected NFTs will create a single Fused Gold NFT and consume 1,000 {token?.symbol}.Confirm to proceed?</div>}
                sureText={'Confirm'}
                cancelText={'Cancel'}
                sureColor='red'
                sureHoverColor='#f0f'
                cancelColor='black'
                cancelHoverColor='grey'
            />
            }
        />
    </>;
}

const MyNFT = ({index, nftIDs, value, nfts}) => {
    const [selected, setSelected] = useState(0);

    return <>
        <div hidden={value!==index}>
            <div className={s.container} >
                {nfts && nfts.length!==0?(<div className={s.nftlist}>
                    {nftIDs && nfts.map((element, i) => {
                        return <NFTCard key={i} index={i} nft={element} selected={selected} click={(i)=>()=>{setSelected(i)}}/>;
                    })}
                </div>)
                :
                (<div style={{textAlign:'center', lineHeight: '600px', minWidth: '460px', color: '#6300bf'}}>You don&apos;t have any nft!</div>)
                }
                <div className={s.separate} />
                <div className={s.nftdetail}>
                    <NFTDetail nft={nfts[selected]} />
                </div>
            </div>
        </div>
    </>;
}

const NFT = ()=>{
    const [value, setValue] = useState(0);
    const {ownList, getNFT, fuse, claim} = useNFTContract()
    const [nfts, setNfts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
        if (!ownList) {
            return;
        }
        
        let a = []
        ownList.forEach(element => {
            getNFT(element, (r)=>{a.push([element, ...r])})
        });
        setNfts(a)
    }, [ownList]) 

    useEffect(()=>{
        setTimeout(() => {
            setIsLoading(false)
        }, 6000);
    }, [])
   
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    return <div style={{width: '1024px'}}>
        {nfts && nfts.length!==0?
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', padding: '36px 0 0 0px' }}>
                <Tabs onChange={handleChange} value={value}>
                    <Tab sx={{color:'#fff'}} label="My NFT" index={0} />
                    {/* <Tab sx={{color:'#fff'}} label="Fuse" index={1} /> */}
                </Tabs>
            </Box>
            <MyNFT index={0} nftIDs={ownList} value={value} nfts={nfts}></MyNFT>
            <Fuse index={1} nftIDs={ownList} value={value} nfts={nfts}></Fuse>
        </>
        : isLoading ?
        <div style={{textAlign:'center', lineHeight: '600px', color: 'black'}}>Loading, please wait...</div> :
        <div style={{textAlign:'center', lineHeight: '600px', color: 'black'}}>No data</div>
        }
    </div>;
}

export default NFT;