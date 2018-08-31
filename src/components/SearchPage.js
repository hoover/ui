import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';
import { Component } from 'react';
import { connect } from 'react-redux';

import {
    fetchCollections,
    parseSearchUrlQuery,
    search,
    updateSearchQuery,
    fetchNextDoc,
    fetchPreviousDoc,
} from '../actions';

import { SEARCH_GUIDE } from '../constants';
import SearchLeftDrawer from './SearchLeftDrawer';
import SearchResults from './SearchResults';
import SearchRightDrawer from './SearchRightDrawer';
import SearchSettings from './SearchSettings';
import SplitPaneLayout from './SplitPaneLayout';
import Modal from '@material-ui/core/Modal';

const styles = theme => ({
    error: {
        paddingTop: theme.spacing.unit * 2,
    },
    main: {
        paddingLeft: theme.spacing.unit * 3,
        paddingRight: theme.spacing.unit * 3,
    },
    keyHelp: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
    },
});

const keyMap = {
    nextItem: 'j',
    previousItem: 'k',
    openItem: 'o',
    focusInputField: '/',
    showHelp: '?',
};

const keyHelp = {
    nextItem: 'Preview next result',
    previousItem: 'Preview the previous result',
    openItem: 'Open the currently previewed result',
    focusInputField: 'Focus the search field',
    showHelp: 'Show this help text',
};

const KeyHelp = ({ open, onClose, className }) => (
    <Modal open={open} onClose={onClose}>
        <div className={className}>
            <Typography variant="title">Keyboard shortcuts</Typography>

            <List dense>
                {Object.entries(keyMap).map(([key, shortcut]) => (
                    <ListItem key={key}>
                        <span className="mono">{shortcut}</span>
                        <ListItemText primary={keyHelp[key]} />
                    </ListItem>
                ))}
            </List>
        </div>
    </Modal>
);

class SearchPage extends Component {
    static propTypes = {
        isFetching: PropTypes.bool.isRequired,
        results: PropTypes.shape({
            hits: PropTypes.shape({
                hits: PropTypes.array,
            }).isRequired,
        }).isRequired,
        query: PropTypes.object.isRequired,
        error: PropTypes.object,
        selectedCollections: PropTypes.arrayOf(PropTypes.string),
    };

    state = {
        keyHelpOpen: false,
    };

    async componentDidMount() {
        const { dispatch } = this.props;

        await dispatch(fetchCollections());
        dispatch(parseSearchUrlQuery());
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.selectedCollections.length === 0 &&
            this.props.selectedCollections.length &&
            this.props.query.q &&
            this.props.query.q.length
        ) {
            this.props.dispatch(search());
        }
    }

    componentDidCatch(error, info) {
        this.setState({ error });
    }

    handleInputChange = event =>
        this.props.dispatch(
            updateSearchQuery({ q: event.target.value }, { syncUrl: false })
        );

    handleSubmit = event => {
        event.preventDefault();
        this.props.dispatch(updateSearchQuery({}, { resetPagination: true }));
    };

    isSearchFieldFocused() {
        return this.inputElement === document.activeElement;
    }

    moveToNextItem = () => {
        if (!this.isSearchFieldFocused()) {
            this.props.dispatch(fetchNextDoc());
        }
    };

    moveToPreviousItem = () => {
        if (!this.isSearchFieldFocused()) {
            this.props.dispatch(fetchPreviousDoc());
        }
    };

    focusInputField = e => {
        if (!this.isSearchFieldFocused()) {
            e.preventDefault();
            this.inputElement && this.inputElement.focus();
        }
    };

    openCurrentItem = e => {
        this.isSearchFieldFocused() || window.open(this.props.docUrl, '_blank');
    };

    showKeyHelp = e => {
        if (!this.isSearchFieldFocused()) {
            e.preventDefault();
            this.setState({ keyHelpOpen: true });
        }
    };

    hideKeyHelp = () => this.setState({ keyHelpOpen: false });

    render() {
        const { classes, error, query, isFetching, results } = this.props;
        const { error: localError, keyHelpOpen } = this.state;

        if (localError) {
            return <Typography color="error">{localError.toString()}</Typography>;
        }

        return (
            <HotKeys
                keyMap={keyMap}
                handlers={{
                    nextItem: this.moveToNextItem,
                    previousItem: this.moveToPreviousItem,
                    focusInputField: this.focusInputField,
                    openItem: this.openCurrentItem,
                    showHelp: this.showKeyHelp,
                }}>
                <SplitPaneLayout
                    left={<SearchLeftDrawer />}
                    right={<SearchRightDrawer />}>
                    <div className={classes.main}>
                        <Grid container>
                            <Grid item sm={12}>
                                <form onSubmit={this.handleSubmit}>
                                    <TextField
                                        inputRef={node => (this.inputElement = node)}
                                        name="q"
                                        value={query.q || ''}
                                        onChange={this.handleInputChange}
                                        label="Search"
                                        margin="normal"
                                        fullWidth
                                        type="search"
                                        autoFocus
                                    />
                                </form>

                                <Grid container justify="space-between">
                                    <Grid item>
                                        <Typography variant="caption">
                                            Refine your search using{' '}
                                            <a href={SEARCH_GUIDE}>
                                                this handy guide
                                            </a>
                                            .
                                        </Typography>
                                    </Grid>

                                    <Grid item>
                                        <Typography variant="caption">
                                            <Link href="/batch-search">
                                                <a>Batch search</a>
                                            </Link>
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <SearchSettings />
                            </Grid>
                        </Grid>

                        {error && (
                            <div className={classes.error}>
                                <Typography color="error">
                                    {error.toString()}
                                </Typography>
                            </div>
                        )}

                        <Grid container>
                            <Grid item sm={12}>
                                <SearchResults
                                    isFetching={isFetching}
                                    results={results}
                                    query={query}
                                />
                            </Grid>
                        </Grid>

                        <KeyHelp
                            open={keyHelpOpen}
                            onClose={this.hideKeyHelp}
                            className={[classes.keyHelp, classes.paper].join(' ')}
                        />
                    </div>
                </SplitPaneLayout>
            </HotKeys>
        );
    }
}

const mapStateToProps = ({
    search,
    collections: { selected },
    doc: { url: docUrl },
}) => ({
    ...search,
    selectedCollections: selected,
    docUrl,
});

export default withStyles(styles)(connect(mapStateToProps)(SearchPage));
