import React, { Component } from 'react';
import {applyMiddleware, createStore} from 'redux';
import ReduxThunk from 'redux-thunk';
import Reddit from './reddit/Reddit.js';
import {Provider} from 'react-redux';
import reducers from './reducers.js';

class App extends Component {

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    return (
        <Provider store={store}>
            <Reddit />
        </Provider>
    );
  }
}

export default App;
