import { useCallback, useState, useEffect} from "react";
import {Fragment} from 'react'
import {createPortal}from 'react-dom';
import {
  Wrapper,
  Header,
  StyledModal,
  HeaderText,
  CloseButton,
  Content,
  Backdrop,
  ConfirmationButtons, Message, YesButton, NoButton, Separate, SeparateTop
} from './style';
import FocusLock from 'react-focus-lock';

// import styles from "../styles/Tips.module.css"

// const Tips = (msg, header, button) => {
//     return (
//         <div className={styles.container}>
//             <div className={styles.header}>
//                 {header}
//             </div>
//             <div className={styles.separate}/>
//             <div className={styles.header}>
//                 {msg}
//             </div>
//             <div className={styles.separate}/>
//             <div className={styles.header}>
//                 {button}
//             </div>
//         </div>
//     )
// }

// export default Tips;

const Modal = ({
  isShown,
  hide,
  modalContent,
  headerText,
  closeIcon
}) => {
    // const onKeyDown = (event) => {
    //     if (event.keyCode === 27
    //         && isShown) {
    //         hide();
    //     }
    // };

    // useEffect(() => {
    //     isShown ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = 'unset');
    //     document.addEventListener('keydown', onKeyDown, false);
    //     return () => {
    //         document.removeEventListener('keydown', onKeyDown, false);
    //     };
    // }, [isShown, onKeyDown]);

    const modal = (
        <Fragment>
            <Backdrop onClick={hide} />
            <FocusLock>
                <Wrapper aria-modal aria-labelledby={headerText} tabIndex={-1} role="dialog">
                    <StyledModal>
                    <Header>
                        <HeaderText>{headerText}</HeaderText>
                        {/* <CloseButton onClick={hide}>{closeIcon}</CloseButton> */}
                    </Header>
                    <SeparateTop />
                    <Content>{modalContent}</Content>
                    </StyledModal>
                </Wrapper>
            </FocusLock>
        </Fragment>
    );

  return isShown ? createPortal(modal, document.body) : null;
};

export const useModal = () => {
  const [isShown, setIsShown] = useState(false);
  const toggle = (show=false) => {
    setIsShown(show);
  }
  return {
    isShown,
    toggle,
  };
};

export const ConfirmationModal= (props) => {
   const {isShown, message,onConfirm,onCancel,sureColor,sureHoverColor,
         cancelColor,cancelHoverColor,cancelText,sureText}=props

    const onKeyDown = useCallback((event) => {
      if (event.keyCode === 27
          && isShown) {
          hide();
      }
    }, [isShown])

    useEffect(() => {
      isShown ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = 'unset');
      document.addEventListener('keydown', onKeyDown, false);
      return () => {
          document.removeEventListener('keydown', onKeyDown, false);
      };
    }, [isShown, onKeyDown]);


  return (
    <Fragment>
      <Message>{message}</Message>
      <Separate />
      <ConfirmationButtons>
        {cancelText&&<NoButton 
        onClick={onCancel}
        cancelColor={cancelColor}
        cancelHoverColor={cancelHoverColor}
        >{cancelText}</NoButton>}
        <YesButton onClick={onConfirm} 
         sureColor={sureColor}
         sureHoverColor={ sureHoverColor}
         >{sureText}</YesButton>
        
      </ConfirmationButtons>
    </Fragment>
  );
};

export default Modal