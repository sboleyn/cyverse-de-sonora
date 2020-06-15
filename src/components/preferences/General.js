import React, { useState } from "react";

import Typography from "@material-ui/core/Typography";
import { Field } from "formik";

import SelectionDrawer from "../data/SelectionDrawer";
import ResourceTypes from "../models/ResourceTypes";
import GridLabelValue from "../utils/GridLabelValue";
import styles from "./styles";

import { FormTextField } from "@cyverse-de/ui-lib";

import {
    Button,
    CircularProgress,
    Divider,
    Grid,
    InputAdornment,
    Switch,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(styles);

export default function General(props) {
    const {
        defaultOutputFolder,
        onNewDefaultOutputFolder,
        isValidating,
        outputFolderValidationError,
    } = props;
    const classes = useStyles();
    const [openFileBrowser, setOpenFileBrowser] = useState(false);

    const onSwitchChange = (setFieldValue, fieldName) => (event, checked) => {
        console.log(fieldName);
        setFieldValue(fieldName, checked);
    };

    const FormSwitch = ({
        field: { value, onChange, ...field },
        form: { setFieldValue },
        ...custom
    }) => (
        <Switch
            checked={!!value}
            onChange={onSwitchChange(setFieldValue, field.name)}
            {...custom}
        />
    );

    return (
        <>
            <Typography variant="h6" className={classes.sectionHeader}>
                General
            </Typography>
            <Grid container spacing={2} className={classes.grid}>
                <GridLabelValue
                    label="Remember last file path for Apps"
                    labelVariant="body1"
                >
                    <Field
                        component={FormSwitch}
                        name="rememberLastPath"
                        color="primary"
                        inputProps={{ "aria-label": "primary checkbox" }}
                    />
                </GridLabelValue>
                <GridLabelValue
                    label="Prompt for HPC apps authentication after log-on or when apps window is opened"
                    labelVariant="body1"
                >
                    <Field
                        component={FormSwitch}
                        name="enableHPCPrompt"
                        color="primary"
                        inputProps={{ "aria-label": "another checkbox" }}
                    />
                </GridLabelValue>
                <GridLabelValue
                    label="Display Warning about wait times for submitting HPC apps"
                    labelVariant="body1"
                >
                    <Field
                        component={FormSwitch}
                        name="enableWaitTimeMessage"
                        color="primary"
                        inputProps={{ "aria-label": "another checkbox" }}
                    />
                </GridLabelValue>
            </Grid>
            <Divider className={classes.dividers} />
            <Typography variant="h6" className={classes.sectionHeader}>
                Default analysis output folder
            </Typography>
            <Grid container spacing={3} className={classes.grid}>
                <Grid item>
                    <>
                        <Field
                            component={FormTextField}
                            className={classes.textField}
                            name="defaultOutputFolder"
                            helperText={outputFolderValidationError}
                            error={outputFolderValidationError ? true : false}
                            // without this prop, there will be an exception in console
                            //about making an uncontrolled component to controlled.
                            value={
                                defaultOutputFolder ? defaultOutputFolder : ""
                            }
                            label="Path"
                            variant="outlined"
                            required={true}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    setOpenFileBrowser(true);
                                }
                            }}
                            InputProps={{
                                readOnly: true,
                                endAdornment: (
                                    <>
                                        {isValidating && (
                                            <InputAdornment position="start">
                                                <CircularProgress
                                                    color="inherit"
                                                    size={20}
                                                />
                                            </InputAdornment>
                                        )}
                                    </>
                                ),
                            }}
                        />
                        <Button
                            color="primary"
                            className={classes.actionButton}
                            onClick={() => setOpenFileBrowser(true)}
                            variant="outlined"
                            style={{ marginTop: 8, marginLeft: 8 }}
                        >
                            Browse
                        </Button>
                    </>
                </Grid>
            </Grid>
            <Divider className={classes.dividers} />
            <Typography variant="h6" className={classes.sectionHeader}>
                Email Notifications
            </Typography>
            <Grid container spacing={3} className={classes.grid}>
                <GridLabelValue
                    label="Email me when my analysis status changes"
                    labelVariant="body1"
                >
                    <Field
                        component={FormSwitch}
                        name="enableAnalysisEmailNotification"
                        color="primary"
                        inputProps={{ "aria-label": "another checkbox" }}
                    />
                </GridLabelValue>
                <GridLabelValue
                    label="Email me when my URL import status changes"
                    labelVariant="body1"
                >
                    <Field
                        component={FormSwitch}
                        name="enableImportEmailNotification"
                        color="primary"
                        inputProps={{ "aria-label": "another checkbox" }}
                    />
                </GridLabelValue>
            </Grid>
            {defaultOutputFolder && (
                <SelectionDrawer
                    open={openFileBrowser}
                    onClose={() => setOpenFileBrowser(false)}
                    startingPath={defaultOutputFolder}
                    acceptedType={ResourceTypes.FOLDER}
                    onConfirm={(selection) => {
                        setOpenFileBrowser(false);
                        onNewDefaultOutputFolder(selection);
                    }}
                    baseId="dataSelection"
                    multiSelect={false}
                />
            )}
        </>
    );
}
