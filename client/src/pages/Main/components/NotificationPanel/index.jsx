import React from "react";
import * as SC from "./styles"


export const NotificationPanel = () => {

    return (
        <SC.ControlRibbon>
            <SC.Element>Message</SC.Element>
            <SC.Element>Friends</SC.Element>
            <SC.Element>Walks</SC.Element>
            <SC.Element>Sniff the Tail</SC.Element>
        </SC.ControlRibbon>
    )
}