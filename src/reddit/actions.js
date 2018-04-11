/**
 * Created by anoosheh on 4/10/18.
 */

export const getTopicList = (topic) => {

    return (dispatch) => {
        fetchTopicList(topic)
            .then(response => {
                dispatch({
                    type: 'GET_TOPIC_LIST',
                    data: response.data.children
                });
            });
    };

};

const fetchTopicList = (topic) => {
    return fetch(`https://www.reddit.com/r/${topic}.json`)
        .then(response => response.json())
        .catch(error => error);
};