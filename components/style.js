import styled from "styled-components";
export const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 700;
  width: inherit;
  outline: 0;
`;

export const Backdrop = styled.div`
  position: fixed;
  width: 100%;
  height: calc( 100% + 0px );
  top: 0;
  left: 0;
  background: rgb(32, 33, 34);
  opacity: 0.8;
  z-index: 500;
`;
//background: rgb(74, 74, 75);

export const StyledModal = styled.div`
  min-width: 300px;
  z-index: 100;
  background: #000;
  position: relative;
  margin: auto;
  // border-radius: 8px;
  // border-style: solid;
  // border-color: rgb(51, 51, 51)
`;

export const Header = styled.div`
  height: 48px;

  font-weight: 650;
  font-style: normal;
  font-size: 20px;
  color: #FFFFFF;

  display: flex;
  justify-content: space-around;
  padding: 0.3rem;
`;

export const HeaderText = styled.div`
  text-align: center;
  align-self: center;
  color: lightgray;
`;

export const CloseButton = styled.button`
  font-size: 0.8rem;
  border: none;
  margin-left: 0.5rem;
  background-color:red;
  color:#fff;
  cursor: pointer;
  :hover {
    cursor: pointer;
  }
`;

export const Content = styled.div`
  padding: 10px;
  max-height: 30rem;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const SeparateTop = styled.div`
    height: 1px;

    margin-left: 10px;
    margin-right: 10px;

    border: 1px;
    border-bottom-style: solid;
    border-color: #aaa;
`;

export const Separate = styled.div`
    height: 1px;
    
    border: 1px;
    border-bottom-style: solid;
    border-color: #aaa;
`;

export const ConfirmationButtons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 8px;
    width: 100%;
    
    height: 48px;
`;

export const Message = styled.div`
  font-size: 0.9rem;
  margin: 16px 30px;
  text-align: left;
`;

export const YesButton = styled.button.attrs({
    backgroundColor:props=>props.sureHoverColor || props.sureColor
})`
  background-color:  ${props=>props.sureColor};
  border: none;
  cursor: pointer;
  width: 180px;
  height: 36px;
  margin-top: 8px;
  :hover {
    background-color: ${props=>props.sureHoverColor};
    color: #fff;
    cursor: pointer;
  }
`;

export const NoButton = styled.button.attrs({
    backgroundColor:props=>props.cancelColor || props.cancelHoverColor
})`
  background-color:  ${props=>props.cancelColor};
  border: '1px solid #333'; 
  cursor: pointer;
  width: 180px;
  height: 36px;
  margin-top: 8px;
  :hover {
    background-color:${props=>props.cancelHoverColor};
    color: #fff;
    cursor: pointer;
  }
`;
