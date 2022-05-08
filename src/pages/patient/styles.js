import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  dashedBorder: {
    borderColor: theme.palette.primary.main,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  text: {
    marginBottom: theme.spacing(2),
  },
}));
