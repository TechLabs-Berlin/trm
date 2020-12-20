import * as React from 'react';
import { Fragment, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MuiButton from '@material-ui/core/Button';
import FlareIcon from '@material-ui/icons/Flare';
import { FormSpy } from 'react-final-form';
import {
    Button,
    useUpdateMany,
    useRefresh,
    useNotify,
    useUnselectAll,
    SimpleForm,
    ReferenceInput,
    SelectInput,
} from 'react-admin';

const BulkUpdateProjectButton = ({ selectedIds }) => {
    const [open, setOpen] = useState(false);
    const [projectId, setProjectId] = useState(null);
    const refresh = useRefresh();
    const notify = useNotify();
    const unselectAll = useUnselectAll();
    const handleClick = () => setOpen(true);
    const handleDialogClose = () => setOpen(false);
    const [updateMany] = useUpdateMany(
        'techies',
        selectedIds,
        {project_id: projectId},
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
        updateMany()
        setOpen(false);
    };

    return (
        <Fragment>
            <Button label="Update Project" onClick={handleClick}>
                <FlareIcon />
            </Button>
            <Dialog onClose={handleDialogClose} open={open}>
                <DialogTitle>Update Project</DialogTitle>
                <DialogContent>
                    <SimpleForm record={{project_id: projectId}} toolbar={null}>
                        <ReferenceInput label="Project" source="project_id" reference="projects" allowEmpty={true}>
                            <SelectInput optionText="name" />
                        </ReferenceInput>
                        <FormSpy onChange={props => setProjectId(props.values.project_id)} />
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

export default BulkUpdateProjectButton;
