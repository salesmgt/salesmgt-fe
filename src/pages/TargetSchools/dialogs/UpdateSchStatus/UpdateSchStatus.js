import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    withStyles,
    Typography,
    IconButton,
    FormLabel,
    Checkbox,
    Grid,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    InputLabel,
    InputAdornment,
} from '@material-ui/core'
import { MdClose } from 'react-icons/md'
import moment from 'moment'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Snackbars } from '../../../../components'
import { Consts, updateStatusMessage } from '../DialogConfig'
import * as TargetSchoolsServices from '../../TargetSchoolsServices'
import { DURATION_RGX } from '../../../../utils/Regex'
import classes from './UpdateSchStatus.module.scss'

const clientSchema = yup.object().shape({
    duration: yup
        .string()
        // .trim()
        .required('Duartion is required')
        .min(1, 'Duartion must be at least 1 digit')
        .max(2, 'Duartion must be at most 2 digits')
        .matches(DURATION_RGX, 'Invalid entry'),
    note: yup.string().trim(),
})

const stylesTitle = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
})

const DialogTitleWithIconClose = withStyles(stylesTitle)((props) => {
    const { children, classes, onClose, ...other } = props
    return (
        <DialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <MdClose />
                </IconButton>
            ) : null}
        </DialogTitle>
    )
})

