/**
 * @author aramsey
 *
 * A dialog that allows users to create a data folder
 */
import React, { useState } from "react";

import {
    build,
    formatMessage,
    FormTextField,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Field, Form, Formik } from "formik";
import { injectIntl } from "react-intl";
import { useMutation } from "react-query";

import { ERROR_CODES, getErrorCode } from "../utils/error/errorCode";
import ids from "./ids";
import messages from "./messages";
import { validateDiskResourceName } from "./utils";
import { createFolder } from "../../serviceFacades/filesystem";
import isQueryLoading from "../utils/isQueryLoading";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./styles";

const useStyles = makeStyles(styles);

function CreateFolderDialog(props) {
    const { path, open, onClose, onFolderCreated, intl } = props;
    const [createFolderError, setCreateFolderError] = useState(null);
    const classes = useStyles();
    const baseId = ids.CREATE_DLG;

    const [createNewFolder, { status: createFolderStatus }] = useMutation(
        createFolder,
        {
            onSuccess: (data, { resetForm }) => {
                resetForm();
                onFolderCreated();
            },
            onError: (error) => {
                const text =
                    getErrorCode(error) === ERROR_CODES.ERR_EXISTS
                        ? formatMessage(intl, "folderExists", { path: path })
                        : formatMessage(intl, "folderCreationFail");
                setCreateFolderError(text);
            },
        }
    );

    const handleCreateFolder = ({ name }, { resetForm }) => {
        const newFolderPath = `${path}/${name}`;
        createNewFolder({ path: newFolderPath, resetForm });
    };

    const validate = ({ name }) => {
        const validationError = validateDiskResourceName(name);
        return validationError || createFolderError
            ? { name: validationError || createFolderError }
            : {};
    };

    const isLoading = isQueryLoading(createFolderStatus);

    return (
        <Formik
            initialValues={{ name: "" }}
            validate={validate}
            onSubmit={handleCreateFolder}
        >
            {({ handleSubmit, validateForm }) => {
                if (createFolderError) {
                    validateForm();
                    setCreateFolderError(null);
                }
                return (
                    <Form>
                        <Dialog
                            open={open}
                            onClose={onClose}
                            maxWidth="sm"
                            fullWidth
                        >
                            <DialogTitle>
                                {getMessage("createFolder")}
                                <IconButton
                                    aria-label={formatMessage(intl, "cancel")}
                                    onClick={onClose}
                                    size="small"
                                    edge="end"
                                    classes={{ root: classes.closeButton }}
                                >
                                    <Close />
                                </IconButton>
                            </DialogTitle>
                            <DialogContent>
                                <Typography
                                    classes={{ root: classes.bottomPadding }}
                                >
                                    {getMessage("newFolderLocation", {
                                        values: { path: path },
                                    })}
                                </Typography>
                                <Field
                                    id={build(baseId, ids.FOLDER_NAME)}
                                    name="name"
                                    multiline
                                    required={true}
                                    label={getMessage("folderName")}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            handleSubmit();
                                        }
                                    }}
                                    InputProps={{
                                        readOnly: isLoading,
                                        endAdornment: (
                                            <>
                                                {isLoading && (
                                                    <InputAdornment position="start">
                                                        <CircularProgress
                                                            id={build(
                                                                baseId,
                                                                ids.FOLDER_NAME,
                                                                ids.LOADING_SKELETON
                                                            )}
                                                            color="inherit"
                                                            size={20}
                                                        />
                                                    </InputAdornment>
                                                )}
                                            </>
                                        ),
                                    }}
                                    component={FormTextField}
                                />
                            </DialogContent>

                            <DialogActions>
                                <Button
                                    id={build(baseId, ids.CANCEL_BTN)}
                                    onClick={onClose}
                                >
                                    {getMessage("cancel")}
                                </Button>
                                <Button
                                    id={build(baseId, ids.CREATE_BTN)}
                                    color="primary"
                                    type="submit"
                                    onClick={handleSubmit}
                                >
                                    {getMessage("create")}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default withI18N(injectIntl(CreateFolderDialog), messages);
