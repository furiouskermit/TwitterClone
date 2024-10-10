import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const GlobalStyles = createGlobalStyle`
    ${reset};
    :root {
        --point: #1F60ED;
        --point-rgb: 31, 96, 237;
        --point-danger: tomato;
        --text-muted: #979797;
        --border-color: #dee2e6;
        --bd-rad: 7px;

        --mobile-px: 10px;
        --mobile-pb: calc(60px + 10px + 10px);
    }
    * {
        box-sizing: border-box;
        font-family: "Pretendard Variable" !important;
        letter-spacing: -0.2px;
        scrollbar-width: thin;
    }
    body {
        margin: 0;
        padding: 0;
        font-size: 15px;
    }
    a {
        font-size: 15px;
        color: var(--point);
    }
    button {
        outline: none;
        background-color: transparent;
        border: none;
        font-size: 15px;
        cursor: pointer;
    }
    input {
        &[type="submit"] {
            cursor: pointer;
        }
        &:focus {
            outline: none;
        }
        &:read-only {
            background-color: #f1f2f3;
        }
        &::placeholder {
            color: var(--text-muted);
        }
    }
    textarea {
        resize: none;
    }
    img {
        object-fit: cover;
    }

    /* ### CSS MODULE ### */
    .d-none {
        display: none !important;
    }
    .d-block {
        display: block !important;
    }
    .d-flex {
        display: flex !important;
    }
    .flex-column {
        flex-direction: column !important;
    }
    .justify-content-start {
        justify-content: flex-start !important;
    }
    .justify-content-center {
        justify-content: center !important;
    }
    .justify-content-end {
        justify-content: flex-end !important;
    }
    .justify-content-between {
        justify-content: space-between !important;
    }
    .justify-content-around {
        justify-content: space-around !important;
    }
    .align-items-start {
        align-items: flex-start !important;
    }
    .align-items-center {
        align-items: center !important;
    }
    .align-items-end {
        align-items: flex-end !important;
    }

    /* width & height */
    .w-100 {
        width: 100% !important;
    }
    .h-100 {
        height: 100% !important;
    }

    /* overflow */
    .overflow-y {
        overflow-y: auto !important;
    }

    /* bg */
    .bg-point {
        background-color: var(--point) !important;
        color: #fff !important;
        transition: 0.1s;
        &:hover {
            background-color: #1c53cc !important;
        }
    }
    [class *= "-lighten"] {
        transition: 0.1s;
        &:hover {
            opacity: 0.8;
        }
    }
    .bg-point-lighten {
        background-color: rgba(var(--point-rgb), 0.13) !important;
        color: var(--point) !important;
    }
    .bg-secondary-lighten {
        background-color: var(--text-muted) !important;
        color: #333 !important;
    }

    /* text */
    .text-muted {
        color: var(--text-muted) !important;
    }
    .text-danger {
        color: var(--point-danger) !important;
    }
    .fw-normal {
        font-weight: normal !important;
    }
    .fw-bold {
        font-weight: bold !important;
    }
`;