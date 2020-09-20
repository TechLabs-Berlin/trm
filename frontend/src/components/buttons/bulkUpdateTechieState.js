import * as React from 'react';
import { Fragment, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MuiButton from '@material-ui/core/Button';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { StateSelectInput} from '../../inputs/stateSelect'
import { FormSpy } from 'react-final-form';
import {
    Button,
    useUpdateMany,
    useRefresh,
    useNotify,
    useUnselectAll,
    SimpleForm
} from 'react-admin';

const BulkUpdateTechieStateButton = ({ selectedIds }) => {
    const [open, setOpen] = useState(false);
    const [techieState, setTechieState] = useState(null);
    const refresh = useRefresh();
    const notify = useNotify();
    const unselectAll = useUnselectAll();
    const handleClick = () => setOpen(true);
    const handleDialogClose = () => setOpen(false);
    const [updateMany] = useUpdateMany(
        'techies',
        selectedIds,
        {state: techieState},
        {
            onSuccess: () => {
                refresh();
                notify('Techies updated');
                unselectAll('techies');
            },
            onFailure: error => notify('Error: techies not updated', 'warning'),
        }
    );

    const handleConfirm = () => {
        if(!techieState) {
            notify('Select a state first', 'warning')
            return
        }
        updateMany()
        setOpen(false);
    };

    return (
        <Fragment>
            <Button label="Update State" onClick={handleClick}>
                <AutorenewIcon />
            </Button>
            <Dialog onClose={handleDialogClose} open={open}>
                <DialogTitle>Update Techie States</DialogTitle>
                <DialogContent>
                    <SimpleForm record={{state: techieState}} toolbar={null}>
                        <StateSelectInput source="state" />
                        <FormSpy onChange={props => setTechieState(props.values.state)} />
                    </SimpleForm>
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={handleDialogClose} color="primary">
                        Cancel
                    </MuiButton>
                    <MuiButton onClick={handleConfirm} color="primary">
                        Update
                    </MuiButton>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default BulkUpdateTechieStateButton;
