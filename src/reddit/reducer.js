/**
 * Created by anoosheh on 4/9/18.
 */

const INITIAL_STATE = {
    subreddit: [],
    activePage: 1,
    isLoading: false,
    value: "",
    results: [],
    isTabLoading: true
};

const redditReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "LOAD_DATA_REQUESTED":
            return {...state, isTabLoading: true};
        case "GET_TOPIC_LIST":
            return {...state, activePage: 1, isTabLoading: false, subreddit: action.data};
        case "ACTIVE_PAGE_CHANGED":
            return {...state, activePage: action.data};
        case "RESET_SEARCH":
            return {...state, isSearchLoading: false, value: "", results: []};
        case "SELECT_SEARCH_RESULT":
            return {...state, isSearchLoading: false, value: action.data};
        case "SEARCH_CHANGED":
            return {...state, isSearchLoading: true, value: action.data};
        case "SEARCH_MATCHED":
            return {...state, isSearchLoading: false, results: action.data};
        default:
            return state;
    }
};

export default redditReducer;