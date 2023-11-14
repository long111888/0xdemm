import MainPage from '../components/MainPage/MainPage'
import Layout from '../components/Layout/Layout'
import Pool from '../components/Bet/Pool'

import isMobile from "is-mobile";

export default function Home() {
  return (
    <Layout>
        <Pool />
    </Layout>
  )
}


