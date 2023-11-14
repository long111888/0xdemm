import NFT from '../components/NFT'
import AirDrop from '../components/AirDrop/AirDrop'
import Layout from '../components/Layout/Layout'

export default function Home() {
  return (
    <>
    <Layout showFooter={false}>
        <AirDrop />
    </Layout>
    </>
  )
}