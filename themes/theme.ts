import {createTheme} from "@mui/material/styles";
import {themeConstants} from "@themes/themeConstants";

import {default as dfstyle} from "@themes/themeBase.json";
const themeSet = dfstyle.global;
// 테마 세트
declare module "@mui/material/Button" {
    interface ButtonPropsVariantOverrides {}
}

declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {}
}

declare module "@mui/material/Button" {
    interface ButtonPropsSizeOverrides {
        xlarge: true;
    }
}

const mode = "light";

// Check here for more configurations https://material-ui.com/customization/default-theme/
const theme = createTheme({
    typography: {
        fontFamily: [
            "Nunito",
            "Montserrat",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
        ].join(","),
    },
    palette: {
        mode,
        ...(mode === "light"
            ? {
                  primary: {
                      main: themeSet.Primary.Main.value,
                      dark: themeSet.Primary.Dark.value,
                  },
                  secondary: themeConstants.secondary,
                  background: {
                      default: "#f0f1f5",
                      paper: themeConstants.paper,
                  },
                  //   text: {
                  //       primary: themeConstants.fg.main,
                  //       secondary: themeConstants.fg.dark,
                  //   },
                  error: themeConstants.error,
              }
            : {
                  primary: {
                      main: themeSet.Primary.Main.value,
                      dark: themeSet.Primary.Dark.value,
                  },
                  secondary: themeConstants.secondary,
                  background: {
                      default: "#f0f1f5",
                      paper: themeConstants.paper,
                  },
                  text: {
                      primary: themeConstants.fg.main,
                      secondary: themeConstants.fg.dark,
                  },
                  error: themeConstants.error,
              }),
    },
    breakpoints: {
        values: themeConstants.breakpoints,
    },
    components: {
        MuiInputBase: {
            styleOverrides: {
                input: {
                    height: "1.0556em",
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    padding: "0 24px",
                    maxWidth: "600px !important",
                },
            },
        },
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    transition: "none !important",
                    backgroundColor: "rgba(173, 175, 184, 0.8)",
                },
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    margin: "0",
                    "&.Mui-expanded": {
                        margin: "0 !important",
                    },
                },
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    minHeight: "64px !important",
                    "& .Mui-expanded": {
                        margin: "0 !important",
                    },
                },
                content: {
                    margin: "auto",
                },
                gutters: {
                    margin: "auto",
                },
                contentGutters: {
                    margin: "auto",
                },
                expanded: {},
            },
        },
        MuiButton: {
            styleOverrides: {
                sizeSmall: {
                    lineHeight: 1,
                },
                sizeLarge: {
                    // lineHeight: "",
                    // textDecoration: "",
                },
            },
            variants: [
                {
                    props: {size: "xlarge"},
                    style: {
                        fontSize: "20px",
                    },
                },
            ],
        },
    },
});

export {theme};
