import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#fb1d5c'
    }
  },
  typography: {
    fontFamily: ['Nunito Sans', 'Helvetica', 'Arial', 'sans-serif']
  },
  overrides: {
    RaMenuItemLink: {
        root: {
            borderLeft: '3px solid #fff',
        },
        active: {
            borderLeft: '3px solid #fb1d5c',
        },
    },
    MuiAppBar: {
      colorSecondary: {
          backgroundColor: '#fb1d5c',
      },
    }
  }
});
