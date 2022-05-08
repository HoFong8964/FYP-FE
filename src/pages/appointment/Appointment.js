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

  useEffect(() => {
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
              patientId: appointment.patientId,
              appointmentDate: appointment.appointmentDate,
              appointmentTime: appointment.appointmentTime,
              idNum: appointment.patientDetails[0].idNum,
              displayName: appointment.patientDetails[0].displayName,
              dob: appointment.patientDetails[0].dob,
              sex: appointment.patientDetails[0].sex == 'Male' ? "男性" : "女性",
              remarks: appointment.remarks,
            });
          }
          else{
            featureAppointmentList.push({
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
              sex: appointment.patientDetails[0].sex == 'Male' ? "男性" : "女性",
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

  }, []);

  return (
    <>
      <PageTitle title="預約記錄" />
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
        <Tab label={isPhysiotherapists ? "預約列表" : "我的預約"} classes={{ root: classes.tab }} />
        <Tab label="過去預約" classes={{ root: classes.tab }} />
      </Tabs>
      {(activeTabId === 0 && !isPhysiotherapists) && (
        <Table className="mb-0">
          <TableHead>
            <TableRow>
              {["日期", "時間", "診所", "物理治療師", "備註"].map(key => (
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
              {["日期", "時間", "身分證號碼", "患者姓名", "出生日期", "性別", "備註", "查看"].map(key => (
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
                    <Chip label={"患者資料"} onClick={() => {window.location = `/#/app/patient/${featureAppointment.patientId}`}} classes={{ root: classes.success }} />
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
              {["日期", "時間", "診所", "物理治療師", "備註"].map(key => (
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
              {["日期", "時間", "身分證號碼", "患者姓名", "出生日期", "性別", "備註", "查看"].map(key => (
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
                <TableCell><a href={`/#/app/patient/${featureAppointment.id}`}>{featureAppointment.displayName}</a></TableCell>
                <TableCell>{featureAppointment.dob}</TableCell>
                <TableCell>{featureAppointment.sex}</TableCell>
                <TableCell>{featureAppointment.remarks}</TableCell>
                <TableCell>
                    <Chip label={"患者資料"} onClick={() => {window.location = `/#/app/patient/${featureAppointment.patientId}`}} classes={{ root: classes.success }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      </Paper>
    </>
  );
}
