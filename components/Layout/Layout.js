import Head from 'next/head'
import { Helmet } from 'react-helmet'
import Header from '../Head/Header'
import Footer from '../Footer/Footer'
import s from "../../styles/Home.module.css";
import Link from "next/link";

export default function Layout({children, showFooter=true, showMenu=true}) {
  return (
    <>
    <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <Helmet>
        <title data-react-helmet="true">0xDemo</title>
      </Helmet>
      <Header showMenu={false}/>
        <div style={{marginTop: '70px'}}> {children} </div>
      {showFooter && <Footer />}
    </div>
    </>
  )
}
