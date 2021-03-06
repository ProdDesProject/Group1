import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideNavButtons } from "../actions";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import baseApiUrl from "../api_url.json";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Typography,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  FormHelperText,
  Link,
  Card,
  Grid,
} from "@material-ui/core";
import {
  infoText,
  defaultLink,
  background,
  defaultButton,
} from "../styles/classes";
import Colors from "../styles/colors";

const useStyles = makeStyles(() => ({
  registerGrid: {
    display: "flex",
    flexDirection: "column",
    minWidth: 400,
    marginTop: 25,
    marginBottom: 50,
  },
  background: background,
  infoText: infoText,
  defaultButton: defaultButton,
  defaultLink: defaultLink,
}));

const Register = () => {
  const [errorText, setErrorText] = useState(null);
  const [registerDone, setRegisterDone] = useState(false);

  const defaultValue = {};
  const apiUrl = baseApiUrl.url;

  const classes = useStyles();
  const { register, errors, control, handleSubmit } = useForm({
    defaultValue,
    mode: "onBlur",
  });
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onSubmit = (data) => {
    setErrorText(null);
    axios.post(`${apiUrl}/register`, data, {}).then(
      (response) => {
        setRegisterDone(true);
      },
      (error) => {
        console.log(error.response.data);
        if (error.response.data.message === "E-mail already in use") {
          setErrorText(t("email_already_in_use"));
        } else if (error.response.status === 404) {
          setErrorText(t("internal_server_error"));
        }
      }
    );
  };
  const onError = (errors, e) => {
    console.log(errors);
    setErrorText(null);
    if (errors.email != null) {
      setErrorText(errors.email.message);
    }
    if (errors.email == null) {
      setErrorText(null);
    }
  };

  useEffect(() => {
    dispatch(hideNavButtons());
  }, [dispatch]);

  const RegisterDone = () => {
    return (
      <div>
        <Card className={classes.background} style={{ marginTop: 50 }}>
          <Grid
            container
            item
            xs={12}
            direction="column"
            justify="center"
            alignItems="center"
            style={{ paddingTop: 25, paddingBottom: 25 }}
          >
            <Typography variant="h5">{t("successfull_register")}</Typography>
            <Link className={classes.defaultLink} href="/login">
              {t("login_here")}
            </Link>
          </Grid>
        </Card>
      </div>
    );
  };

  return (
    <div>
      {!registerDone ? (
        <Card className={classes.background} style={{ marginTop: 50 }}>
          <Grid
            container
            item
            xs={12}
            direction="column"
            justify="center"
            alignItems="center"
            style={{ paddingTop: 25 }}
          >
            <Typography variant="h5">{t("register")}</Typography>
            <form
              className={classes.registerGrid}
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <TextField
                variant="outlined"
                margin="normal"
                inputRef={register({
                  required: { value: true, message: t("email_required") },
                  pattern: {
                    value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    message: t("email_required"),
                  },
                  minLength: { value: 2, message: t("email_required") },
                })}
                label={t("email")}
                name="email"
              />
              <Typography
                className={classes.infoText}
                variant="body1"
                style={{ display: errorText === null ? "none" : "block" }}
              >
                {errorText}
              </Typography>
              <TextField
                variant="outlined"
                margin="normal"
                inputRef={register({
                  required: true,
                  minLength: 5,
                })}
                id="password"
                type="password"
                name="password"
                label={t("password")}
              />
              {errors.password && (
                <Typography className={classes.infoText} variant="body1">
                  {t("password_required")}
                </Typography>
              )}
              <TextField
                variant="outlined"
                margin="normal"
                inputRef={register({
                  required: true,
                  minLength: 5,
                })}
                name="phonenumber"
                label={t("phonenumber")}
              />
              {errors.phonenumber && (
                <Typography className={classes.infoText} variant="body1">
                  {t("phonenumber_required")}
                </Typography>
              )}
              <TextField
                variant="outlined"
                margin="normal"
                inputRef={register({
                  required: true,
                  minLength: 2,
                })}
                name="firstname"
                label={t("firstname")}
              />
              {errors.firstname && (
                <Typography className={classes.infoText} variant="body1">
                  {t("firstname_required")}
                </Typography>
              )}
              <TextField
                variant="outlined"
                margin="normal"
                inputRef={register({
                  required: true,
                  minLength: 2,
                })}
                name="lastname"
                label={t("lastname")}
              />
              {errors.lastname && (
                <Typography className={classes.infoText} variant="body1">
                  {t("lastname_required")}
                </Typography>
              )}
              <TextField
                variant="outlined"
                margin="normal"
                inputRef={register({
                  required: true,
                  minLength: { value: 2, message: t("street_required") },
                })}
                name="address.street"
                label={t("street")}
              />
              {errors?.address?.street && (
                <Typography className={classes.infoText} variant="body1">
                  {t("street_required")}
                </Typography>
              )}
              <TextField
                variant="outlined"
                margin="normal"
                inputRef={register({
                  required: true,
                  minLength: { value: 2, message: t("city_required") },
                })}
                name="address.city"
                label={t("city")}
              />
              {errors?.address?.city && (
                <Typography className={classes.infoText} variant="body1">
                  {t("city_required")}
                </Typography>
              )}
              <TextField
                variant="outlined"
                margin="normal"
                inputRef={register({
                  required: true,
                  minLength: { value: 2, message: t("postcode_required") },
                })}
                name="address.postcode"
                label={t("postcode")}
              />
              {errors?.address?.postcode && (
                <Typography className={classes.infoText} variant="body1">
                  {t("postcode_required")}
                </Typography>
              )}
              <FormControl variant="outlined" margin="normal">
                <InputLabel id="countries-label">{t("country")}</InputLabel>
                <Controller
                  style={{ background: Colors.blue2 }}
                  as={
                    <Select>
                      <MenuItem value="Finland">{t("finland")}</MenuItem>
                      <MenuItem value="Sweden">{t("sweden")}</MenuItem>
                      <MenuItem value="Norway">{t("norway")}</MenuItem>
                      <MenuItem value="Denmark">{t("denmark")}</MenuItem>
                    </Select>
                  }
                  name="address.country"
                  rules={{ required: true }}
                  control={control}
                  defaultValue=""
                />
                {errors?.address?.country && (
                  <Typography className={classes.infoText} variant="body1">
                    {t("country_required")}
                  </Typography>
                )}
                <FormHelperText>
                  {errors?.address?.country && errors?.address?.country.message}
                </FormHelperText>
              </FormControl>

              <Button
                className={classes.defaultButton}
                type="submit"
                style={{ marginTop: 50 }}
              >
                {t("submit")}
              </Button>
              <Link className={classes.defaultLink} href="/login">
                {t("login_here")}
              </Link>
            </form>
          </Grid>
        </Card>
      ) : (
        <RegisterDone />
      )}
    </div>
  );
};
export default Register;
