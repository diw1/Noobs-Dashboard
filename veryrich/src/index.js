import './index.css'

import * as serviceWorker from './serviceWorker'
import logger from 'redux-logger'
import {Spin} from 'antd'
import mirror, { Router, Switch, render, Route, Redirect } from 'mirrorx'
import initModels from './models'
import {Suspense, lazy} from 'react'

const PlayersPage = lazy(()=> import( './pages/Players'))
const PlayerPage = lazy(()=> import( './pages/Players/player'))
const RaidsPage = lazy(()=> import( './pages/Raids'))
const WCLPage = lazy(()=> import( './pages/WCL'))
import ('@ant-design/pro-table/dist/table.css')
const RaidPage = lazy(()=> import( './pages/Raids/raid'))
const RolePage = lazy(()=> import( './pages/Role'))

initModels(mirror)

process.env.NODE_ENV === 'development' && mirror.defaults({
    middlewares : [logger],
})

render(
    <Suspense fallback={()=><Spin />}>
        <Router base>
            <Switch>
                <Redirect exact from='/' to='/players'/>
                <Redirect exact from='/Noobs-Dashboard' to='/players'/>
                <Route path='/wcl' component={WCLPage}/>
                <Route path='/players' component={PlayersPage}/>
                <Route exact path='/player/:playerId' component={PlayerPage}/>
                <Route exact path='/raids' component={RaidsPage}/>
                <Route exact path='/raid/:raidId' component={RaidPage}/>
                <Route exact path='/roles' component={RolePage}/>
                <Route exact path='/role/:roleId' component={RolePage}/>
            </Switch>
        </Router></Suspense>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
