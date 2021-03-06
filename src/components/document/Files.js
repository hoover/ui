import React, { memo, useState } from 'react'
import Link from 'next/link'
import { Box, Table, TableBody, TableCell, TableRow } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useDocument } from './DocumentProvider'
import Loading from '../Loading'
import { humanFileSize } from '../../utils'
import { reactIcons } from '../../constants/icons'
import { createDownloadUrl, doc as docAPI } from '../../backend/api'

const useStyles = makeStyles(theme => ({
    box: {
        overflowX: 'auto',
    },
    cell: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    link: {
        color: theme.palette.grey[600],
    },
    more: {
        padding: theme.spacing(1),
        borderBottom: 'none',
    },
}))

function Files() {
    const classes = useStyles()
    const { data, collectionBaseUrl, docRawUrl, pathname, fullPage } = useDocument()

    const [files, setFiles] = useState(data.children)
    const [currentPage, setCurrentPage] = useState(data.children_page)
    const [currentHasNextPage, setCurrentHasNextPage] = useState(data.children_has_next_page)
    const [isFetchingChildrenPage, setFetchingChildrenPage] = useState(false)

    const loadMore = async event => {
        event.preventDefault()
        setFetchingChildrenPage(true)
        const nextDoc = await docAPI(pathname, currentPage + 1)
        setCurrentPage(nextDoc.children_page)
        setCurrentHasNextPage(nextDoc.children_has_next_page)
        setFiles([...files, ...nextDoc.children])
        setFetchingChildrenPage(false)
    }

    const filesRows = files.map(({ id, digest, file, filename, content_type, filetype, size }, index) => (
        <TableRow key={index}>
            <TableCell className={classes.cell}>
                {id ? (
                    <Link href={`${collectionBaseUrl}/${file || id}`}>
                        <a>
                            {filename}
                        </a>
                    </Link>
                ) : (
                    <span>{filename}</span>
                )}
            </TableCell>
            <TableCell className={classes.cell}>
                {digest && (
                    <a
                        href={createDownloadUrl(`${collectionBaseUrl}/${digest}`, filename)}
                        target={fullPage ? null : '_blank'}
                        title="Original file"
                        className={classes.link}
                    >
                        {reactIcons.download}
                    </a>
                )}
            </TableCell>
            <TableCell className={classes.cell}>{content_type}</TableCell>
            <TableCell className={classes.cell}>{!!size && humanFileSize(size)}</TableCell>
        </TableRow>
    ))

    return (
        <Box className={classes.box}>
            <Table>
                <TableBody>
                    {filesRows}
                    {currentHasNextPage && (
                        <TableRow>
                            <TableCell colSpan={4} className={classes.more}>
                                {isFetchingChildrenPage ?
                                    <Loading/>
                                    :
                                    <a href="#" onClick={loadMore}>load more...</a>
                                }
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Box>
    )
}

export default memo(Files)
