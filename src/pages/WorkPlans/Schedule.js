import React from 'react'
import { Avatar, Box, InputAdornment, InputBase, ListItem, ListItemAvatar, ListItemText, TextField } from '@material-ui/core';
import {
    Inject, ScheduleComponent, ViewsDirective, ViewDirective
    , Day, Week, Month, DragAndDrop, Resize
} from '@syncfusion/ej2-react-schedule'
import { TreeViewComponent } from '@syncfusion/ej2-react-navigations'
import { L10n, closest, addClass } from "@syncfusion/ej2-base";
import { CheckBox } from '@syncfusion/ej2-react-buttons';
import { Input } from '@syncfusion/ej2-inputs';
import { fade, makeStyles } from '@material-ui/core/styles';
import { MdAccountCircle, MdSearch } from 'react-icons/md';
import { Autocomplete } from '@material-ui/lab';
import './WorkPlans.scss'

const useStyles = makeStyles((theme) => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.black, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.black, 0.05),
        },
        marginLeft: 0,
        width: '80%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(3)}px)`,
        transition: theme.transitions.create('width'),
        width: '80%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
    autoComplete: {
        width: 250,
        marginLeft: '0.5rem'
    },
    itemPIC: {
        padding: 0,
        margin: 0
    },
    itemTextPrimary: {
        fontSize: '0.875rem',
    },
}));
L10n.load({
    'en-US': {
        'schedule': {
            'newEvent': 'Add New Activity',
            'editEvent': 'Edit Activity',
            'deleteEvent': 'Delete Activity',
            "deleteMultipleEvent": "Delete Multiple Activities",
            "sameDayAlert": "The activity cannot be beyond itnpm starts boundary.",
            "editRecurrence": "Edit Recurrence",
            "edit": "Edit",
        },
    }
});


