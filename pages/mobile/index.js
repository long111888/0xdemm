import PoolCell from '../../components/Bet/PoolCell'
import HeaderCell from '../../components/Head/HeaderCell'
import Stack from '@mui/material/Stack';
export default function Home() {
  return (
    <>
    <Stack direction="column" width='100vw'>
        <HeaderCell />
        <PoolCell />
    </Stack>
    </>
  )
}
