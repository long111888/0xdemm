import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Check from '@mui/icons-material/Check';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: 'white',
      borderStyle: 'dotted',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#white',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 1,
  },
}));


const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: 'white',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#080a04',
  }),
  '& .QontoStepIcon-completedIcon': {
    width: 23,
    height: 23,
    color: '#6300bf',
    zIndex: 1,
    fontSize: 24,
    // backgroundColor: '#6300bf',
    backgroundColor: 'green'
  },
  '& .QontoStepIcon-circle': {
    width: 25,
    height: 25,
    borderRadius: '5%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#6300bf',
    backgroundColor: 'white',
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;
  const [index, setIndex] = React.useState(0)
  const borders = [{borderTop: '2px solid #6300bf'}, {borderRight: '2px solid #6300bf'}, {borderBottom: '2px solid #6300bf'}, {borderLeft: '2px solid #6300bf'}]
  React.useEffect(()=>{

    const i = setInterval(() => {
      setIndex((pre)=>{
        return (pre+1)
      })
    }, 300);

    return ()=>clearInterval(i);
  },[])
  
  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (<div className="QontoStepIcon-circle" >
        <Check className="QontoStepIcon-completedIcon" />
      </div>) : (
        <div className="QontoStepIcon-circle" style={active?borders[index%4]:{}} />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const formatTime = (time)=>{
  if (time === undefined || time === null ) {
    return ''
  }
  const m = time/60
  const s = time%60
  return "" + parseInt(m)>0?parseInt(m)+" m "+parseInt(s)+" s ":parseInt(s)+" s ";

}
export default function CustomizedSteppers({steps, curStep}) {
    const [state, setState] = React.useState(curStep);
    const [nodeInfo, setNodeInfo] = React.useState(steps);
    
    React.useEffect(() => {
      setState(curStep);
    }, [curStep]);

    React.useEffect(() => {
      setNodeInfo(steps);
    }, [steps]);

  return (
      <Stepper alternativeLabel activeStep={state} connector={<QontoConnector />} sx={{width: '100%', paddingBottom: '24px'}}>
        {nodeInfo && nodeInfo.length>0 && nodeInfo.map((label, i) => (
          <Step key={label.name}>
            <StepLabel StepIconComponent={QontoStepIcon}>
              <Box>
                <Typography sx={{color: '#D7D7D7', font: '400 12px normal sans-serif'}}>{label.name}</Typography>
                {i!=0&& <Typography sx={{color: '#D7D7D7', font: '400 12px normal sans-serif'}}>{formatTime(label.cost)}</Typography>}
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
  );
}

