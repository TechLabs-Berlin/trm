import * as React from 'react';
import { Fragment, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MuiButton from '@material-ui/core/Button';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import { FormSpy } from 'react-final-form';
import {
    Button,
    useUpdateMany,
    useRefresh,
    useNotify,
    useUnselectAll,
    SimpleForm,
    ReferenceInput,
    SelectInput
} from 'react-admin';

const BulkUpdateAssignedTeamMemberButton = ({ selectedIds }) => {
    const [open, setOpen] = useState(false);
    const [assignedTeamMemberID, setAssignedTeamMemberID] = useState(null);
    const refresh = useRefresh();
    const notify = useNotify();
    const unselectAll = useUnselectAll();
    const handleClick = () => setOpen(true);
    const handleDialogClose = () => setOpen(false);
    const [updateMany] = useUpdateMany(
        'techies',
        selectedIds,
        {assigned_team_member_id: assignedTeamMemberID},
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
        if(!assignedTeamMemberID) {
            notify('Select a team member first', 'warning')
            return
        }
        updateMany()
        setOpen(false);
    };

    return (
        <Fragment>
            <Button label="Update Assigned Team Member" onClick={handleClick}>
              <PeopleOutlineIcon />
            </Button>
            <Dialog onClose={handleDialogClose} open={open}>
                <DialogTitle>Update Techie States</DialogTitle>
                <DialogContent>
                    <SimpleForm record={{assignedTeamMemberID}} toolbar={null}>
                      <ReferenceInput label="Assigned Team Member" source="assignedTeamMemberID" reference="team_members">
                          <SelectInput optionText={(record) => `${record.first_name} ${record.last_name}`} />
                      </ReferenceInput>
                      <FormSpy onChange={props => setAssignedTeamMemberID(props.values.assignedTeamMemberID)} />
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

export default BulkUpdateAssignedTeamMemberButton;
