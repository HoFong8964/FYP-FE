import React, { useState, useEffect } from "react";
import {
  Grid,
  Tabs,
  Tab,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import MUIDataTable from "mui-datatables";

// components
import PageTitle from "../../components/PageTitle/PageTitle";


const useStyles = makeStyles(theme => ({
  tableOverflow: {
    overflow: 'auto'
  }
}))

export default function Appointment() {
  const classes = useStyles();
  const [featureAppointmentList, setFeatureAppointmentList] = useState([]);
  const [pastAppointmentList, setPastAppointmentList] = useState([]);
  const [activeTabId, setActiveTabId] = useState(0);
  var isPhysiotherapists = false;
  if(localStorage.getItem("type") === 'physiotherapists'){
    isPhysiotherapists = true;
  }

  useEffect(() => {
    // get appointment data
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    var query = '';
    var columns;
    if(!isPhysiotherapists){
      query = '?patientId='+localStorage.getItem('id');
      columns = ["日期", "時間", "診所", "物理治療師", "備註"];
    }
    else{
      query = '?phyId='+localStorage.getItem('id');
      columns = ["日期", "時間", "身分證號碼", "患者姓名", "出生日期", "性別", "備註"];
    }

    fetch('http://localhost:3001/getFeatureAppointmentList'+query, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log("data: ", data);
        let featureAppointmentList = [];
        data?.res?.map((appointment) => {
          if(isPhysiotherapists){
            featureAppointmentList.push([
              appointment.appointmentDate,
              appointment.appointmentTime,
              appointment.patientDetails[0].idNum,
              appointment.patientDetails[0].displayName,
              appointment.patientDetails[0].dob,
              appointment.patientDetails[0].sex == 'Male' ? "男性" : "女性",
              appointment.remarks,
            ]);
          }
          else{
            featureAppointmentList.push([
              appointment.appointmentDate,
              appointment.appointmentTime,
              appointment.physiotherapistsDetails[0].center,
              appointment.physiotherapistsDetails[0].displayName,
              appointment.remarks,
            ]);
          }
          
        });
        setFeatureAppointmentList(featureAppointmentList);
      });

      fetch('http://localhost:3001/getPastAppointmentList'+query, requestOptions)
      .then(response => response.json())
      .then(data => {
        let pastAppointmentList = [];
        data?.res?.map((appointment) => {
          if(isPhysiotherapists){
            featureAppointmentList.push([
              appointment.appointmentDate,
              appointment.appointmentTime,
              appointment.patientDetails[0].idNum,
              appointment.patientDetails[0].displayName,
              appointment.patientDetails[0].dob,
              appointment.patientDetails[0].sex == 'Male' ? "男性" : "女性",
              appointment.remarks,
            ]);
          }
          else{
            featureAppointmentList.push([
              appointment.appointmentDate,
              appointment.appointmentTime,
              appointment.physiotherapistsDetails[0].center,
              appointment.physiotherapistsDetails[0].displayName,
              appointment.remarks,
            ]);
          }
        });
        setPastAppointmentList(pastAppointmentList);
      });

  }, []);

  return (
    <>
      <PageTitle title="預約記錄" />
      <Paper className={classes.iconsContainer}>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        value={activeTabId}
        onChange={(e, id) => setActiveTabId(id)}
        className={classes.iconsBar}
      >
        <Tab label={isPhysiotherapists ? "預約列表" : "我的預約"} classes={{ root: classes.tab }} />
        <Tab label="過去預約" classes={{ root: classes.tab }} />
      </Tabs>
      {activeTabId === 0 && (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <MUIDataTable
              data={featureAppointmentList}
              columns={
                !isPhysiotherapists ? 
                ["日期", "時間", "診所", "物理治療師", "備註"]
                :
                ["日期", "時間", "身分證號碼", "患者姓名", "出生日期", "性別", "備註"]
              }
              options={{
                filterType: "checkbox",
              }}
            />
          </Grid>
        </Grid>
      )}
      {activeTabId === 1 && (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <MUIDataTable
              data={pastAppointmentList}
              columns={
                !isPhysiotherapists ? 
                ["日期", "時間", "診所", "物理治療師", "備註"]
                :
                ["日期", "時間", "身分證號碼", "患者姓名", "出生日期", "性別", "備註"]
              }
              options={{
                filterType: "checkbox",
              }}
            />
          </Grid>
        </Grid>
      )}
      </Paper>
    </>
  );
}
