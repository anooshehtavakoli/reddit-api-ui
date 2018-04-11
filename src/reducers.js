/**
 * Created by anoosheh on 4/9/18.
 */

import {combineReducers} from 'redux';
import redditReducer from './reddit/reducer.js';

const reducers = {
    redditReducer: redditReducer
};

export default combineReducers(reducers);