import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';

const useToast = ()=>{
    const [info, setInfo] = React.useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [progress, setProgress] = React.useState(100);

    const { open, message, severity } = info;

    const handleClose = React.useCallback((event, reason) => {
        console.log( 'close toast');
        if (reason === 'clickaway') {
            return;
        }
        setInfo({...info, open: false});
    }, []);

    React.useEffect(() => {
        if (open) {
            const timer = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress == 0) {
                        setInfo({...info, open: false});
                    }
                    return (prevProgress >= 0 ? prevProgress - 1 : 100 )
                });
            }, 33);

            return () => {
                clearInterval(timer);
            };
        }
    }, [open]);

    const showToast = React.useCallback((msg, severity='success')=>{
        console.log( 'show Toast');
        setInfo({open: true, message: msg, severity: severity})
    },[])

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={5} ref={ref} {...props} />;
    });

    function NoTransition(props) {
        return <>{props.children}</>;
    }
  
    function SlideTransition(props) {
        return <Slide {...props} direction="up" />;
    }

    const ProgressSnackbarContent = ()=>{
        const ProgressSnackbar = React.useMemo(() => (
            <Box sx={{borderRadius: '5%'}}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%', backgroundColor: 'white', borderRadius: '0' }}>
                    {message}
                </Alert>
                <LinearProgress variant="determinate" value={progress} />
            </Box>
        ), []);
        return ProgressSnackbar
    }

    const ToastUI = ()=>{
        return <>
            <Snackbar open={open}  
                onClose={handleClose} 
                TransitionComponent={NoTransition} 
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }} 
                sx={{ marginTop: '40px', marginRight: '-8px' }}
                autoHideDuration={null}> 
                <ProgressSnackbarContent />
            </Snackbar>
        </>
    }

    return {ToastUI, showToast}
}

export default useToast;