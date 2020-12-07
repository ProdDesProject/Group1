import React, { useState } from 'react';
import { Grid, Typography, Button, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { defaultButton, infoText } from '../styles/classes';

const useStyles = makeStyles({
    defaultButton: defaultButton,
    infoText: infoText
});

const CarInfo = ({ data, text, handleEditButton }) => {
    const [infoText] = useState(text);
    const carData = data;
    const { t } = useTranslation();
    const classes = useStyles();
    return (
        <>

            <Grid container item xs={4} justify="center" alignItems="center" style={{ paddingTop: 25, paddingBottom: 25 }} >
                <Grid item>
                    <Typography variant="body1">{t('car_brand')}:</Typography>
                    <Typography variant="body1">{t('car_model')}:</Typography>
                    <Typography variant="body1">{t('car_yearmodel')}:</Typography>
                    <Typography variant="body1">{t('car_powertype')}:</Typography>
                    <Typography variant="body1">{t('car_enginesize')}:</Typography>
                    <Typography variant="body1">{t('car_license')}:</Typography>
                </Grid>
                <Grid item style={{ marginLeft: 10 }}>
                    <Typography variant="body1">{carData.brand}</Typography>
                    <Typography variant="body1">{carData.model}</Typography>
                    <Typography variant="body1">{carData.yearModel}</Typography>
                    <Typography variant="body1">{carData.powerType}</Typography>
                    <Typography variant="body1">{carData.engineSize}</Typography>
                    <Typography variant="body1">{carData.licenseNumber}</Typography>
                </Grid>
            </Grid>
            <Grid container item xs={4} direction="column" alignItems="flex-end" style={{ paddingTop: 25, paddingRight: 10 }} >
                <Button onClick={handleEditButton} className={classes.defaultButton}>
                    {t('button_edit')}
                </Button>
                <Typography className={classes.infoText} variant="body1">
                    {infoText}
                </Typography>
            </Grid>

        </>
    )
}

export default CarInfo;