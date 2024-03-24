import { styled } from "styled-components";

export const ControlRibbon = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: 1px solid black;

    & > * {
        padding: 10px;
        box-sizing: border-box;
        width: 100%;
        border-right: 1px solid grey;

        &:last-child {
            border-right: none;
        }
    }
`;