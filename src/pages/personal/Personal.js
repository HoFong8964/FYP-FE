import React, { useState, useEffect } from "react";
import { 
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Grid
 } from "@material-ui/core";

// styles
import useStyles from "./styles";

// components
import PageTitle from "../../components/PageTitle/PageTitle";
import Widget from "../../components/Widget/Widget";
import { Typography } from "../../components/Wrappers/Wrappers";

export default function PersonalPage() {
  var classes = useStyles();
  const [infomation, setInfomation] = useState([]);

  useEffect(() => {
    // get patient data
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    fetch('http://localhost:3001/getPatient?patientId='+localStorage.getItem('id'), requestOptions)
      .then(response => response.json())
      .then(data => {
        setInfomation(data.res[0]);
      });

  }, []);

  return (
    <>
      <PageTitle title="個人資料" />
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Widget title="個人資料" disableWidgetMenu>
            <div className={classes.dashedBorder}>
              <Typography variant="h5" color="primary" className={classes.text}>
                姓名 :
              </Typography>
              <Typography className={classes.text}>
                {infomation.displayName}
              </Typography>
              <Typography variant="h5" color="primary" className={classes.text}>
                電話號碼 :
              </Typography>
              <Typography className={classes.text}>
                {infomation.phoneNum}
              </Typography>
              <Typography variant="h5" color="primary" className={classes.text}>
                身分證號碼 :
              </Typography>
              <Typography className={classes.text}>
                {infomation.idNum}
              </Typography>
              <Typography variant="h5" color="primary" className={classes.text}>
                性別 :
              </Typography>
              <Typography className={classes.text}>
                {infomation.sex == 'Male' ? "男性" : "女性"}
              </Typography>
              <Typography variant="h5" color="primary" className={classes.text}>
                出生日期 :
              </Typography>
              <Typography className={classes.text}>
                {infomation.dob}
              </Typography>
            </div>
          </Widget>
        </Grid>
        <Grid item xs={12} md={6}>
          <Widget title="病歷記錄" disableWidgetMenu>
            <div className={classes.dashedBorder}>
              {infomation.medicalHistoryList?.map(record => (
                <React.Fragment>
                  <Typography variant="h5" color="secondary" className={classes.text}>
                    {record.date}
                  </Typography>
                  <Typography className={classes.text}>
                    {record.description}
                  </Typography>
                </React.Fragment>
              ))}
            </div>
          </Widget>
        </Grid>
        <Grid item xs={12} md={12}>
          <Widget title="訓練記錄" disableWidgetMenu>
            <Table className="mb-0">
              <TableHead>
                <TableRow>
                  {["訓練時間", "類型", "目標", "統計", "完成目標時間 (秒)", "總訓練時間 (秒)"].map(key => (
                    <TableCell key={key}>{key}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {infomation.workoutHistoryList?.map(workoutHistory => (
                  <TableRow>
                    <TableCell className="pl-3 fw-normal">{workoutHistory.startTime}</TableCell>
                    <TableCell>{workoutHistory.type}</TableCell>
                    <TableCell>{workoutHistory.target}</TableCell>
                    <TableCell>{workoutHistory.count}</TableCell>
                    <TableCell>{workoutHistory.targetTimeSpent}</TableCell>
                    <TableCell>{workoutHistory.endTimeSpent}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Widget>
        </Grid>
      </Grid>
    </>
  );
}