function UpdateSchStatus(props) {
    const {
        open,
        onClose,
        resetStatus,
        target,
        currStatus,
        refreshPage,
    } = props
    const { headers, operations, fields } = Consts

    const history = useHistory()

    const [notify, setNotify] = useState({
        isOpen: false,
        message: '',
        type: '',
    })

    const defaultValues = {
        // id: memoDets?.id,
        // duration: '',
        // revenueCriteria: '',
        // service: '',
        // note: '',
        showCreate: false,
    }

    const { control, errors, handleSubmit, formState, reset, watch } = useForm({
        resolver: yupResolver(clientSchema),
        defaultValues: defaultValues,
    })

    const confirmWatch = watch('showCreate')

    const allowUpdate = () => {
        TargetSchoolsServices.updateStatus(target?.schoolId, currStatus)
            .then((res) => {
                refreshPage(target?.id)
                setNotify({
                    isOpen: true,
                    message: 'Updated Successfully',
                    type: 'success',
                })
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error)
                    history.push({
                        pathname: '/errors',
                        state: { error: error.response.status },
                    })
                }
                setNotify({
                    isOpen: true,
                    message: 'Update Unsuccessful',
                    type: 'error',
                })
            })
    }

    const onSubmit = (data) => {
        const model = {
            ...data,
            targetSchoolId: target?.id,
            date: moment(Date.now()).format('YYYY-MM-DD'),
        }
        delete model.showCreate

        TargetSchoolsServices.createMOU(model)
            .then((res) => {
                setNotify({
                    isOpen: true,
                    message: 'Created Successfully',
                    type: 'success',
                })
                reset({
                    showCreate: false,
                })

                allowUpdate()
                onClose()
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error)
                    history.push({
                        pathname: '/errors',
                        state: { error: error.response.status },
                    })
                }
                setNotify({
                    isOpen: true,
                    message: 'Create Unsuccessful',
                    type: 'error',
                })
            })

        // alert(JSON.stringify(model))
    }

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="xs">
                <DialogTitleWithIconClose onClose={onClose}>
                    {headers.updateStatus}
                </DialogTitleWithIconClose>

                <DialogContent className={classes.dialogCont}>
                    <DialogContentText className={classes.dialogText}>
                        {/* If you want to update this status, please process to create
                    a Memorandum of Contract. */}
                        {updateStatusMessage()}

                        <form noValidate>
                            <div className={classes.showCreate}>
                                <FormLabel>{operations.showCreate}</FormLabel>
                                <Controller
                                    name="showCreate"
                                    control={control}
                                    render={({ value, onChange }) => (
                                        <Checkbox
                                            onChange={(e) =>
                                                onChange(e.target.checked)
                                            }
                                            checked={value}
                                        />
                                    )}
                                />
                            </div>

                            {confirmWatch && (
                                <Grid
                                    container
                                    spacing={2}
                                    className={classes.wrapper}
                                >
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        {/* <Controller
                                            name="id"
                                            control={control}
                                            render={({ value }) => (
                                                <input
                                                    type="hidden"
                                                    name="id"
                                                    value={value}
                                                />
                                            )}
                                        /> */}
                                        <Controller
                                            name="duration"
                                            control={control}
                                            defaultValue=''
                                            render={({ value, onChange }) => (
                                                <TextField
                                                    label={
                                                        fields.duration.title
                                                    }
                                                    variant="outlined"
                                                    type="number"
                                                    required
                                                    fullWidth
                                                    autoFocus
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="start">
                                                                {
                                                                    fields
                                                                        .duration
                                                                        .adornment
                                                                }
                                                            </InputAdornment>
                                                        ),
                                                        inputProps: {
                                                            min: 1,
                                                            max: 99,
                                                        },
                                                    }}
                                                    value={value}
                                                    onChange={onChange}
                                                    error={!!errors.duration}
                                                    helperText={
                                                        errors?.duration
                                                            ?.message
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <InputLabel>
                                            {fields.service.title}
                                        </InputLabel>
                                        <Controller
                                            name="service"
                                            control={control}
                                            defaultValue={
                                                fields.service.svc1.value
                                            }
                                            render={({ value, onChange }) => (
                                                <RadioGroup
                                                    value={value}
                                                    onChange={onChange}
                                                    row
                                                >
                                                    <FormControlLabel
                                                        label={
                                                            fields.service.svc1
                                                                .lb
                                                        }
                                                        value={
                                                            fields.service.svc1
                                                                .value
                                                        }
                                                        control={<Radio />}
                                                    />
                                                    <FormControlLabel
                                                        label={
                                                            fields.service.svc2
                                                                .lb
                                                        }
                                                        value={
                                                            fields.service.svc2
                                                                .value
                                                        }
                                                        control={<Radio />}
                                                    />
                                                    <FormControlLabel
                                                        label={
                                                            fields.service.svc3
                                                                .lb
                                                        }
                                                        value={
                                                            fields.service.svc3
                                                                .value
                                                        }
                                                        control={<Radio />}
                                                    />
                                                    <FormControlLabel
                                                        label={
                                                            fields.service.svc4
                                                                .lb
                                                        }
                                                        value={
                                                            fields.service.svc4
                                                                .value
                                                        }
                                                        control={<Radio />}
                                                    />
                                                </RadioGroup>
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <InputLabel>
                                            {fields.revenue.title}
                                        </InputLabel>
                                        <Controller
                                            name="revenueCriteria"
                                            control={control}
                                            defaultValue={
                                                fields.revenue.rev1.value
                                            }
                                            render={({ value, onChange }) => (
                                                <RadioGroup
                                                    value={value}
                                                    onChange={onChange}
                                                    row
                                                >
                                                    <FormControlLabel
                                                        label={
                                                            fields.revenue.rev1
                                                                .lb
                                                        }
                                                        value={
                                                            fields.revenue.rev1
                                                                .value
                                                        }
                                                        control={<Radio />}
                                                    />
                                                    <FormControlLabel
                                                        label={
                                                            fields.revenue.rev2
                                                                .lb
                                                        }
                                                        value={
                                                            fields.revenue.rev2
                                                                .value
                                                        }
                                                        control={<Radio />}
                                                    />
                                                </RadioGroup>
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <Controller
                                            name="note"
                                            control={control}
                                            defaultValue=""
                                            render={({ value, onChange }) => (
                                                <TextField
                                                    label={fields.note.title}
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                    rows={5}
                                                    value={value}
                                                    onChange={onChange}
                                                    error={!!errors.note}
                                                    helperText={
                                                        errors?.note?.message
                                                    }
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                        </form>
                    </DialogContentText>
                </DialogContent>

                <DialogActions className={classes.dialogAct}>
                    <Button
                        className={classes.btnSave}
                        // type="submit"
                        disabled={!formState.isDirty}
                        onClick={handleSubmit(onSubmit)}
                    >
                        {operations.save}
                    </Button>
                    <Button
                        onClick={() => {
                            reset({
                                errors: false,
                                showCreate: false,
                            })
                            onClose()
                            resetStatus()
                        }}
                    >
                        {operations.cancel}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbars notify={notify} setNotify={setNotify} />
        </>
    )
}

export default UpdateSchStatus
