import { inputField } from "./dom";
export function setUpKeyboard() {
    mathVirtualKeyboard.layouts = {
        rows: [
            [
                "0",
                "1",
                {
                    label: "[separator]",
                    width: 0.5,
                },
                "\\lnot",
                "\\sim",
                {
                    label: "[separator]",
                    width: 0.5,
                },
                "\\lor",
                "\\oplus",
                "\\land",
                "\\otimes",
                {
                    label: "[separator]",
                    width: 0.5,
                },
                {
                    label: "[backspace]",
                    width: 1,
                },
            ],
            [
                "[(]",
                "[)]",
                {
                    label: "[separator]",
                    width: 0.5,
                },
                "\\nabla",
                "\\Delta",
                {
                    label: "[separator]",
                    width: 0.5,
                },
                "\\xrightarrow[G]{}",
                "\\xrightarrow[L]{}",
                "\\xrightarrow[J]{}",
                "\\xrightarrow[K]{}",
                {
                    label: "[separator]",
                    width: 0.5,
                },
                {
                    label: "[hide-keyboard]",
                    width: 1,
                },
            ],
            [
                "[left]",
                "[right]",
                {
                    label: "[separator]",
                    width: 0.5,
                },
                "o",
                "\\sigma",
                {
                    label: "[separator]",
                    width: 0.5,
                },
                "\\xleftrightarrow[G]{}",
                "\\xleftrightarrow[L]{}",
                "\\xleftrightarrow[J]{}",
                "\\xleftrightarrow[K]{}",
                {
                    label: "[separator]",
                    width: 0.5,
                },
                {
                    label: "[return]",
                    width: 1,
                },
            ],
        ],
    };
    inputField.menuItems = [];
}
