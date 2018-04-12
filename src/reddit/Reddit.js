/**
 * Created by anoosheh on 4/9/18.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash'
import {loadTabData, setActivePage, resetSearch, selectSearchResult, searchChanged} from './actions.js';
import { Header, Icon, Tab, List, Segment, Pagination, Feed, Card, Search } from 'semantic-ui-react'

const topics = {
    architecture: "Architecture" ,
    art: "Art",
    business: "Business",
    education: "Education",
    entertainment: "Entertainment",
    gaming: "Gaming",
    Interests_and_Hobbies: "Hobbies and Interests",
    law: "Law",
    lifestyle: "Lifestyle",
    meta: "Meta",
    music: "Music",
    newspolitics: "News and Politics",
    science: "Science",
    humanities: "Social Science and Humanities",
    sports: "Sports",
    technology: "Technology",
    travel: "Travel",
    other: "Other"
};

class Reddit extends Component {

    /**
     * Loads subreddit data for the active tab.
     * @param activeIndex Index of the active tab.
     */
    loadTabData(activeIndex) {
        const key = Object.keys(topics)[activeIndex];
        this.props.loadTabData(key);
    }

    /**
     * Sets the active tab index.
     * @param activePage Active tab index.
     */
    setActivePage(activePage) {
        this.props.setActivePage(activePage);
    }

    /**
     * Compares two subreddits in terms of their points (ups - downs); higher points come first in lists.
     * @param subreddit1 First subreddit.
     * @param subreddit2 Second subreddit.
     * @returns {number} -1 if first subreddit is larger than 2nd; +1 if 2nd is larger; 0 if equal.
     */
    compare(subreddit1, subreddit2) {
        const subreddit1Points = subreddit1.data.ups - subreddit1.data.downs;
        const subreddit2Points = subreddit2.data.ups - subreddit2.data.downs;
        if (subreddit1Points > subreddit2Points) {
            return -1;
        }

        if (subreddit2Points > subreddit1Points) {
            return +1;
        }

        return 0;
    }

    /**
     * Handles search result selection.
     * @param result Selected result.
     */
    handleResultSelect(result) {
        this.props.selectSearchResult(result);
    }

    /**
     * Handles changes of search query.
     * @param event Text change event.
     * @param value Current value of the search query.
     */
    handleSearchChange(event, {value}) {
        const listOfData = this.props.subreddit.map((child) => {return child.data;});
        this.props.searchChanged(value, listOfData);
    }

    /**
     * Resets the search box.
     */
    resetSearch() {
        this.props.resetSearch();
    }

    /**
     * Gets list of items to be shown in active tab.
     * @param subreddit List of subreddits in current topic.
     * @param activePage Active tab index.
     * @returns {*} List of items to be shown in active tab.
     */
    getListItems(subreddit, activePage) {
        const listItems = subreddit.map((child, i) => {

            // first subreddit index in current page
            const start = (activePage - 1) * 20;
            // last subreddit index in currernt page
            const end = start + 20;
            const {data} = child;

            if (i >= start && i < end) {
                const link = `https://www.reddit.com/${data.permalink}`;
                const image = (data.thumbnail !== "" && data.thumbnail_height !== null) ?
                    data.thumbnail : "https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png";
                const date = new Date();
                date.setUTCMilliseconds(data.created_utc);
                return <List.Item key={i}>
                    <Card fluid>
                        <Feed style={styles.feed}>
                            <Feed.Event>
                                <Feed.Label image={image} />
                                <Feed.Content>
                                    <Feed.Summary>
                                        <a href={link} target="_blank">{data.title}</a>
                                        <Feed.Date>{date.toDateString()}</Feed.Date>
                                    </Feed.Summary>

                                    <Feed.Meta>
                                        <Feed.Like>
                                            <Icon name='like' />
                                            Ranking: {data.score}
                                        </Feed.Like>
                                        <Feed.Like>
                                            <Icon name='feed' />
                                            Subscribers: {data.subreddit_subscribers}
                                        </Feed.Like>
                                    </Feed.Meta>
                                </Feed.Content>
                            </Feed.Event>
                        </Feed>
                    </Card>
                </List.Item>;
            }
        });

        return listItems;
    }

    /**
     * Renders all tab panes.
     * @param subreddit Subreddits of the current page.
     * @param activePage Current page index.
     * @param isTabLoading True if tab data is still being loaded, false otherwise.
     * @returns {XML} Tab panes.
     */
    renderTabPanes(subreddit, activePage, isTabLoading) {
        // sort subreddits based on their points
        subreddit.sort(this.compare);
        const count = Object.keys(subreddit).length;
        const listItems = this.getListItems(subreddit, activePage);
        return (
            <div>
                <Tab.Pane loading={isTabLoading}>
                    <List>
                        {listItems}
                    </List>
                </Tab.Pane>
                <Pagination
                    activePage={activePage}
                    totalPages={count / 20}
                    onPageChange={(event, data) => this.setActivePage(data.activePage)}
                    />
            </div>
        );
    }

    componentWillMount() {
        // when page loads for the 1st time, we load the data to first tab
        this.props.loadTabData('architecture');
    }

    render() {
        const {subreddit, activePage, isSearchLoading, value, results, isTabLoading} = this.props;

        // create all tab panes
        const panes = Object.values(topics).map((topic) => ({
            menuItem: topic,
            render: () => this.renderTabPanes(subreddit, activePage, isTabLoading)
        }));

        return (
            <div style={styles.tabContainer}>
                <Segment.Group>
                    <Segment>
                        <Header as='h2' style={styles.header}>
                            <Icon name='reddit alien' style={styles.redditIcon}/>
                            <Header.Content>
                                Reddit API
                            </Header.Content>
                        </Header>
                    </Segment>

                    <Segment>
                        <Search
                            loading={isSearchLoading}
                            onResultSelect={(event, data) => this.handleResultSelect(data.result)}
                            onSearchChange={_.debounce(this.handleSearchChange.bind(this), 500, { leading: true })}
                            value={value}
                            results={results}
                        />
                        <Tab
                            menu={{ fluid: true, vertical: true, tabular: 'right', color: 'teal' }}
                            panes={panes}
                            onTabChange={(event, data) => this.loadTabData(data.activeIndex)}
                        />
                    </Segment>
                </Segment.Group>
            </div>
        );
    }
}

const styles = {
    tabContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15
    },
    redditIcon: {
        color: "#EB5729",
        fontSize: 50
    },
    feed: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10
    },
    header: {
        textAlign: 'center',
        alignItems: 'center'
    }
};

const mapStateToProps = (state) => {
    const {subreddit, activePage, isSearchLoading, value, results, isTabLoading} = state.redditReducer;
    return (
        {subreddit, activePage, isSearchLoading, value, results, isTabLoading}
    );
};

export default connect(mapStateToProps, {loadTabData, setActivePage, resetSearch, selectSearchResult, searchChanged})(Reddit);