import React from 'react';
import { Modal, Box, Typography, Button, Paper } from '@mui/material';

interface ConfirmationModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message: string;
    title?: string;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    message,
    title = "Подтверждение"
}) => {
    return (
        <Modal
            open={isOpen}
            onClose={onCancel}
            aria-labelledby="confirmation-modal-title"
            aria-describedby="confirmation-modal-description"
        >
            <Paper sx={style}>
                <Typography id="confirmation-modal-title" variant="h6" component="h2">
                    {title}
                </Typography>
                <Typography id="confirmation-modal-description" sx={{ mt: 2 }}>
                    {message}
                </Typography>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined" onClick={onCancel}>
                        Отмена
                    </Button>
                    <Button variant="contained" onClick={onConfirm}>
                        Подтвердить
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default ConfirmationModal;