import React from "react";
import * as SC from "./styles"

export const Header = ({children, ...rest}) => (
    <SC.Header>
        <h1>TailTales</h1>
        {children}
    </SC.Header>)