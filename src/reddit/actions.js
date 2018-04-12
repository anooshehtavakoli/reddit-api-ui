/**
 * Created by anoosheh on 4/10/18.
 */

import _ from 'lodash'

/**
 * Loads subreddit data for the given topic.
 * @param topic Given topic.
 */
export const loadTabData = (topic) => {

    return (dispatch) => {
        dispatch({
            type: "LOAD_DATA_REQUESTED"
        });

        fetchTopicList(topic)
            .then(response => {
                dispatch({
                    type: 'GET_TOPIC_LIST',
                    data: response.data.children
                });
            });
    };

};

/**
 * Fetch the data from www.reddit.com for given topic.
 * @param topic Given topic.
 * @returns {Promise.<T>|Promise}
 */
const fetchTopicList = (topic) => {
    return fetch(`https://www.reddit.com/r/${topic}.json`)
        .then(response => response.json())
        .catch(error => error);
};

/**
 * Sets the active page index in state.
 * @param activePage Active page index.
 */
export const setActivePage = (activePage) => {
    return {
        type: "ACTIVE_PAGE_CHANGED",
        data: activePage
    };
};

/**
 * Resets the state properties related to search box.
 */
export const resetSearch = () => {
    return {
        type: "RESET_SEARCH"
    }
};

/**
 * Sets the selected search result to state.
 * @param result Selected search result.
 */
export const selectSearchResult = (result) => {
    return (dispatch) => {
        dispatch({
            type: "SELECT_SEARCH_RESULT",
            data: result.title
        });
    }
};

/**
 * Sets the updated search query and search results to the state.
 * @param value Updated search query.
 * @param subreddit Search results.
 */
export const searchChanged = (value, subreddit) => {
    return (dispatch) => {
        if (value.length < 1) {
            dispatch({
                type: "RESET_SEARCH"
            });
        } else {
            dispatch({
                type: "SEARCH_CHANGED",
                data: value
            });

            setTimeout(() => {
                if (value.length < 1) {
                    return () => this.resetSearch();
                }

                const re = new RegExp(_.escapeRegExp(value), 'i');
                const isMatch = result => re.test(result.title);

                dispatch({
                    type: "SEARCH_MATCHED",
                    data: _.filter(subreddit, isMatch)
                });
            }, 300)
        }
    }
};