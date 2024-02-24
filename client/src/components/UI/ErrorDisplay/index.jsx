import React from "react";

export const ErrorDisplay = ({error}) => {
    return error ? <div>{error}</div> : null
}