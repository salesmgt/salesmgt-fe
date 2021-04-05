import React from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Select,
    Grid, Box,
    InputLabel,
    MenuItem,
    FormControl,
} from '@material-ui/core'
import { MdExpandMore, MdFilterList } from 'react-icons/md'
import { SearchFields } from '../../../../components'
import * as ReducerActions from '../../hooks/reducer-action-type'
import { useSchool } from '../../hooks/SchoolContext'
import Chips from '../Chips/Chips'
import styles from './Filters.module.scss'

//===============Set max-height for dropdown list===============
const ITEM_HEIGHT = 38;
const ITEM_PADDING_TOP = 5;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP,
        }
    }
};
//==============================================================

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 160,
    },
    flexBox: {
        padding: 0,
    },
    flexItem: {
        padding: 0
    },
    option: {
        fontSize: '0.875rem'
    }
}));

const MuiAccordion = withStyles({
    root: {
        backgroundColor: 'rgb(238, 238, 238)',
        // backgroundColor: 'rgb(255, 255, 255)',
        borderRadius: '8px',
        marginBottom: '0.5rem',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
            borderRadius: '8px',
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
            borderRadius: '8px',
        },
    },
    expanded: {},
})(Accordion);

const MuiAccordionSummary = withStyles({
    root: {
        height: 41.5,
        minHeight: 35,
        maxWidth: 120,
        backgroundColor: 'rgb(255, 255, 255)',
        fontWeight: 'bold',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        borderRadius: '8px',
        paddingButtom: 0,
        '&$expanded': {
            minHeight: 35,
            borderRadius: '8px',
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(AccordionSummary);

const MuiAccordionDetails = withStyles((theme) => ({
    root: {
        margin: '0.2rem 0 0.7rem 0',
        borderRadius: '8px',
    },
}))(AccordionDetails);

function Filters() {
    const classes = useStyles();

    //Use states which have been declared in the TargetSchoolContext
    const {
        params, dispatchParams,
        districts, schoolTypes, schoolLevels, schoolScales, schoolStatuses,
        district, schoolType, schoolLevel, schoolScale,
        schoolStatus, setDistrict, setSchoolType,
        setSchoolLevel, setSchoolScale, setSchoolStatus
    } = useSchool()

    //================Handle useState() of filters================
    const handleDistrictChange = (event) => {
        const selectedDistrict = event.target.value;
        setDistrict(selectedDistrict);

        if (selectedDistrict) { // !== ''
            dispatchParams({
                type: ReducerActions.FILTER_DISTRICT,
                payload: { filterType: 'district', filterValue: selectedDistrict }
            })
        } else {
            dispatchParams({
                type: ReducerActions.FILTER_DISTRICT,
                payload: { filterType: 'district', filterValue: '' }
            })
        }
    };

    const handleSchoolTypeChange = (event) => {
        const selectedSchoolType = event.target.value;
        setSchoolType(selectedSchoolType);

        if (selectedSchoolType) {   // !== ''
            dispatchParams({
                type: ReducerActions.FILTER_SCHOOL_TYPE,
                payload: { filterType: 'type', filterValue: selectedSchoolType }
            })
        } else {
            dispatchParams({
                type: ReducerActions.FILTER_SCHOOL_TYPE,
                payload: { filterType: 'type', filterValue: '' }
            })
        }
    };

    const handleSchoolLevelChange = (event) => {
        const selectedSchoolLevel = event.target.value;
        setSchoolLevel(selectedSchoolLevel);

        if (selectedSchoolLevel) {
            dispatchParams({
                type: ReducerActions.FILTER_SCHOOL_LEVEL,
                payload: { filterType: 'level', filterValue: selectedSchoolLevel }
            })
        } else {
            dispatchParams({
                type: ReducerActions.FILTER_SCHOOL_LEVEL,
                payload: { filterType: 'level', filterValue: '' }
            })
        }
    };

    const handleSchoolScaleChange = (event) => {
        const selectedSchoolScale = event.target.value;
        setSchoolScale(selectedSchoolScale);

        if (selectedSchoolScale) {
            dispatchParams({
                type: ReducerActions.FILTER_SCHOOL_SCALE,
                payload: { filterType: 'scale', filterValue: selectedSchoolScale }
            })
        } else {
            dispatchParams({
                type: ReducerActions.FILTER_SCHOOL_SCALE,
                payload: { filterType: 'scale', filterValue: '' }
            })
        }
    };

    const handleSchoolStatusChange = (event) => {
        const selectedSchoolStatus = event.target.value;
        setSchoolStatus(selectedSchoolStatus);

        if (selectedSchoolStatus) {
            dispatchParams({
                type: ReducerActions.FILTER_SCHOOL_STATUS,
                payload: { filterType: 'status', filterValue: selectedSchoolStatus }
            })
        } else {
            dispatchParams({
                type: ReducerActions.FILTER_SCHOOL_STATUS,
                payload: { filterType: 'status', filterValue: '' }
            })
        }
    };

    //==============Handle action delete from Chips and btn "Clear all"==============
    const handleChipsRemoved = (removedFilters) => {
        removedFilters.forEach(removedFilter => {
            switch (removedFilter) {
                case 'district':
                    setDistrict("All");
                    break;
                case 'type':
                    setSchoolType("All");
                    break;
                case 'level':
                    setSchoolLevel("All");
                    break;
                case 'scale':
                    setSchoolScale("All");
                    break;
                case 'status':
                    setSchoolStatus("All");
                    break;
                default:
                    break;
            }
        });
    };

    const generateChipsArray = (listFilters) => {
        const listChips = [];
        for (const chip in listFilters) {
            listChips.push(listFilters[chip]);
        }
        return listChips;
    }
    //===============================================================================

    //=================Handle action enter / submit of SearchFields==================
    const handleSearch = (keyword) => {
        dispatchParams({
            type: ReducerActions.ENTER_SEARCH_KEYWORD,
            payload: keyword
        })
    }

    return (
        <div className={styles.wrapper}>
            <MuiAccordion>
                <Box display="flex" flexWrap="nowrap" className={classes.flexBox}>
                    <Box className={classes.flexItem}>
                        <MuiAccordionSummary expandIcon={<MdExpandMore />}>
                            <MdFilterList style={{ fontSize: 20 }} /> &nbsp;
                        <Typography>Filters</Typography>
                        </MuiAccordionSummary>
                    </Box>
                    <Box flexGrow={1} className={classes.flexItem}>
                        <Chips
                            chips={generateChipsArray(params.listFilters)}
                            dispatch={dispatchParams}
                            handleChipsRemoved={handleChipsRemoved}
                        />
                    </Box>
                    <Box className={classes.flexItem}>
                        <SearchFields placeholder="Search..." onChange={handleSearch} />
                    </Box>
                </Box>
                <MuiAccordionDetails>
                    <Grid container>
                        <Grid item xs={6} sm={4} md={4} lg={4}>
                            <FormControl className={classes.formControl}>
                                <InputLabel>Districts</InputLabel>
                                <Select value={district} onChange={handleDistrictChange} MenuProps={MenuProps}>
                                    <MenuItem value="" className={classes.option}>All</MenuItem>
                                    {districts.map((dist) => (
                                        <MenuItem key={dist} value={dist} className={classes.option}>{dist}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6} sm={4} md={4} lg={4}>
                            <FormControl className={classes.formControl}>
                                <InputLabel>School Statuses</InputLabel>
                                <Select value={schoolStatus} onChange={handleSchoolStatusChange} MenuProps={MenuProps}>
                                    <MenuItem value="" className={classes.option}>All</MenuItem>
                                    {schoolStatuses.map((status) => (
                                        <MenuItem key={status} value={status} className={classes.option}>{status}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6} sm={4} md={4} lg={4}>
                            <FormControl className={classes.formControl}>
                                <InputLabel>School Types</InputLabel>
                                <Select value={schoolType} onChange={handleSchoolTypeChange} MenuProps={MenuProps}>
                                    <MenuItem value="" className={classes.option}>All</MenuItem>
                                    {schoolTypes.map((type) => (
                                        <MenuItem key={type} value={type} className={classes.option}>{type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6} sm={4} md={4} lg={4}>
                            <FormControl className={classes.formControl}>
                                <InputLabel>School Levels</InputLabel>
                                <Select value={schoolLevel} onChange={handleSchoolLevelChange} MenuProps={MenuProps}>
                                    <MenuItem value="" className={classes.option}>All</MenuItem>
                                    {schoolLevels.map((level) => (
                                        <MenuItem key={level} value={level} className={classes.option}>{level}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6} sm={4} md={4} lg={4}>
                            <FormControl className={classes.formControl}>
                                <InputLabel>School Scales</InputLabel>
                                <Select value={schoolScale} onChange={handleSchoolScaleChange} MenuProps={MenuProps}>
                                    <MenuItem value="" className={classes.option}>All</MenuItem>
                                    {schoolScales.map((scale) => (
                                        <MenuItem key={scale} value={scale} className={classes.option}>{scale}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </MuiAccordionDetails>
            </MuiAccordion>
        </div>
    )
}

export default Filters