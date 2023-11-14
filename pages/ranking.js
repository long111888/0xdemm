import Ranking from '../components/MainPage/Ranking'
import Layout from '../components/Layout/Layout'
import Stack from '@mui/material/Stack';

export default function Home() {
  return (
    <Layout showMenu={true} >
          <Stack direction="column" justifyContent="center" alignItems="center" sx={{marginTop: '32px', marginBottom: '32px'}} >
              <Ranking width='70%'/>
          </Stack>
    </Layout>
  )
}
