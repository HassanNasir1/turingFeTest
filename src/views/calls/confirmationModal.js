import React, { Fragment, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';

const ConfirmationModal = ({ open, handleClose, row, title, handleAgree, loading }) => {
  const [note, setNote] = useState('');

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        disableEscapeKeyDown
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
        fullWidth
        maxWidth="sm" // Set modal size
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {/* Display all properties */}
          <Box mt={2}>
            <Typography variant="body1"><strong>ID:</strong> {row?.id}</Typography>
            <Typography variant="body1"><strong>Direction:</strong> {row?.direction}</Typography>
            <Typography variant="body1"><strong>From:</strong> {row?.from}</Typography>
            <Typography variant="body1"><strong>To:</strong> {row?.to}</Typography>
            <Typography variant="body1"><strong>Duration:</strong> {row?.duration} seconds</Typography>
            <Typography variant="body1"><strong>Call Type:</strong> {row?.call_type}</Typography>
            <Typography variant="body1"><strong>Via:</strong> {row?.via}</Typography>
          </Box>

          {/* Add textarea for notes */}
          <TextareaAutosize
            aria-label='Add note'
            placeholder='Add a note...'
            value={note}
            onChange={handleNoteChange}
            minRows={3}
            style={{ width: '100%', marginTop: '20px' }}
          />
        </DialogContent>

        <DialogActions>
          <Box mx={2} my={1}>
            <Button onClick={handleClose} color='primary' variant="outlined">
              Close
            </Button>
          </Box>
          <Box mx={2} my={1}>
            <Button onClick={handleAgree} color='secondary' variant="contained">
              Submit
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default ConfirmationModal;
