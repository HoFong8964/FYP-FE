import React, { useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Fade,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// logo
import logo from "./logo.svg";
import google from "../../images/google.svg";

// context
import { useUserDispatch, loginUser, loginPhyUser } from "../../context/UserContext";

function Login(props) {
  var classes = useStyles();

  // global
  var userDispatch = useUserDispatch();

  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [activeTabId, setActiveTabId] = useState(0);
  var [loginValue, setLoginValue] = useState("");
  var [passwordValue, setPasswordValue] = useState("");
  var [phyLoginValue, setPhyLoginValue] = useState("");
  var [phyPasswordValue, setPhyPasswordValue] = useState("");

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>電子健康資訊系統</Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
          <Tabs
            value={activeTabId}
            onChange={(e, id) => setActiveTabId(id)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="一般用戶" classes={{ root: classes.tab }} />
            <Tab label="醫療用戶" classes={{ root: classes.tab }} />
          </Tabs>
          {activeTabId === 0 && (
            <React.Fragment>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  你輸入的帳號或密碼不正確
                </Typography>
              </Fade>
              <TextField
                id="login"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue}
                onChange={e => setLoginValue(e.target.value)}
                margin="normal"
                placeholder="帳號"
                type="text"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="密碼"
                type="password"
                fullWidth
              />
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Button
                    disabled={
                      loginValue.length === 0 || passwordValue.length === 0
                    }
                    onClick={() =>
                      loginUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError,
                      )
                    }
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    登入
                  </Button>
                )}
              </div>
            </React.Fragment>
          )}
          {activeTabId === 1 && (
            <React.Fragment>
            <Fade in={error}>
              <Typography color="secondary" className={classes.errorMessage}>
                你輸入的帳號或密碼不正確
              </Typography>
            </Fade>
            <TextField
              id="login"
              InputProps={{
                classes: {
                  underline: classes.textFieldUnderline,
                  input: classes.textField,
                },
              }}
              value={phyLoginValue}
              onChange={e => setPhyLoginValue(e.target.value)}
              margin="normal"
              placeholder="帳號"
              type="text"
              fullWidth
            />
            <TextField
              id="password"
              InputProps={{
                classes: {
                  underline: classes.textFieldUnderline,
                  input: classes.textField,
                },
              }}
              value={phyPasswordValue}
              onChange={e => setPhyPasswordValue(e.target.value)}
              margin="normal"
              placeholder="密碼"
              type="password"
              fullWidth
            />
            <div className={classes.formButtons}>
              {isLoading ? (
                <CircularProgress size={26} className={classes.loginLoader} />
              ) : (
                <Button
                  disabled={
                    phyLoginValue.length === 0 || phyPasswordValue.length === 0
                  }
                  onClick={() =>
                    loginPhyUser(
                      userDispatch,
                      phyLoginValue,
                      phyPasswordValue,
                      props.history,
                      setIsLoading,
                      setError,
                    )
                  }
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  登入
                </Button>
              )}
            </div>
          </React.Fragment>
          )}
        </div>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
