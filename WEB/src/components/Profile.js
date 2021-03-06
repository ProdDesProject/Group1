import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { showNavButtons } from "../actions";
import { useForm } from "react-hook-form";
import baseApiUrl from "../api_url.json";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import {
  infoText,
  defaultButton,
  defaultLink,
  background,
} from "../styles/classes";
import Error from "./Error";
import Loading from "./Loading";
import ProfileInfo from "../components/ProfileInfo";
import ProfileEdit from "../components/ProfileEdit";
import {
  Grid,
  Button,
  TextField,
  Typography,
  Card,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "fit-content", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    alignItems: "center",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  profileGrid: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 700,
    minWidth: 300,

    marginTop: 50,
    margin: "auto",
  },
  background: background,
  defaultLink: defaultLink,
  defaultButton: defaultButton,
  infoText: infoText,
}));

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [serverError, setServerError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [infoText, setInfoText] = useState(null);
  const [errorText, setErrorText] = useState(null);
  const [openDeleteDialog, setDeleteDialogOpen] = useState(false);
  const [openPasswordDialog, setDialogPasswordOpen] = useState(false);
  const history = useHistory();


  const apiUrl = baseApiUrl.url;
  const apiToken = useSelector((state) => state.tokenReducer);
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { register, errors, getValues, handleSubmit, reset } = useForm({
    defaultValues: 
      { 
        passwordConfirmation: "",
        passwordOld:"",
        password:""
      },
    mode: "onBlur",
  });

  const { register: register2, handleSubmit: handleSubmit2 } = useForm({
    mode: "onBlur",
  });
  let newPasswordData = null;

  const onSubmit = (data) => {
    checkLoginPassword(data.passwordOld);
    newPasswordData = data.password;
    changePassword();
  };

  const onSubmitCheckPassword = (data) => {
    checkLoginDelete(data.passwordDelete);
    newPasswordData = data.password;
  };
  useEffect(() => {
    dispatch(showNavButtons());
  }, [dispatch]);

  const changePassword = () => {
    axios
      .put(
        `${apiUrl}/user/password`,
        { password: newPasswordData },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      )
      .then((response) => {
        if (response.data.message === "No results with given id") {
          setServerError(true);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {

            setErrorText(t("internal_server_error"));
      });
  };

  const deleteUser = () => {
    axios
      .delete(`${apiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      })
      .then((response) => {
        if (response.data.message === "No results with given id") {
          setServerError(true);
          setLoading(false);
        } else {
          history.push("/login");
          setLoading(false);
        }
      })
      .catch((error) => {
        if (error.response === undefined) {
          setInfoText(t("internal_server_error"));
        } else {
          if (error.response.data === "Unauthorized") {
            setInfoText(t("incorrect_login"));
          } else {
            setInfoText(t("internal_server_error"));
          }
        }
      });
  };

  const onInit = () => getUserInfo();

  const getUserInfo = () => {
    axios
      .get(`${apiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      })
      .then((response) => {
        if (response.data.message === "No results with given id") {
          setServerError(true);
          setLoading(false);
        } else {
          setUserData(response.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setServerError(true);
        setLoading(false);
      });
  };

  const checkLoginPassword = (data) => {
    axios
      .post(`${apiUrl}/login`, null, {
        auth: {
          username: userData.email,
          password: data,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          changePassword();
          setDialogPasswordOpen(true);
        }
      })
      .catch((error) => {
        if (error.response === undefined) {
          setServerError(true);
          setLoading(false);
          setDeleteDialogOpen(false);
        } else {
          if (error.response.data === "Unauthorized") {
            setErrorText(t("wrong_password"));
          } else {
            setErrorText(t("internal_server_error"));
          }
        }
      });
  };

  const checkLoginDelete = (data) => {
    axios
      .post(`${apiUrl}/login`, null, {
        auth: {
          username: userData.email,
          password: data,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          deleteUser();
        }
      })
      .catch((error) => {
        if (error.response === undefined) {
          setServerError(true);
          setLoading(false);
          setDeleteDialogOpen(false);
        } else {
          if (error.response.data === "Unauthorized") {
            setInfoText(t("incorrect_login"));
          } else {
            setInfoText(t("internal_server_error"));
          }
        }
      });
  };

  useEffect(onInit, []);

  const handleOnCloseDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleOnOpenDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleOnClosePassword = () => {
    setDialogPasswordOpen(false);
    setErrorText(null);
    reset();
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = (status) => {
    if (status === "submit") {
      getUserInfo();
    } else {
      setInfoText(null);
    }

    setEditMode(false);
  };

  if (serverError) {
    return <Error />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <Card className={classes.background} style={{ marginTop: 50 }}>
        <Grid container>
          <Grid
            container
            item
            xs={4}
            direction="row"
            alignItems="flex-end"
            style={{ paddingTop: 25 }}
          ></Grid>
          {!editMode ? (
            <ProfileInfo data={userData} handleEdit={handleEdit} />
          ) : (
            <ProfileEdit data={userData} handleSave={handleSave} />
          )}
        </Grid>
      </Card>
      <Card className={classes.background} style={{ marginTop: 5 }}>
        <Grid
          container
          item
          xs={12}
          direction="column"
          justify="center"
          alignItems="center"
          style={{ paddingTop: 5, paddingBottom: 5 }}
        >
          <Grid item xs={12}>
            <Typography
              justify="center"
              className={classes.background}
              style={{ marginTop: 5 }}
              variant="h5"
            >
              {t("change_password")}
            </Typography>
          </Grid>
          <Grid container item xs={6} direction="column" alignItems="center">
            <TextField
              style={{ marginTop: 25 }}
              variant="outlined"
              inputRef={register({
                required: true,
                minLength: 5,
              })}
              id="password"
              type="password"
              name="passwordOld"
              label={t("enter_old_password")}
            />
            <TextField
              style={{ marginTop: 5 }}
              variant="outlined"
              inputRef={register({
                required: true,
                minLength: 5,
              })}
              id="password"
              type="password"
              name="password"
              label={t("enter_new_password")}
            />
            <TextField
              style={{ marginTop: 5 }}
              variant="outlined"
              inputRef={register({
                required: true,
                minLength: 5,
                validate: {
                  matchesPreviousPassword: (value) => {
                    const { password } = getValues();
                    return password === value || "Passwords should match!";
                  },
                },
              })}
              id="password"
              type="password"
              name="passwordConfirmation"
              label={t("confirm_password")}
            />
            {errors.passwordConfirmation && (
              <Typography className={classes.infoText} variant="body1">
                {t("passwords_dont_match")}
              </Typography>
              
            )}
            <Typography className={classes.infoText} variant="body1">
              {errorText}
            </Typography>

            <Button
              justify="center"
              className={classes.defaultButton}
              onClick={handleSubmit(onSubmit)}
              style={{ marginTop: 5 }}
            >
              {t("submit")}
            </Button>
            <Dialog open={openPasswordDialog} onClose={handleOnClosePassword}>
              <DialogTitle>{t("changed_password")}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {t("password_change_successfull")}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleOnClosePassword}
                  className={classes.defaultButton}
                  autoFocus
                >
                  {"Ok"}
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </Card>
      <Card className={classes.background} style={{ marginTop: 5 }}>
        <Grid
          container
          item
          xs={12}
          direction="column"
          justify="center"
          alignItems="center"
          style={{ paddingTop: 5, paddingBottom: 5 }}
        >
          <Grid item xs={6}>
            <Typography
              justify="center"
              className={classes.background}
              style={{ marginTop: 5 }}
              variant="h5"
            >
              {t("delete_user_account")}
            </Typography>
          </Grid>
          <Grid container item xs={6} direction="column" alignItems="center">
            <Button
              justify="center"
              className={classes.defaultButton}
              onClick={handleOnOpenDelete}
              style={{ marginTop: 25 }}
            >
              {t("delete_user_account")}
            </Button>
            <Dialog open={openDeleteDialog} onClose={handleOnCloseDelete}>
              <DialogTitle>{t("delete_user_account")}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {t("type_password_to_delete_user")}
                </DialogContentText>
                <TextField
                  variant="outlined"
                  inputRef={register2({
                    required: true,
                    minLength: 5,
                  })}
                  id="passwordDelete"
                  type="password"
                  name="passwordDelete"
                  label={t("password")}
                />
                <Typography className={classes.infoText} variant="body1">
                  {infoText}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  className={classes.defaultButton}
                  onClick={handleSubmit2(onSubmitCheckPassword)}
                >
                  {t("delete_user_account")}
                </Button>
                <Button
                  className={classes.defaultButton}
                  onClick={handleOnCloseDelete}
                  autoFocus
                >
                  {t("cancel")}
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};
export default Profile;