const Schedule = (props) => {

    const classes = useStyles();
    const [key, setKey] = React.useState('')
    const [startTime, setStartTime] = React.useState(null)
    let schedule = React.useRef(null)
    let tree = React.useRef(null)
    let typingTimeoutRef = React.useRef(null)

    const { listPICs } = props  // , handleSearchNameChange

    const localDate = {
        dataSource: props.data,
        fields: {
            id: 'id',
            subject: {
                default: 'No title',
                name: 'title',
            },
            startTime: { name: 'startTime' },
            endTime: { name: 'endTime' },
            location: { name: 'location' },
            description: {
                name: 'description'
            },
            remark: {
                name: 'remark'
            },
            isCompleted: {
                name: 'isCompleted'
            },
            isAllDay: {
                name: 'isAllDay',
                default: false
            },
            recurrenceException: {
                name: 'recurrenceException'
            },
            recurrenceRule: {
                name: 'recurrenceRule'
            },
            recurrenceID: {
                name: 'recurrenceID'
            }
        },
        /* template: eventTemplate*/
    }
    const switchDate = (e) => {
        if (props.data === undefined) return
        if (e.previousDate)
            if (e.previousDate === e.currentDate) return
        if (props.data)
            props.handleChangeView(e)
    }

    const onPopupOpen = args => {
        console.log("pop up", args)
        const stringDelete = 'Edit Event'
        if (args.type === 'RecurrenceAlert')
            if (args.element.querySelector('.e-dlg-header').textContent === stringDelete) {
                args.element.querySelector('.e-dlg-header').innerHTML = "Edit Activity";
            }
        if (args.type === 'RecurrenceValidationAlert') {
            const string = 'Do you want to cancel the changes made to specific instances of this series and match it to the whole series again?'
            if (args.element.querySelector('.e-dlg-content').textContent === string &&
                args.element.querySelector('.e-quick-dialog-alert-btn').textContent === 'Yes') {
                let yesButton = args.element.querySelector('.e-quick-dialog-alert-btn')
                yesButton.style.display = "none"
                const noButton = args.element.querySelector('.e-quick-alertcancel')
                noButton.innerHTML = "Save";
                noButton.style.color = "#e3165b"
                args.element.querySelector('.e-dlg-content').innerHTML = "Your changes shall only apply to unchanged instances of this series. Are you sure ?";

            }
        }
        if (args.type === 'Editor') {
            if (args.element.querySelector('.e-time-zone-container')) {
                let timezone = args.element.querySelector('.e-time-zone-container')
                timezone.style.display = "none"
            }
            if (!args.element.querySelector('.custom-field-row')) {
                //var row =  HTMLElement.createElement('div', { className: 'custom-field-row' });
                const row = document.createElement('div')
                row.className = 'custom-field-row'
                const formElement = args.element.querySelector('.e-schedule-form');
                formElement.firstChild.insertBefore(row, args.element.querySelector('.e-description-row'));
                args.element.querySelector('.e-dialog-parent').appendChild(row);
                const container = document.createElement('div');
                container.className = 'custom-field-container'
                const inputEle = document.createElement('textarea');
                inputEle.className = 'e-field e-custom-remark'
                inputEle.setAttribute('name', 'remark');
                container.appendChild(inputEle);
                row.appendChild(container);
                Input.createInput({ element: inputEle, floatLabelType: 'Always', properties: { placeholder: 'Remark' } });
                const row2 = document.createElement('div');
                row2.className = 'custom-field-isCompleted'
                formElement.firstChild.insertBefore(row2, args.element.querySelector('.custom-field-row'));
                args.element.querySelector('.e-dialog-parent').appendChild(row2);
                const container2 = document.createElement('div');
                container2.className = 'custom-field-container2'
                const inputEle2 = document.createElement('input');
                inputEle2.className = 'e-field e-custom-isCompleted'
                inputEle2.setAttribute('name', 'isCompleted');
                container2.appendChild(inputEle2);
                row2.appendChild(container2);
                const checkbox = new CheckBox({ label: 'Completed' })
                checkbox.appendTo(inputEle2)
            }
        }

    }

    const onItemDrag = (e) => {
        if (schedule.isAdaptive) {
            const classElement = schedule.element.querySelector(
                ".e-device-hover"
            );
            if (classElement) {
                classElement.classList.remove("e-device-hover");
            }
            if (e.target.classList.contains("e-work-cells")) {
                addClass([e.target], "e-device-hover");
            }
        }

        if (document.body.style.cursor === "not-allowed") {
            document.body.style.cursor = "";
        }
        if (e.name === "nodeDragging") {
            const dragElementIcon = document.querySelectorAll(
                ".e-drag-item.treeview-external-drag .e-icon-expandable"
            );
            for (let i = 0; i < dragElementIcon.length; i++) {
                dragElementIcon[i].style.display = "none";
            }
        }
    }

    const onDrag = e => setStartTime(e.data?.startTime)

    const onActionBegin = (e) => {
        console.log('action này là ', e)
        if (e.requestType === 'eventCreate' || e.requestType === 'eventRemove' || e.requestType === 'eventChange') {
            props.handleRequestType(e, startTime)
            setStartTime(null)
        }
    }

    const onResize = e => {
        setStartTime(e.data?.startTime)
    }

    //====================Location tree====================
    const treeTemplate = (prop) => {
        return (
            <div id="waiting">
                <div id="waitdetails">
                    <div id="waitlist">{prop.schoolName}</div>
                    <div id="waitcategory"> {prop.district}
                    </div>
                </div>
            </div>
        );
    }

    const onTreeDragStop = (e) => {
        let treeElement = closest(e.target, ".e-treeview");
        if (!treeElement) {
            e.cancel = true;
            let scheduleElement = closest(e.target, ".e-content-wrap");
            if (scheduleElement) {
                let treeviewData = tree.fields.dataSource;
                if (e.target.classList.contains("e-work-cells")) {
                    const filteredData = treeviewData.filter(
                        item => item.id === parseInt(e.draggedNodeData.id, 10)
                    );
                    const cellData = schedule.getCellDetails(e.target)
                    let schoolName = filteredData[0].schoolName;
                    if (schoolName.includes('(default)'))
                        schoolName = schoolName.replace(' (default)', '')
                    const eventData = {
                        startTime: cellData.startTime,
                        endTime: cellData.endTime,
                        allDay: cellData.isAllDay,
                        location: schoolName + " (" + filteredData[0].district + ')'
                    }
                    schedule.openEditor(eventData, 'Add', true);
                }
            }
        }
    }

    const onSearchChange = (e) => {
        setKey(e.target.value);
        if (typingTimeoutRef.current)
            clearTimeout(typingTimeoutRef)
        typingTimeoutRef.current = setTimeout(() => {
            props.onSubmit(e.target.value)
        }, 300)
    }

    const onPopupClose = e => {
        if (e.element.querySelector('.e-quick-dialog-alert-btn')) {
            let yesButton = e.element.querySelector('.e-quick-dialog-alert-btn')
            yesButton.style.display = "inline"
            let noButton = e.element.querySelector('.e-quick-alertcancel')
            noButton.style.color = "rgba(0,0,0,0.87)"
        }
    }

    const onEventRender = (e) => {
        let data = e.data
        e.element.style.backgroundColor = "RGB(54,162, 235)"
        if ((data.startTime).getTime() < new Date().getTime() && (data.endTime).getTime() < new Date().getTime() && !data.isCompleted) {
            e.element.style.backgroundColor = "rgb(255,99,132)"
        }
        if (data.isCompleted) {
            e.element.style.backgroundColor = "#009688"
        }

    }

    const [PIC, setPIC] = React.useState(null)
    // Search other's workplan
    const handleSearchNameChange = (e, newPIC) => {
        console.log('event PIC: ', newPIC);
        setPIC(newPIC);
    }

    return (
        <div className="schedule-control-section">
            <div className="col-lg-12 control-section">
                <div className="control-wrapper drag-sample-wrapper">
                    <div className="schedule-container">
                        <div className="my-header">
                            {/* <h1 className="title-text">My Workplan</h1> */}
                            <Autocomplete
                                autoComplete
                                autoSelect
                                autoHighlight
                                clearOnEscape
                                options={listPICs}
                                getOptionLabel={(pic) => pic.fullName ? pic.fullName : ""}
                                value={PIC}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        label="Person"
                                        margin="normal"
                                        placeholder="Search workplan of...?"
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <>
                                                    <InputAdornment position="start">
                                                        <MdAccountCircle />
                                                    </InputAdornment>
                                                    {params.InputProps.startAdornment}
                                                </>
                                            )
                                        }}
                                    />
                                }
                                renderOption={(option) => {
                                    return (
                                        <ListItem className={classes.itemPIC}>
                                            <ListItemAvatar>
                                                <Avatar src={option.avatar} />
                                            </ListItemAvatar>
                                            <ListItemText primary={option.fullName ? option.fullName : ""} classes={{ primary: classes.itemTextPrimary }} />
                                        </ListItem>
                                    );
                                }}
                                className={classes.autoComplete}
                                onChange={(event, newPIC) => handleSearchNameChange(event, newPIC)}
                            />
                        </div>
                        <ScheduleComponent currentView='Week'
                            popupClose={onPopupClose}
                            height="550px"
                            resizeStart={onResize}
                            cssClass="schedule-drag-drop"
                            ref={e => schedule = e}
                            actionBegin={onActionBegin}
                            dateFormat='dd MMM yyyy'
                            allowResizing
                            timezone="Asia/Saigon"
                            drag={onDrag}
                            eventRendered={onEventRender}
                            allowDragAndDrop
                            navigating={switchDate}
                            popupOpen={onPopupOpen}
                            selectedDate={props.filter.currentDate} eventSettings={localDate} showWeekNumber
                        >
                            <ViewsDirective>
                                <ViewDirective option='Day' />
                                <ViewDirective option='Week' /* eventTemplate={eventWeekTemplate}*/ />
                                <ViewDirective option='Month' />
                            </ViewsDirective>
                            <Inject services={[Day, Week, Month, DragAndDrop, Resize]} />
                        </ScheduleComponent>
                    </div>
                    <div className="treeview-container">
                        <div className="title-container">
                            <h1 className="title-text">Location List</h1>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <MdSearch />
                                </div>
                                <InputBase
                                    value={key}
                                    onChange={onSearchChange}
                                    placeholder="Search…"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </div>
                        </div>
                        <TreeViewComponent
                            ref={e => tree = e}
                            cssClass="treeview-external-drag"
                            allowDragAndDrop
                            fields={{ dataSource: props.tree, id: 'id', text: 'schoolName' }}
                            nodeDragStop={onTreeDragStop}
                            nodeTemplate={treeTemplate}
                            nodeDragging={onItemDrag}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Schedule