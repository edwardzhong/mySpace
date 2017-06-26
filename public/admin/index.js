import React,{Component} from 'react'
import {render} from 'react-dom'
import { createStore,applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import {BrowserRouter,HashRouter,hashHistory, Route, Redirect,Switch } from 'react-router-dom'//4.0版本之后
import logger from 'redux-logger'
import rootReducer from './reducers'
import loadSagas from './sagas'
import WriteMode from './containers/WriteMode'
import TrashMode from './containers/TrashMode'
// import './less/main.less'

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware,logger)
);
sagaMiddleware.run(loadSagas);

render(
  <Provider store={store}>
    <HashRouter history={hashHistory}>
      <div style={{height:100+'%'}}>
        <Switch>
          <Route exact path="/" render={() => (
            <Redirect to="/write"/>
          )}/>
          <Route path="/write" component={WriteMode} />
          <Route path="/trash" component={TrashMode} />
          <Route component={WriteMode} />
        </Switch>
      </div>
    </HashRouter>
  </Provider>,
  document.getElementById('write')
)
