import React, { useState, useEffect } from "react";
import {
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import MUIDataTable from "mui-datatables";

// components
import PageTitle from "../../components/PageTitle/PageTitle";

// data
import mock from "../dashboard/mock";



const useStyles = makeStyles(theme => ({
  tableOverflow: {
    overflow: 'auto'
  }
}))

export default function Appointment() {
  const classes = useStyles();
  const [appointmentList, setAppointmentList] = useState([]);

  useEffect(() => {
    // get appointment data
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch('http://localhost:3001/getAppointmentList?patientId='+localStorage.getItem('id'), requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log("data.res: ", data.res);
        let appointmentList = [];
        data.res.map((appointment) => {
          appointmentList.push([
            appointment.appointmentDate,
            appointment.appointmentTime,
            appointment.physiotherapistsDetails[0].center,
            appointment.physiotherapistsDetails[0].displayName,
            appointment.remarks,
          ]);
        });
        setAppointmentList(appointmentList);
      });
  }, []);

  return (
    <>
      <PageTitle title="預約記錄" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            data={appointmentList}
            columns={["日期", "時間", "診所", "物理治療師", "備註"]}
            options={{
              filterType: "checkbox",
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
