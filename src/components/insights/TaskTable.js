import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { formatTitleCase } from '../../utils'

const useStyles = makeStyles(theme => ({
    table: {
        '& th': {
            fontWeight: 'bold',
        }
    }
}))

export default function TaskTable({ tasks }) {
    const classes = useStyles()

    return (
        <TableContainer>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Func</TableCell>
                        <TableCell align="right">Pending</TableCell>
                        <TableCell align="right">Deferred</TableCell>
                        <TableCell align="right">Success</TableCell>
                        <TableCell align="right">Broken</TableCell>
                        <TableCell align="right">Error</TableCell>
                        <TableCell align="right">5M</TableCell>
                        <TableCell align="right">5M Duration</TableCell>
                        <TableCell align="right">5M Fill</TableCell>
                        <TableCell align="right">ETA</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tasks.map(([task, status]) => (
                        <TableRow key={task}>
                            <TableCell>
                                {formatTitleCase(task)}
                            </TableCell>
                            <TableCell align="right">{status.pending}</TableCell>
                            <TableCell align="right">{status.deferred}</TableCell>
                            <TableCell align="right">{status.success}</TableCell>
                            <TableCell align="right">{status.broken}</TableCell>
                            <TableCell align="right">{status.error}</TableCell>
                            <TableCell align="right">{status['5m']}</TableCell>
                            <TableCell align="right">{status['5m_duration']}</TableCell>
                            <TableCell align="right">{status['5m_fill']}</TableCell>
                            <TableCell align="right">{status.eta}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
