/**
 * @author psarando
 */
import React from "react";

import { getIn } from "formik";
import PropTypes from "prop-types";

import { useTranslation } from "i18n";

import constants from "../../../constants";

import ids from "../ids";
import styles from "../styles";

import TableLoading from "components/utils/TableLoading";

import {
    build,
    DECheckbox,
    EnhancedTableHead,
    getSorting,
    stableSort,
} from "@cyverse-de/ui-lib";

import {
    Fab,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Toolbar,
    Typography,
    makeStyles,
} from "@material-ui/core";

import {
    Add as ContentAdd,
    Delete as ContentRemove,
    Edit as ContentEdit,
    List as ContentView,
} from "@material-ui/icons";

const useStyles = makeStyles(styles);

const MetadataGridToolbar = (props) => {
    const { parentID, editable, onAddAVU } = props;

    const { t } = useTranslation("metadata");
    const classes = useStyles();

    return (
        <Toolbar className={classes.root}>
            {editable && (
                <div className={classes.actions}>
                    <Fab
                        id={build(parentID, ids.BUTTONS.ADD)}
                        size="small"
                        color="primary"
                        aria-label={t("addMetadata")}
                        onClick={onAddAVU}
                    >
                        <ContentAdd />
                    </Fab>
                </div>
            )}
            <div className={classes.title}>
                <Typography id={build(parentID, ids.TITLE)} variant="h6">
                    {t("avus")}
                </Typography>
            </div>
        </Toolbar>
    );
};

MetadataGridToolbar.propTypes = {
    onAddAVU: PropTypes.func.isRequired,
};

const columnData = (t) => [
    {
        id: build(ids.COL_HEADER, ids.AVU_ATTR),
        key: "attr",
        name: t("attribute"),
        enableSorting: true,
    },
    {
        id: build(ids.COL_HEADER, ids.AVU_VALUE),
        key: "value",
        name: t("value"),
        enableSorting: true,
    },
    {
        id: build(ids.COL_HEADER, ids.AVU_UNIT),
        key: "unit",
        name: t("metadataUnitLabel"),
        enableSorting: true,
    },
    {
        id: build(ids.COL_HEADER, ids.AVU_AVUS),
        key: "avus",
        name: t("metadataChildrenLabel"),
        enableSorting: true,
        numeric: true,
        padding: "none",
    },
    {
        id: build(ids.COL_HEADER, ids.COL_ACTIONS),
        key: "actions",
        enableSorting: false,
        padding: "none",
    },
];

const AVURow = ({
    editable,
    selectable,
    rowID,
    selected,
    attr,
    value,
    unit,
    avuChildCount,
    onRowSelect,
    onRowEdit,
    onRowDelete,
}) => {
    const { t } = useTranslation("metadata");
    const classes = useStyles();

    return (
        <TableRow hover tabIndex={-1} selected={selected}>
            {selectable && (
                <TableCell padding="checkbox">
                    <DECheckbox checked={selected} onChange={onRowSelect} />
                </TableCell>
            )}
            <TableCell component="th" scope="row">
                {attr}
            </TableCell>
            <TableCell>{value}</TableCell>
            <TableCell>{unit}</TableCell>
            <TableCell padding="none" align="right">
                {avuChildCount}
            </TableCell>
            <TableCell padding="none">
                <Grid
                    container
                    spacing={0}
                    wrap="nowrap"
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item>
                        <IconButton
                            id={build(rowID, ids.BUTTONS.EDIT)}
                            aria-label={t("edit")}
                            className={classes.button}
                            onClick={(event) => {
                                event.stopPropagation();
                                onRowEdit();
                            }}
                        >
                            {editable ? <ContentEdit /> : <ContentView />}
                        </IconButton>
                    </Grid>
                    {editable && (
                        <Grid item>
                            <IconButton
                                id={build(rowID, ids.BUTTONS.DELETE)}
                                aria-label={t("delete")}
                                classes={{ root: classes.deleteIcon }}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onRowDelete();
                                }}
                            >
                                <ContentRemove />
                            </IconButton>
                        </Grid>
                    )}
                </Grid>
            </TableCell>
        </TableRow>
    );
};

