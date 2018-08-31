import { Component } from 'react';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Chart from '../src/components/Chart';

const styles = theme => ({
    toolbar: theme.mixins.toolbar,
});

class Insights extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div>
                <div className={classes.toolbar} />

                <Grid container>
                    <Grid item>
                        <Chart />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(Insights);
