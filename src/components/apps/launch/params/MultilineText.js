/**
 * Form field for displaying MultilineText parameters.
 *
 * @author psarando
 */
import React from "react";

import { FormMultilineTextField } from "@cyverse-de/ui-lib";

export default function MultilineText({ param, ...props }) {
    return (
        <FormMultilineTextField
            margin="normal"
            size="small"
            label={param?.label}
            helperText={param?.description}
            required={param?.required}
            {...props}
        />
    );
}
