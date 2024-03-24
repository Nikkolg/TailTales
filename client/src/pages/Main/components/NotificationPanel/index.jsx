import React from "react";
import * as SC from "./styles"

export const NotificationPanel = ({children}) => {

    return (
        <SC.ControlRibbon>
            {children}
        </SC.ControlRibbon>
    )
}