import styles from '../../styles/MainPage.module.css'
import { useState } from "react";

const MainPage = () => {
    const [questionIndex, setQuestionIndex] = useState(0)
    return <>
        <div className={styles.container + ' ' + styles.flex_column}>
            <div className={styles.header + ' ' + styles.pageBackground + ' ' + styles.flex_column}>
                <div className={styles.fontTitle}>
                    Demo Hash lottery
                </div> 
                <div className={styles.fontTitle}>
                    Built On The Ethereum Blockchain
                </div> 
                <div className={styles.fontTitle + ' ' + styles.colorGreen }>
                    Open, Fair,Transparent, and Tamper-proof transactions
                </div> 
                <div className={styles.buttons}>
                    <div className={styles.button + ' ' + styles.borderColorGreen + ' ' + styles.backgroundGreen}>
                    IDO
                    </div>
                    <div className={styles.button}>
                    Whitepaper
                    </div>
                </div>
            </div> 
            <div className={styles.flex_column + ' ' + styles.content}>
                <div className={styles.flex_column}>
                    <div className={styles.fontTitle}>
                        Why Demo?
                    </div>
                    <div className={styles.underline}>
                    </div>
                </div>
                <div className={styles.flex_column + ' ' + styles.midGap}>
                    <div className={styles.fontTitle + ' ' + styles.colorGreen}>
                        Excellent Application Scenario
                    </div>
                    <div className={styles.fontNormal}>
                    Through blockchain hashing technology, players will know if they have won a bet within two to three minutes of completion, and if they have won, they can immediately withdraw their reward. Players can choose different types of bets based on their risk appetite.All bets and winning results will be announced on the blockchain in real time.
                    </div>
                </div>
                <div className={styles.flex_column + ' ' + styles.midGap}>
                    <div className={styles.fontTitle + ' ' + styles.colorGreen}>
                        Superb deflationary mechanism
                    </div>
                    <div className={styles.fontNormal}>
                        When the player withdraws the bonus, 20% of the tax will be deducted, 14% of which will be burned off directly.<br/>
                        Example: If the player&apos;s bet is 10,000.00 and the winnings are 50,000.00, then when withdrawing the amount of 50,000.00, the 20% Tax will be deducted = (50,000.00-10,000.00)*20%=800.00
                    </div>
                    <div className={styles.fontNormal}>
                        
                    </div>
                </div>
                <div className={styles.flex_column + ' ' + styles.midGap}>
                    <div className={styles.fontTitle + ' ' + styles.colorGreen}>
                        Contracts are open source and transparent, no one can control them
                    </div>
                    <div className={styles.fontNormal}>
                    The process of betting, prize opening and reward extraction is all done on the blockchain, and this process is completely completed by smart contracts, which cannot be tampered with by anyone, ensuring absolute openness, fairness, transparency and non-tamperability.The smart contract code is open source and public, and can be reviewed at any time.
                    </div>
                </div>
            </div>
            <div className={styles.flex_column + ' ' + styles.content}>
                <div className={styles.flex_column}>
                    <div className={styles.fontTitle}>
                        Token Omicst
                    </div>
                    <div className={styles.underline}>
                    </div>
                </div>
                <div className={styles.flex_column + ' ' + styles.midGap}>
                    <div className={styles.flex_row + ' ' + styles.midGap}>
                        <img className={styles.subImage} src='favicon.ico'/>
                        <div className={styles.subTitle}>
                            Token Distribution
                        </div>
                    </div>
                    <img className={styles.contentImage} src='favicon.ico'/>
                </div>
                <div className={styles.flex_column + ' ' + styles.midGap}>
                    <div className={styles.flex_row + ' ' + styles.midGap}>
                        <img className={styles.subImage} src='favicon.ico'/>
                        <div className={styles.subTitle}>
                            Destruction Mechanism
                        </div>
                    </div>
                    <img className={styles.contentImage} src='favicon.ico'/>
                </div>
            </div>
            <div className={styles.flex_column + ' ' + styles.content}>
                <div className={styles.flex_column}>
                    <div className={styles.fontTitle}>
                        RoadMap
                    </div>
                    <div className={styles.underline}>
                    </div>
                </div>
                <img className={styles.contentImage} src='favicon.ico'/>
            </div>
            <div className={styles.flex_column + ' ' + styles.content}>
                <div className={styles.flex_column}>
                    <div className={styles.fontTitle}>
                        Demo FAQs
                    </div>
                    <div className={styles.underline}>
                    </div>
                </div>

                <div className={styles.flex_column + ' ' + styles.content}>
                    <div className={styles.flex_column + ' ' + styles.question}>
                        <div className={styles.question_title} onClick={()=>{questionIndex===1?setQuestionIndex(0):setQuestionIndex(1)}}>
                            <div className={styles.subTitle}>
                                What is demo?
                            </div>
                            <img className={styles.subImage} style={questionIndex===1?{transform: 'rotate(-180deg)'}:{}} src='favicon.ico'/>
                        </div>
                        <div className={styles.separate} />
                        {questionIndex===1 && <div className={styles.fontNormal + ' ' + styles.fullwidth} style={{}} >This is the answer</div>}
                    </div>
                    <div className={styles.flex_column + ' ' + styles.question}>
                        <div className={styles.question_title} onClick={()=>{questionIndex===2?setQuestionIndex(0):setQuestionIndex(2)}}>
                            <div className={styles.subTitle}>
                                What is demo?
                            </div>
                            <img className={styles.subImage} style={questionIndex===2?{transform: 'rotate(-180deg)'}:{}} src='favicon.ico'/>
                        </div>
                        <div className={styles.separate} />
                        {questionIndex===2 && <div className={styles.fontNormal + ' ' + styles.fullwidth} style={{}} >This is the answer</div>}
                    </div>
                    <div className={styles.flex_column + ' ' + styles.question}>
                        <div className={styles.question_title} onClick={()=>{questionIndex===3?setQuestionIndex(0):setQuestionIndex(3)}}>
                            <div className={styles.subTitle}>
                                What is demo?
                            </div>
                            <img className={styles.subImage} style={questionIndex===3?{transform: 'rotate(-180deg)'}:{}} src='favicon.ico'/>
                        </div>
                        <div className={styles.separate} />
                        {questionIndex===3 && <div className={styles.fontNormal + ' ' + styles.fullwidth} style={{}} >This is the answer</div>}
                    </div>
                    <div className={styles.flex_column + ' ' + styles.question}>
                        <div className={styles.question_title} onClick={()=>{questionIndex===4?setQuestionIndex(0):setQuestionIndex(4)}}>
                            <div className={styles.subTitle}>
                                What is demo?
                            </div>
                            <img className={styles.subImage} style={questionIndex===4?{transform: 'rotate(-180deg)'}:{}} src='favicon.ico'/>
                        </div>
                        <div className={styles.separate} />
                        {questionIndex===4 && <div className={styles.fontNormal + ' ' + styles.fullwidth} style={{}} >This is the answer</div>}
                    </div>
                    <div className={styles.flex_column + ' ' + styles.question}>
                        <div className={styles.question_title} onClick={()=>{questionIndex===5?setQuestionIndex(0):setQuestionIndex(5)}}>
                            <div className={styles.subTitle}>
                                What is demo?
                            </div>
                            <img className={styles.subImage} style={questionIndex===5?{transform: 'rotate(-180deg)'}:{}} src='favicon.ico'/>
                        </div>
                        <div className={styles.separate} />
                        {questionIndex===5 && <div className={styles.fontNormal + ' ' + styles.fullwidth} style={{}} >This is the answer</div>}
                    </div>
                    <div className={styles.flex_column + ' ' + styles.question}>
                        <div className={styles.question_title} onClick={()=>{questionIndex===6?setQuestionIndex(0):setQuestionIndex(6)}}>
                            <div className={styles.subTitle}>
                                What is demo?
                            </div>
                            <img className={styles.subImage} style={questionIndex===6?{transform: 'rotate(-180deg)'}:{}} src='favicon.ico'/>
                        </div>
                        <div className={styles.separate} />
                        {questionIndex===6 && <div className={styles.fontNormal + ' ' + styles.fullwidth} style={{}} >This is the answer</div>}
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default MainPage;