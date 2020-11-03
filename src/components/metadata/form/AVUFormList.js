/**
 * @author psarando
 */
import React from "react";

import { FastField, FieldArray, getIn } from "formik";
import PropTypes from "prop-types";

import { useTranslation } from "i18n";

import ids from "../ids";
import styles from "../styles";

import MetadataList from "../listing";
import SlideUpTransition from "../SlideUpTransition";

import { build, FormTextField, getFormError } from "@cyverse-de/ui-lib";

import {
    AppBar,
    Dialog,
    DialogContent,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
    makeStyles,
} from "@material-ui/core";

import ArrowBack from "@material-ui/icons/ArrowBack";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles(styles);

const AVUFormDialog = (props) => {
    const {
        avu,
        open,
        closeAttrDialog,
        editable,
        targetName,
        field,
        touched,
        errors,
    } = props;

    const { attr, avus } = avu;

    const [editingAttrIndex, setEditingAttrIndex] = React.useState(-1);

    const { t } = useTranslation("metadata");
    const classes = useStyles();

    const avuErrors = getFormError(field, touched, errors);
    const error = avuErrors && avuErrors.error;

    const formID = build(ids.EDIT_METADATA_FORM, field, ids.DIALOG);
    const dialogTitleID = build(formID, ids.TITLE);

    const title = t(
        editable ? "dialogTitleEditMetadataFor" : "dialogTitleViewMetadataFor",
        { targetName }
    );

    const hasChildren = avus && avus.length > 0;

    return (
        <Dialog
            open={open}
            onClose={closeAttrDialog}
            fullWidth={true}
            maxWidth="md"
            disableBackdropClick
            disableEscapeKeyDown
            aria-labelledby={dialogTitleID}
            TransitionComponent={SlideUpTransition}
        >
            <AppBar className={classes.appBar}>
                <Tooltip
                    title={error ? t("errAVUEditFormTooltip") : ""}
                    placement="bottom-start"
                    enterDelay={200}
                >
                    <Toolbar>
                        <IconButton
                            id={build(formID, ids.BUTTONS.CLOSE)}
                            color="inherit"
                            aria-label={t("close")}
                            disabled={!!error}
                            onClick={closeAttrDialog}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Typography
                            id={dialogTitleID}
                            variant="h6"
                            color="inherit"
                            className={classes.flex}
                        >
                            {title}
                        </Typography>
                    </Toolbar>
                </Tooltip>
            </AppBar>
            <DialogContent>
                <FastField
                    name={`${field}.attr`}
                    label={t("attribute")}
                    id={build(formID, ids.AVU_ATTR)}
                    required={editable}
                    InputProps={{ readOnly: !editable }}
                    component={FormTextField}
                />
                <FastField
                    name={`${field}.value`}
                    label={t("value")}
                    id={build(formID, ids.AVU_VALUE)}
                    InputProps={{ readOnly: !editable }}
                    component={FormTextField}
                />
                <FastField
                    name={`${field}.unit`}
                    label={t("metadataUnitLabel")}
                    id={build(formID, ids.AVU_UNIT)}
                    InputProps={{ readOnly: !editable }}
                    component={FormTextField}
                />

                {(editable || hasChildren) && (
                    <>
                        <Divider />

                        <Accordion defaultExpanded={hasChildren}>
                            <AccordionSummary
                                expandIcon={
                                    <ExpandMoreIcon
                                        id={build(
                                            formID,
                                            ids.BUTTONS.EXPAND,
                                            ids.AVU_GRID
                                        )}
                                    />
                                }
                            >
                                <Typography variant="subtitle1">
                                    {t("metadataChildrenLabel")}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                className={classes.childAVUsContainer}
                            >
                                <FieldArray
                                    name={`${field}.avus`}
                                    render={(arrayHelpers) => (
                                        <MetadataList
                                            {...arrayHelpers}
                                            editable={editable}
                                            parentID={formID}
                                            onEditAVU={(index) =>
                                                setEditingAttrIndex(index)
                                            }
                                        />
                                    )}
                                />
                            </AccordionDetails>
                        </Accordion>

                        <FieldArray
                            name={`${field}.avus`}
                            render={(arrayHelpers) => (
                                <AVUFormList
                                    {...arrayHelpers}
                                    editingAttrIndex={editingAttrIndex}
                                    editable={editable}
                                    targetName={attr}
                                    closeAttrDialog={() =>
                                        setEditingAttrIndex(-1)
                                    }
                                />
                            )}
                        />
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

AVUFormDialog.propTypes = {
    targetName: PropTypes.string,
    closeAttrDialog: PropTypes.func.isRequired,
    avu: PropTypes.shape({
        attr: PropTypes.string.isRequired,
    }).isRequired,
};

const AVUFormList = ({
    editingAttrIndex,
    editable,
    targetName,
    closeAttrDialog,
    name,
    form: { touched, errors, values },
}) => {
    const avus = getIn(values, name);

    return (
        <>
            {avus &&
                avus.map((avu, index) => {
                    const field = `${name}[${index}]`;

                    return (
                        <AVUFormDialog
                            key={field}
                            field={field}
                            touched={touched}
                            errors={errors}
                            avu={avu}
                            open={editingAttrIndex === index}
                            editable={editable}
                            targetName={targetName}
                            closeAttrDialog={closeAttrDialog}
                        />
                    );
                })}
        </>
    );
};

export default AVUFormList;
