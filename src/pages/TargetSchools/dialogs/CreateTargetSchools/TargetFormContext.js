import React, { useState, useContext, createContext, useReducer } from 'react'
import { TargetFormReducer } from './TargetFormReducer'
import {
    DISTRICT_FILTER,
    TYPE_FILTER,
    LEVEL_FILTER,
    SCALE_FILTER,
    STATUS_FILTER,
} from '../../../../constants/Filters'
import { statusNames } from '../../../../constants/Generals'

const TargetFormContext = createContext()

export function useTargetForm() {
    return useContext(TargetFormContext)
}

let defaultFilters = {
    district: { filterType: DISTRICT_FILTER, filterValue: '' },
    type: { filterType: TYPE_FILTER, filterValue: '' },
    level: { filterType: LEVEL_FILTER, filterValue: '' },
    scale: { filterType: SCALE_FILTER, filterValue: '' },
    status: { filterType: STATUS_FILTER, filterValue: statusNames.lead },
    // schoolYear: { filterType: SCHOOL_YEAR_FILTER, filterValue: '' },
}

function useTargetFormProvider() {
    // Reducer
    const [params, dispatchParams] = useReducer(TargetFormReducer, {
        listFilters: defaultFilters,
        searchKey: '',
        page: 0,
        limit: 10,
        column: 'id',
        direction: 'asc',
    })

    // Paging
    const [page, setPage] = useState(params.page)
    const [limit, setLimit] = useState(params.limit)

    // Sorting
    const [column, setColumn] = useState(params.column)
    const [direction, setDirection] = useState(params.direction)

    //Filters
    const [district, setDistrict] = useState('')
    const [schoolType, setSchoolType] = useState('')
    const [schoolLevel, setSchoolLevel] = useState('')
    const [schoolScale, setSchoolScale] = useState('')
    const [schoolStatus, setSchoolStatus] = useState(
        defaultFilters?.status?.filterValue
    )

    // fix major BUG
    const setFilter = (key, value) => {
        switch (key) {
            case DISTRICT_FILTER:
                defaultFilters = {
                    ...defaultFilters,
                    district: {
                        filterType: DISTRICT_FILTER,
                        filterValue: value,
                    },
                }
                setDistrict(value)
                break
            case TYPE_FILTER:
                defaultFilters = {
                    ...defaultFilters,
                    type: { filterType: TYPE_FILTER, filterValue: value },
                }
                setSchoolType(value)
                break
            case LEVEL_FILTER:
                defaultFilters = {
                    ...defaultFilters,
                    level: { filterType: LEVEL_FILTER, filterValue: value },
                }
                setSchoolLevel(value)
                break
            case SCALE_FILTER:
                defaultFilters = {
                    ...defaultFilters,
                    scale: { filterType: SCALE_FILTER, filterValue: value },
                }
                setSchoolScale(value)
                break
            case STATUS_FILTER:
                defaultFilters = {
                    ...defaultFilters,
                    status: { filterType: STATUS_FILTER, filterValue: value },
                }
                setSchoolStatus(value)
                break
            default:
                break
        }
    }

    return {
        params,
        dispatchParams,
        page,
        setPage,
        limit,
        setLimit,
        direction,
        setDirection,
        column,
        setColumn,
        district,
        schoolType,
        schoolLevel,
        schoolScale,
        schoolStatus,
        setFilter,
    }
}

function TargetFormProvider(props) {
    const { children } = props
    const targetForm = useTargetFormProvider()

    return (
        <TargetFormContext.Provider value={targetForm}>
            {children}
        </TargetFormContext.Provider>
    )
}

export default TargetFormProvider
