import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/core/styles'
import { theme } from './styles'

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router basename={process.env.PUBLIC_URL}>
            <App />
        </Router>
    </ThemeProvider>,
    document.getElementById('root')
)