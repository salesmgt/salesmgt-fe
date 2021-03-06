import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import {
    Grid,
    Typography,
    Avatar,
    Button,
    TextField,
    makeStyles,
    Select,
    MenuItem,
    Chip,
} from '@material-ui/core'
import { MdWarning } from 'react-icons/md'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useApp } from '../../../../hooks/AppContext'
import * as Milk from '../../../../utils/Milk'
import { milkNames } from '../../../../constants/Generals'
import { Snackbars, Loading, NotFound } from '../../../../components'
import { Consts } from './AssignInfoConfig'
import { useAuth } from '../../../../hooks/AuthContext'
import { roleNames, statusNames } from '../../../../constants/Generals'
import * as TargetSchoolsServices from '../../TargetSchoolsServices'
import { getPurpsByStatus, handleMatchPurps } from '../../../../utils/Sortings'
import classes from './AssignInfo.module.scss'

const clientSchema = yup.object().shape({
    note: yup.string().trim(),
})

const ITEM_HEIGHT = 120
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT,
        },
    },
    anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
    },
    transformOrigin: {
        vertical: 'top',
        horizontal: 'center',
    },
    getContentAnchorEl: null,
}

const useStyles = makeStyles((theme) => ({
    root: {},
    menuItemRoot: {
        '&$menuItemSelected': { backgroundColor: 'rgba(0, 0, 0, 0.08)' },
        '&$menuItemSelected:focus': {
            backgroundColor: 'rgba(0, 0, 0, 0.12)',
        },
        '&$menuItemSelected:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04);',
        },
    },
    menuItemSelected: {},
    // disabledInput: {
    //     '& .MuiInputBase-root.Mui-disabled': {
    //         color: 'black',
    //     },
    // },
    inputRoot: {
        '&$disabled': {
            color: 'black',
        },
    },
    disabled: {},
}))

