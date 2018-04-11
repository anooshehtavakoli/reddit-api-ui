/**
 * Created by anoosheh on 4/9/18.
 */

const INITIAL_STATE = {
    subreddit: []
};

const redditReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "GET_TOPIC_LIST":
            return {...state, subreddit: action.data};
        default:
            return state;
    }
};

export default redditReducer;