const MetadataList = (props) => {
    const {
        parentID,
        editable,
        loading,
        selectable,
        onEditAVU,
        onSelectAVU,
        onSelectAllClick,
        avusSelected,
        rowsInPage,
        name,
        form: { values },
        remove,
        unshift,
    } = props;

    const [newAttrCount, setNewAttrCount] = React.useState(1);
    const [orderBy, setOrderBy] = React.useState(props.orderBy);
    const [order, setOrder] = React.useState(props.order || "asc");

    const { t } = useTranslation("metadata");
    const classes = useStyles();

    const onAddAVU = () => {
        const avus = getIn(values, name) || [];

        let newName,
            count = newAttrCount;

        const namesMatch = (avu) => avu.attr === newName;
        do {
            newName = t("newAttrName", {
                count,
            });
            count++;
        } while (avus.find(namesMatch));

        setNewAttrCount(count);

        unshift({
            attr: newName,
            value: "",
            unit: "",
        });
    };

    const handleRequestSort = (event, property) => {
        let newOrder = constants.SORT_ASCENDING;

        if (orderBy === property && order === newOrder) {
            newOrder = constants.SORT_DESCENDING;
        }

        setOrder(newOrder);
        setOrderBy(property);
    };

    const avus = getIn(values, name);
    const tableID = build(parentID, ids.AVU_GRID);

    // A copy of the list of AVUs, but including only each AVU's sortable fields,
    // along with a TableRow component for rendering within the returned Table below.
    // This will allow the TableRows to be sorted without altering the original AVU list,
    // which also allows each AVU's original index in the metadata model to be preserved
    // and used in the form editing functions.
    const unsortedAVURows =
        avus &&
        avus.map((avu, index) => {
            const { attr, value, unit, avus } = avu;

            const field = `${name}[${index}]`;

            const rowID = build(ids.EDIT_METADATA_FORM, field);

            const selected = avusSelected && avusSelected.includes(avu);
            const avuChildCount = avus ? avus.length : 0;

            // This returned object should include each sortable field defined by columnData above,
            // in addition to the TableRow component.
            return {
                attr,
                value,
                unit,
                // This field only requires the length of the original AVU's children, for TableRow sorting purposes.
                avus: avuChildCount,
                // Include the TableRow component that will be rendered within the final Table component.
                tableRow: (
                    <AVURow
                        key={field}
                        editable={editable}
                        selectable={selectable}
                        rowID={rowID}
                        selected={selected}
                        attr={attr}
                        value={value}
                        unit={unit}
                        avuChildCount={avuChildCount}
                        onRowSelect={(event, checked) =>
                            onSelectAVU(avu, checked)
                        }
                        onRowEdit={() => onEditAVU(index)}
                        onRowDelete={() => remove(index)}
                    />
                ),
            };
        });

    // Only sort the TableRows if sorting has been requested.
    const sortedAVURows = orderBy
        ? stableSort(unsortedAVURows, getSorting(order, orderBy))
        : unsortedAVURows;

    return (
        <div className={classes.metadataTemplateContainer}>
            <MetadataGridToolbar
                parentID={tableID}
                editable={editable}
                onAddAVU={onAddAVU}
            />

            <div className={classes.tableWrapper}>
                <Table aria-labelledby={build(tableID, ids.TITLE)}>
                    {loading ? (
                        <TableLoading
                            baseId={ids.EDIT_METADATA_FORM}
                            numColumns={5}
                            numRows={5}
                        />
                    ) : (
                        <TableBody>
                            {sortedAVURows &&
                                sortedAVURows.map((row) => row.tableRow)}
                        </TableBody>
                    )}
                    <EnhancedTableHead
                        baseId={tableID}
                        columnData={columnData(t)}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        selectable={selectable}
                        onSelectAllClick={onSelectAllClick}
                        numSelected={avusSelected ? avusSelected.length : 0}
                        rowsInPage={rowsInPage}
                    />
                </Table>
            </div>
        </div>
    );
};

export default MetadataList;