function AssignInfo(props) {
    const { target, refreshPage } = props
    const { headers, operations, fields } = Consts
    const styles = useStyles()

    const { user } = useAuth()

    const history = useHistory()

    const [notify, setNotify] = useState({
        isOpen: false,
        message: '',
        type: '',
    })

    const { salesPurps } = useApp()
    const bakSalesPurps = salesPurps
        ? salesPurps
        : Milk.getMilk(milkNames.salesPurps)

    const purpsByStatus = getPurpsByStatus(target?.schoolStatus, bakSalesPurps)

    const isMatch = handleMatchPurps(target?.purpose, purpsByStatus)

    const defaultValues = {
        // id: target?.id,
        // schoolYear: target?.schoolYear ? target?.schoolYear : schYears[0],
        purpose: target?.purpose ? target?.purpose : purpsByStatus[0],
        note: target?.note ? target?.note : '',
    }

    const { control, errors, handleSubmit, formState, reset } = useForm({
        resolver: yupResolver(clientSchema),
        defaultValues: defaultValues,
    })

    useEffect(() => {
        reset({
            // id: target?.id,
            // schoolYear: target?.schoolYear ? target?.schoolYear : schYears[0],
            purpose: target?.purpose ? target?.purpose : purpsByStatus[0],
            note: target?.note ? target?.note : '',
        })
    }, [target])

    if (!target) {
        return <Loading />
    }

    if (!target?.username) {
        return <NotFound title={operations.empty} />
    }

    const onSubmit = (data) => {
        const model = {
            ...data,
            noteBy: user.username,
        }

        TargetSchoolsServices.updateTarget(target?.id, model)
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

        // alert(JSON.stringify(model))
    }

    return (
        <div className={classes.panel}>
            <Grid container spacing={0} className={classes.body}>
                {/* Assign Info*/}
                {target?.schoolStatus !== statusNames.pending ? (
                    user.roles[0] !== roleNames.salesman ? (
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            className={classes.content}
                        >
                            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                <Grid
                                    container
                                    spacing={0}
                                    className={classes.wrapper}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        className={classes.row}
                                    >
                                        <Typography
                                            color="inherit"
                                            className={classes.header}
                                        >
                                            {headers.child1}
                                        </Typography>
                                    </Grid>

                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        className={classes.row}
                                    >
                                        <Grid
                                            container
                                            spacing={0}
                                            className={classes.rowx}
                                        >
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={4}
                                                lg={3}
                                                className={classes.rowx}
                                            >
                                                <Typography
                                                    color="inherit"
                                                    className={classes.title}
                                                >
                                                    {fields.pic.title}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={8}
                                                lg={6}
                                                className={classes.rowx}
                                            >
                                                <Typography color="inherit">
                                                    <div
                                                        className={classes.user}
                                                    >
                                                        {target?.avatar ? (
                                                            <Avatar
                                                                className={
                                                                    classes.avatar
                                                                }
                                                                alt="user avatar"
                                                                src={
                                                                    target?.avatar
                                                                }
                                                            />
                                                        ) : (
                                                            <Avatar
                                                                className={
                                                                    classes.avatar
                                                                }
                                                            >
                                                                {
                                                                    target?.fullName
                                                                        .split(
                                                                            ' '
                                                                        )
                                                                        .pop()[0]
                                                                }
                                                            </Avatar>
                                                        )}

                                                        <div
                                                            className={
                                                                classes.info
                                                            }
                                                        >
                                                            <Typography
                                                                component="span"
                                                                className={
                                                                    classes.fullName
                                                                }
                                                            >
                                                                {
                                                                    target?.fullName
                                                                }
                                                            </Typography>
                                                            <Typography
                                                                className={
                                                                    classes.username
                                                                }
                                                            >
                                                                {
                                                                    target?.username
                                                                }
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        className={classes.row}
                                    >
                                        <Grid
                                            container
                                            spacing={0}
                                            className={classes.rowx}
                                        >
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={4}
                                                lg={3}
                                                className={classes.rowx}
                                            >
                                                <Typography
                                                    color="inherit"
                                                    className={classes.title}
                                                >
                                                    {fields.schlYear.title}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={8}
                                                lg={6}
                                                className={classes.rowx}
                                            >
                                                <Typography color="inherit">
                                                    {target?.schoolYear}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        className={classes.row}
                                    >
                                        <Grid
                                            container
                                            spacing={0}
                                            className={classes.rowx}
                                        >
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={4}
                                                lg={3}
                                                className={classes.rowx}
                                            >
                                                <Typography
                                                    color="inherit"
                                                    className={classes.title}
                                                >
                                                    {fields.purpose.title}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={8}
                                                lg={6}
                                                className={classes.rowx}
                                            >
                                                <Controller
                                                    name="purpose"
                                                    control={control}
                                                    render={({
                                                        value,
                                                        onChange,
                                                    }) => (
                                                        <Select
                                                            value={value}
                                                            onChange={onChange}
                                                            MenuProps={
                                                                MenuProps
                                                            }
                                                            disableUnderline
                                                        >
                                                            {purpsByStatus.map(
                                                                (data) => (
                                                                    <MenuItem
                                                                        key={
                                                                            data
                                                                        }
                                                                        value={
                                                                            data
                                                                        }
                                                                        classes={{
                                                                            root:
                                                                                styles.menuItemRoot,
                                                                            selected:
                                                                                styles.menuItemSelected,
                                                                        }}
                                                                    >
                                                                        {data}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    )}
                                                />
                                                {!isMatch && (
                                                    <Chip
                                                        variant="outlined"
                                                        icon={
                                                            <MdWarning color="#d9534f" />
                                                        }
                                                        label={
                                                            operations.purpWarning
                                                        }
                                                        className={
                                                            classes.purpWarning
                                                        }
                                                    />
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        className={classes.row}
                                    >
                                        <Grid
                                            container
                                            spacing={0}
                                            className={classes.rowx}
                                        >
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={4}
                                                lg={3}
                                                className={classes.rowx}
                                            >
                                                <Typography
                                                    color="inherit"
                                                    className={classes.title}
                                                >
                                                    {fields.note.title}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={8}
                                                lg={6}
                                                className={classes.rowx}
                                            >
                                                <Controller
                                                    name="note"
                                                    control={control}
                                                    render={({
                                                        value,
                                                        onChange,
                                                    }) => (
                                                        <TextField
                                                            label={
                                                                target?.noteBy
                                                                    ? `${fields.note.hasNote} ${target?.noteBy}`
                                                                    : fields
                                                                          .note
                                                                          .noNote
                                                            }
                                                            variant="outlined"
                                                            fullWidth
                                                            multiline
                                                            rows={5}
                                                            value={value}
                                                            onChange={onChange}
                                                            error={
                                                                !!errors.note
                                                            }
                                                            helperText={
                                                                errors?.note
                                                                    ?.message
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        className={classes.row}
                                    >
                                        <Grid
                                            container
                                            spacing={0}
                                            className={classes.rowx}
                                        >
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={4}
                                                lg={3}
                                                // className={classes.row}
                                            />
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={8}
                                                lg={6}
                                                className={classes.action}
                                            >
                                                <Button
                                                    className={classes.submit}
                                                    variant="contained"
                                                    disabled={
                                                        !formState.isDirty
                                                    }
                                                    type="submit"
                                                >
                                                    {operations.save}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                    ) : user.username === target?.username ? (
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            className={classes.content}
                        >
                            <Grid
                                container
                                spacing={0}
                                className={classes.wrapper}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    className={classes.row}
                                >
                                    <Typography
                                        color="inherit"
                                        className={classes.header}
                                    >
                                        {headers.child1}
                                    </Typography>
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    className={classes.row}
                                >
                                    <Grid
                                        container
                                        spacing={0}
                                        className={classes.rowx}
                                    >
                                        <Grid
                                            item
                                            xs={12}
                                            sm={4}
                                            md={4}
                                            lg={3}
                                            className={classes.rowx}
                                        >
                                            <Typography
                                                color="inherit"
                                                className={classes.title}
                                            >
                                                {fields.pic.title}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={8}
                                            md={8}
                                            lg={6}
                                            className={classes.rowx}
                                        >
                                            {/* <Typography color="inherit"> */}
                                            <div className={classes.user}>
                                                {target?.avatar ? (
                                                    <Avatar
                                                        className={
                                                            classes.avatar
                                                        }
                                                        alt="user avatar"
                                                        src={target?.avatar}
                                                    />
                                                ) : (
                                                    <Avatar
                                                        className={
                                                            classes.avatar
                                                        }
                                                    >
                                                        {
                                                            target?.fullName
                                                                .split(' ')
                                                                .pop()[0]
                                                        }
                                                    </Avatar>
                                                )}

                                                <div className={classes.info}>
                                                    <Typography
                                                        component="span"
                                                        className={
                                                            classes.fullName
                                                        }
                                                    >
                                                        {target?.fullName}
                                                    </Typography>
                                                    <Typography
                                                        className={
                                                            classes.username
                                                        }
                                                    >
                                                        {target?.username}
                                                    </Typography>
                                                </div>
                                            </div>
                                            {/* </Typography> */}
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    className={classes.row}
                                >
                                    <Grid
                                        container
                                        spacing={0}
                                        className={classes.rowx}
                                    >
                                        <Grid
                                            item
                                            xs={12}
                                            sm={4}
                                            md={4}
                                            lg={3}
                                            className={classes.rowx}
                                        >
                                            <Typography
                                                color="inherit"
                                                className={classes.title}
                                            >
                                                {fields.schlYear.title}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={8}
                                            md={8}
                                            lg={6}
                                            className={classes.rowx}
                                        >
                                            <Typography color="inherit">
                                                {target?.schoolYear}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    className={classes.row}
                                >
                                    <Grid
                                        container
                                        spacing={0}
                                        className={classes.rowx}
                                    >
                                        <Grid
                                            item
                                            xs={12}
                                            sm={4}
                                            md={4}
                                            lg={3}
                                            className={classes.rowx}
                                        >
                                            <Typography
                                                color="inherit"
                                                className={classes.title}
                                            >
                                                {fields.purpose.title}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={8}
                                            md={8}
                                            lg={6}
                                            className={classes.rowx}
                                        >
                                            <Typography color="inherit">
                                                {target?.purpose}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    className={classes.row}
                                >
                                    <Grid
                                        container
                                        spacing={0}
                                        className={classes.rowx}
                                    >
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={4}
                                            lg={3}
                                            className={classes.rowx}
                                        >
                                            <Typography
                                                color="inherit"
                                                className={classes.title}
                                            >
                                                {fields.note.title}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={8}
                                            lg={6}
                                            className={classes.rowx}
                                        >
                                            <Controller
                                                name="note"
                                                control={control}
                                                render={({ value }) => (
                                                    <TextField
                                                        label={
                                                            target?.noteBy
                                                                ? `${fields.note.hasNote} ${target?.noteBy}`
                                                                : fields.note
                                                                      .noNote
                                                        }
                                                        variant="outlined"
                                                        fullWidth
                                                        multiline
                                                        rows={5}
                                                        disabled
                                                        InputProps={{
                                                            classes: {
                                                                root:
                                                                    styles.inputRoot,
                                                                disabled:
                                                                    styles.disabled,
                                                            },
                                                        }}
                                                        value={value}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    ) : (
                        <div className={classes.notFound}>
                            <NotFound title={operations.restriction} />
                        </div>
                    )
                ) : (
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        className={classes.content}
                    >
                        <Grid container spacing={0} className={classes.wrapper}>
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                                className={classes.row}
                            >
                                <Typography
                                    color="inherit"
                                    className={classes.header}
                                >
                                    {headers.child1}
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                                className={classes.row}
                            >
                                <Grid
                                    container
                                    spacing={0}
                                    className={classes.rowx}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        md={4}
                                        lg={3}
                                        className={classes.rowx}
                                    >
                                        <Typography
                                            color="inherit"
                                            className={classes.title}
                                        >
                                            {fields.pic.title}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={8}
                                        md={8}
                                        lg={6}
                                        className={classes.rowx}
                                    >
                                        {/* <Typography color="inherit"> */}
                                        <div className={classes.user}>
                                            {target?.avatar ? (
                                                <Avatar
                                                    className={classes.avatar}
                                                    alt="user avatar"
                                                    src={target?.avatar}
                                                />
                                            ) : (
                                                <Avatar
                                                    className={classes.avatar}
                                                >
                                                    {
                                                        target?.fullName
                                                            .split(' ')
                                                            .pop()[0]
                                                    }
                                                </Avatar>
                                            )}

                                            <div className={classes.info}>
                                                <Typography
                                                    component="span"
                                                    className={classes.fullName}
                                                >
                                                    {target?.fullName}
                                                </Typography>
                                                <Typography
                                                    className={classes.username}
                                                >
                                                    {target?.username}
                                                </Typography>
                                            </div>
                                        </div>
                                        {/* </Typography> */}
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                                className={classes.row}
                            >
                                <Grid
                                    container
                                    spacing={0}
                                    className={classes.rowx}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        md={4}
                                        lg={3}
                                        className={classes.rowx}
                                    >
                                        <Typography
                                            color="inherit"
                                            className={classes.title}
                                        >
                                            {fields.schlYear.title}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={8}
                                        md={8}
                                        lg={6}
                                        className={classes.rowx}
                                    >
                                        <Typography color="inherit">
                                            {target?.schoolYear}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                                className={classes.row}
                            >
                                <Grid
                                    container
                                    spacing={0}
                                    className={classes.rowx}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        md={4}
                                        lg={3}
                                        className={classes.rowx}
                                    >
                                        <Typography
                                            color="inherit"
                                            className={classes.title}
                                        >
                                            {fields.purpose.title}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={8}
                                        md={8}
                                        lg={6}
                                        className={classes.rowx}
                                    >
                                        <Typography color="inherit">
                                            {target?.purpose}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                                className={classes.row}
                            >
                                <Grid
                                    container
                                    spacing={0}
                                    className={classes.rowx}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={4}
                                        lg={3}
                                        className={classes.rowx}
                                    >
                                        <Typography
                                            color="inherit"
                                            className={classes.title}
                                        >
                                            {fields.note.title}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={8}
                                        lg={6}
                                        className={classes.rowx}
                                    >
                                        <Controller
                                            name="note"
                                            control={control}
                                            render={({ value }) => (
                                                <TextField
                                                    label={
                                                        target?.noteBy
                                                            ? `${fields.note.hasNote} ${target?.noteBy}`
                                                            : fields.note.noNote
                                                    }
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                    rows={5}
                                                    disabled
                                                    InputProps={{
                                                        classes: {
                                                            root:
                                                                styles.inputRoot,
                                                            disabled:
                                                                styles.disabled,
                                                        },
                                                    }}
                                                    value={value}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )}

                {/* Another content */}
            </Grid>
            <Snackbars notify={notify} setNotify={setNotify} />
        </div>
    )
}

export default AssignInfo
