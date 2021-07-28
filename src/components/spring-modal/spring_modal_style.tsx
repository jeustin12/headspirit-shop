import styled from "styled-components";
import { themeGet } from "@styled-system/theme-get";

const CloseButton = styled.button`
    &:hover {
        color: ${themeGet("colors.red", "#ea4d4a")};
    }

    @media (max-width: 767px) {
        position: absolute;
        top: -60px;
        background-color: ${themeGet("colors.white", "#ffffff")};
        width: 70%;
        height: 50px;
        border-radius: 48px;
        color: rgba(0, 0, 0, 0.5);
    }
`;

export { CloseButton };
