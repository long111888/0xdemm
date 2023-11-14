import NFT from '../components/NFT'
import Layout from '../components/Layout/Layout'

export default function Home() {
  return (
    <>
    <Layout >
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <NFT />
      </div>
    </Layout>
    </>
  )
}
