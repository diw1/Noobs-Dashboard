import './index.css'
import WCLPage from './pages/WCL'
import * as serviceWorker from './serviceWorker'
import logger from 'redux-logger'

import mirror, { Router, Switch, render, Route, Redirect } from 'mirrorx'
import PlayersPage from './pages/Players'
import PlayerPage from './pages/Players/player'
import RaidsPage from './pages/Raids'
import initModels from './models'
import '@ant-design/pro-table/dist/table.css'
import RaidPage from './pages/Raids/raid'
import RolePage from './pages/Role'

initModels(mirror)

process.env.NODE_ENV === 'development' && mirror.defaults({
    middlewares : [logger],
})

render(
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
    </Router>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
