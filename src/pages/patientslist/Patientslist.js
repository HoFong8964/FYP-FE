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

export default function Patientslist() {
  const classes = useStyles();
  const [allPatientsList, setAllPatientsList] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [searched, setSearched] = useState('');
  var isPhysiotherapists = false;
  const requestSearch = (searchedVal) => {
    let filteredPatientsList = allPatientsList.filter((row) => {
      return (
        row.serviceId?.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.center?.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.displayName?.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.address?.toLowerCase().includes(searchedVal.toLowerCase())
      );
    });
    setPatientsList(filteredPatientsList);
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
    if(isPhysiotherapists){
      query = '?phyId='+localStorage.getItem('id');
    }

    fetch('http://localhost:3001/getMyPatients'+query, requestOptions)
      .then(response => response.json())
      .then(data => {
        setAllPatientsList(data?.res);
        setPatientsList(data?.res);
      });

  }, []);

  return (
    <>
      <PageTitle title="我的患者" />
      <SearchBar
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
      />
      <Paper className={classes.iconsContainer}>
        <Table className="mb-0">
          <TableHead>
            <TableRow>
              {["身分證號碼", "患者姓名", "出生日期", "電話號碼",  "性別", "查看"].map(key => (
                <TableCell key={key}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {patientsList?.map(patient => (
              <TableRow>
                <TableCell className="pl-3 fw-normal">{patient.idNum}</TableCell>
                <TableCell>{patient.displayName}</TableCell>
                <TableCell>{patient.dob}</TableCell>
                <TableCell>{patient.phoneNum}</TableCell>
                <TableCell>{patient.sex == 'Male' ? "男性" : "女性"}</TableCell>
                <TableCell>
                  <Chip label={"詳細資料"} onClick={() => {window.location = `/#/app/patient/${patient.id}`}} classes={{ root: classes.success }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}
