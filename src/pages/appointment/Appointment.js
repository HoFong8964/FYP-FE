import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Paper,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Chip
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import SearchBar from "material-ui-search-bar";
import axios from 'axios'; 

// components
import PageTitle from "../../components/PageTitle/PageTitle";


const useStyles = makeStyles(theme => ({
  tableOverflow: {
    overflow: 'auto'
  },
  formContainer: {
    width: "100%",
    height: "20%",
    display: "block",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      width: "50%",
    },
  },
  success: {
    backgroundColor: theme.palette.success.main,
    color: '#fff',
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
    color: '#fff',
  },
  secondary: {
    backgroundColor: theme.palette.secondary.main,
    color: '#fff',
  }
}))

export default function Appointment() {
  const classes = useStyles();
  const [allFeatureAppointmentList, setAllFeatureAppointmentList] = useState([]);
  const [allPastAppointmentList, setAllPastAppointmentList] = useState([]);
  const [featureAppointmentList, setFeatureAppointmentList] = useState([]);
  const [pastAppointmentList, setPastAppointmentList] = useState([]);
  const [activeTabId, setActiveTabId] = useState(0);
  const [searched, setSearched] = useState('');
  var isPhysiotherapists = false;
  const requestSearch = (searchedVal) => {
    console.log("searchedVal: ", searchedVal);
    let filteredFeatureAppointmentList = allFeatureAppointmentList.filter((row) => {
      return (
        row.displayName?.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.center?.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.remarks?.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.idNum?.toLowerCase().includes(searchedVal.toLowerCase())
      );
    });
    setFeatureAppointmentList(filteredFeatureAppointmentList);

    let filteredPastAppointmentList = allPastAppointmentList.filter((row) => {
      return (
        row.displayName?.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.center?.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.remarks?.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.idNum?.toLowerCase().includes(searchedVal.toLowerCase())
      );
    });
    setPastAppointmentList(filteredPastAppointmentList);
  };
  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  if(localStorage.getItem('type') === 'physiotherapists'){
    isPhysiotherapists = true;
  }
  const cancelBooking = (appointmentId) => {
    console.log("appointmentId: ", appointmentId);
    if (window.confirm("?????????????????????") == true) {
      var query = '?id='+appointmentId;
      axios.delete('http://localhost:3001/cancelAppointment'+query)
        .then(() => getAppointmentData());
    }
  }

  const getAppointmentData = () => {
    // get appointment data
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    var query = '';
    if(!isPhysiotherapists){
      query = '?patientId='+localStorage.getItem('id');
    }
    else{
      query = '?phyId='+localStorage.getItem('id');
    }

    fetch('http://localhost:3001/getFeatureAppointmentList'+query, requestOptions)
      .then(response => response.json())
      .then(data => {
        let featureAppointmentList = [];
        data?.res?.map((appointment) => {
          if(isPhysiotherapists){
            featureAppointmentList.push({
              appointmentId: appointment._id,
              patientId: appointment.patientId,
              appointmentDate: appointment.appointmentDate,
              appointmentTime: appointment.appointmentTime,
              idNum: appointment.patientDetails[0].idNum,
              displayName: appointment.patientDetails[0].displayName,
              dob: appointment.patientDetails[0].dob,
              sex: appointment.patientDetails[0].sex == 'Male' ? "??????" : "??????",
              remarks: appointment.remarks,
            });
          }
          else{
            featureAppointmentList.push({
              appointmentId: appointment._id,
              appointmentDate: appointment.appointmentDate,
              appointmentTime: appointment.appointmentTime,
              center: appointment.physiotherapistsDetails[0].center,
              displayName: appointment.physiotherapistsDetails[0].displayName,
              remarks: appointment.physiotherapistsDetails[0].remarks,
            });
          }
          
        });
        setAllFeatureAppointmentList(featureAppointmentList);
        setFeatureAppointmentList(featureAppointmentList);
      });

      fetch('http://localhost:3001/getPastAppointmentList'+query, requestOptions)
      .then(response => response.json())
      .then(data => {
        let pastAppointmentList = [];
        data?.res?.map((appointment) => {
          if(isPhysiotherapists){
            pastAppointmentList.push({
              patientId: appointment.patientId,
              appointmentDate: appointment.appointmentDate,
              appointmentTime: appointment.appointmentTime,
              idNum: appointment.patientDetails[0].idNum,
              displayName: appointment.patientDetails[0].displayName,
              dob: appointment.patientDetails[0].dob,
              sex: appointment.patientDetails[0].sex == 'Male' ? "??????" : "??????",
              remarks: appointment.remarks,
            });
          }
          else{
            pastAppointmentList.push({
              appointmentDate: appointment.appointmentDate,
              appointmentTime: appointment.appointmentTime,
              center: appointment.physiotherapistsDetails[0].center,
              displayName: appointment.physiotherapistsDetails[0].displayName,
              remarks: appointment.physiotherapistsDetails[0].remarks,
            });
          }
        });
        setAllPastAppointmentList(pastAppointmentList);
        setPastAppointmentList(pastAppointmentList);
      });
  };


  useEffect(() => {
    getAppointmentData();
  }, []);

  return (
    <>
      <PageTitle title="????????????" />
      <SearchBar
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
      />
      <Paper className={classes.iconsContainer}>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        value={activeTabId}
        onChange={(e, id) => setActiveTabId(id)}
        className={classes.iconsBar}
      >
        <Tab label={isPhysiotherapists ? "????????????" : "????????????"} classes={{ root: classes.tab }} />
        <Tab label="????????????" classes={{ root: classes.tab }} />
      </Tabs>
      {(activeTabId === 0 && !isPhysiotherapists) && (
        <Table className="mb-0">
          <TableHead>
            <TableRow>
              {["??????", "??????", "??????", "???????????????", "??????"].map(key => (
                <TableCell key={key}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {featureAppointmentList?.map(featureAppointment => (
              <TableRow>
                <TableCell className="pl-3 fw-normal">{featureAppointment.appointmentDate}</TableCell>
                <TableCell>{featureAppointment.appointmentTime}</TableCell>
                <TableCell>{featureAppointment.center}</TableCell>
                <TableCell>{featureAppointment.displayName}</TableCell>
                <TableCell>{featureAppointment.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {(activeTabId === 0 && isPhysiotherapists) && (
        <Table className="mb-0">
          <TableHead>
            <TableRow>
              {["??????", "??????", "???????????????", "????????????", "????????????", "??????", "??????", "??????"].map(key => (
                <TableCell key={key}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {featureAppointmentList?.map(featureAppointment => (
              <TableRow>
                <TableCell className="pl-3 fw-normal">{featureAppointment.appointmentDate}</TableCell>
                <TableCell>{featureAppointment.appointmentTime}</TableCell>
                <TableCell>{featureAppointment.idNum}</TableCell>
                <TableCell>{featureAppointment.displayName}</TableCell>
                <TableCell>{featureAppointment.dob}</TableCell>
                <TableCell>{featureAppointment.sex}</TableCell>
                <TableCell>{featureAppointment.remarks}</TableCell>
                <TableCell>
                    <Chip label={"????????????"} onClick={() => cancelBooking(featureAppointment.appointmentId)} classes={{ root: classes.warning }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {(activeTabId === 1 && !isPhysiotherapists) && (
        <Table className="mb-0">
          <TableHead>
            <TableRow>
              {["??????", "??????", "??????", "???????????????", "??????"].map(key => (
                <TableCell key={key}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pastAppointmentList?.map(featureAppointment => (
              <TableRow>
                <TableCell className="pl-3 fw-normal">{featureAppointment.appointmentDate}</TableCell>
                <TableCell>{featureAppointment.appointmentTime}</TableCell>
                <TableCell>{featureAppointment.center}</TableCell>
                <TableCell>{featureAppointment.displayName}</TableCell>
                <TableCell>{featureAppointment.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {(activeTabId === 1 && isPhysiotherapists) && (
        <Table className="mb-0">
          <TableHead>
            <TableRow>
              {["??????", "??????", "???????????????", "????????????", "????????????", "??????", "??????"].map(key => (
                <TableCell key={key}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pastAppointmentList?.map(featureAppointment => (
              <TableRow>
                <TableCell className="pl-3 fw-normal">{featureAppointment.appointmentDate}</TableCell>
                <TableCell>{featureAppointment.appointmentTime}</TableCell>
                <TableCell>{featureAppointment.idNum}</TableCell>
                <TableCell>{featureAppointment.displayName}</TableCell>
                <TableCell>{featureAppointment.dob}</TableCell>
                <TableCell>{featureAppointment.sex}</TableCell>
                <TableCell>{featureAppointment.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      </Paper>
    </>
  );
}
