import * as React from 'react'
import { Fragment, useState } from 'react'
import {
    Button,
    Confirm,
    useUpdateMany,
    useRefresh,
    useNotify,
    useUnselectAll,
    useTranslate,
} from 'react-admin'
import UpdateIcon from '@material-ui/icons/Update'

const UpdateRecordsButton = ({ resource, selectedIds }) => {
    const [open, setOpen] = useState(false)
    const refresh = useRefresh()
    const notify = useNotify()
    const unselectAll = useUnselectAll()
    const translate = useTranslate()
    const [updateMany, { loading }] = useUpdateMany(
        resource,
        selectedIds,
        { updated_at: (new Date()).toISOString() },
        {
            onSuccess: () => {
                refresh();
                notify(translate(`resources.${resource}.name`, 2) + ' updated');
                unselectAll(resource);
            },
            onFailure: error => notify(`Error: ${translate('resources.'+resource+'name', 2)} not updated`, 'warning'),
        }
    );
    const handleClick = () => setOpen(true);
    const handleDialogClose = () => setOpen(false);

    const handleConfirm = () => {
        updateMany();
        setOpen(false);
    };

    return (
        <Fragment>
            <Button startIcon={<UpdateIcon />} label="Update" onClick={handleClick} />
            <Confirm
                isOpen={open}
                loading={loading}
                title={'Update '+translate(`resources.${resource}.name`, 2)}
                content={'Are you sure you want to update all ' + translate(`resources.${resource}.name`, 2) + '?'}
                onConfirm={handleConfirm}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
}

export default UpdateRecordsButton;
