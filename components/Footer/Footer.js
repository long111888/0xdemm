import styles from "../../styles/Footer.module.css";


const Footer = () => {
    return (<>
        <div className={styles.container}>
            <div className={styles.bottom}>
                <div className={styles.copyright}>
                © 2023 0xDemo. All rights reserved
                </div>
                <div className={styles.medias}>
                    <a target="_blank" rel="noreferrer noopener" href="https://twitter.com/0xDemo_io" aria-label="Twitter" color="primary" fontSize="16px">
                        <img className={styles.mediaIcon} src='twitter.png'/>
                    </a>
                    <a target="_blank" rel="noreferrer noopener" href="https://discord.gg/6b6JFrNzsT" aria-label="Twitter" color="primary" fontSize="16px">
                        <img className={styles.mediaIcon} src='Discord.png'/>
                    </a>
                    <a target="_blank" rel="noreferrer noopener" href="https://medium.com/@0xDemo.io" aria-label="Twitter" color="primary" fontSize="16px">
                        <img className={styles.mediaIcon} src='Medium.png'/>
                    </a>
                    {/* <img className={styles.mediaIcon} src='Telegram.png'/> */}
                </div>
            </div>
        </div>
    </>)
}

export default Footer;