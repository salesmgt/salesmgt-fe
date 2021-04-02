import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../hooks/AuthContext'

function PublicRoute(props) {
    const { component: Component, restricted, ...rest } = props

    const { user } = useAuth()

    // const isAuthenticated = user != null ? true : false
    const isAuthenticated = !!user

    return (
        <Route
            {...rest}
            render={(props) => {
                return isAuthenticated && restricted ? (
                    // <Redirect to="/apps/accounts" />
                    <Redirect
                        to={
                            user.roles[0] !== 'ADMIN'
                                ? '/apps/dashboards'
                                : '/apps/accounts'
                        }
                    />
                ) : (
                    <Component {...props} />
                )
            }}
        />
    )
}

export default PublicRoute
