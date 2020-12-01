import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { showNavButtons } from "../actions";
import { useForm, Controller } from "react-hook-form";
import baseApiUrl from "../api_url.json";
import axios from "axios";
import { withRouter } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  infoText,
  defaultButton,
  defaultLink,
  background,
} from "../styles/classes";
import Error from "./Error";
import Loading from "./Loading";
import {
  Grid,
  Divider,
  CardActions,
  CardContent,
  Container,
  Button,
  TextField,
  Typography,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  FormHelperText,
  Card,
  CardHeader,
} from "@material-ui/core";

const useStyles = makeStyles({
  defaultButton: defaultButton,
});

const ProfileInfo = ({ data, handleEdit }) => {
  const userData = data;
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <>
      <Grid
        container
        item
        xs={4}
        justify="center"
        alignItems="center"
        style={{ paddingTop: 25, paddingBottom: 25 }}
      >
        <Grid item>
          <Typography variant="body1">{t("email")}:</Typography>
          <Typography variant="body1">{t("phonenumber")}:</Typography>
          <Typography variant="body1">{t("firstname")}:</Typography>
          <Typography variant="body1">{t("lastname")}:</Typography>
          <Typography variant="body1">{t("street")}:</Typography>
          <Typography variant="body1">{t("city")}:</Typography>
          <Typography variant="body1">{t("postcode")}:</Typography>
          <Typography variant="body1">{t("Country")}:</Typography>
        </Grid>
        <Grid item style={{ marginLeft: 10 }}>
          <Typography variant="body1">{userData.email}</Typography>
          <Typography variant="body1">{userData.phonenumber}</Typography>
          <Typography variant="body1">{userData.firstname}</Typography>
          <Typography variant="body1">{userData.lastname}</Typography>
          <Typography variant="body1">{userData.address.street}</Typography>
          <Typography variant="body1">{userData.address.city}</Typography>
          <Typography variant="body1">{userData.address.postcode}</Typography>
          <Typography variant="body1">{userData.address.country}</Typography>
        </Grid>
      </Grid>
      <Grid
        container
        item
        xs={4}
        direction="column"
        alignItems="flex-end"
        style={{ paddingTop: 25, paddingRight: 10 }}
      >
        <Button onClick={handleEdit} className={classes.defaultButton}>
          {t("button_edit")}
        </Button>
      </Grid>
    </>
  );
};

export default ProfileInfo;
