/**
 * Created by anoosheh on 4/9/18.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getTopicList} from './actions.js';
import { Header, Icon, Tab, List, Segment } from 'semantic-ui-react'

const topics = ["Architecture", "Art", "Business", "Education", "Entertainment", "Gaming", "General",
    "Hobbies and Interests", "Law", "Lifestyle", "Locations", "Meta", "Music", "News and Politics", "Science",
    "Social Science and Humanities", "Sports", "Technology", "Travel", "Other"];

class Reddit extends Component {

    componentWillMount() {
        this.props.getTopicList(topics[0].toLowerCase());
    }

    loadTabData(activeIndex) {
        const topic = topics[activeIndex].toLowerCase();
        this.props.getTopicList(topic);
    }

    render() {
        const {subreddit} = this.props;
        const panes = topics.map((topic) => ({
            menuItem: topic,
            render: () => {
                const listItems = subreddit.map((child, i) => <List.Item key={i}>{child.data.id}</List.Item>);
                return (
                    <Tab.Pane>
                        <List>
                            {listItems}
                        </List>
                    </Tab.Pane>
                );
            }
        }));

        return (
            <div style={styles.tabContainer}>
                <Segment.Group>
                    <Segment>
                        <Header as='h2' textAlign='center'>
                            <Icon name='reddit alien' style={styles.redditIcon}/>
                            <Header.Content>
                                Reddit API
                            </Header.Content>
                        </Header>
                    </Segment>

                    <Segment>
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
        color: "#EB5729"
    }
};

const mapStateToProps = (state) => {
    const {subreddit} = state.redditReducer;
    return (
        {subreddit}
    );
};

export default connect(mapStateToProps, {getTopicList})(Reddit);