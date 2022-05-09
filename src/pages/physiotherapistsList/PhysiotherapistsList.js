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

export default function PhysiotherapistsList() {
  const classes = useStyles();
  const [allPhysiotherapistsList, setAllPhysiotherapistsList] = useState([]);
  const [physiotherapistsList, setPhysiotherapistsList] = useState([]);
  const [searched, setSearched] = useState('');
  const requestSearch = (searchedVal) => {
    let filteredPhysiotherapistsList = allPhysiotherapistsList.filter((row) => {
      return (
        row.serviceId?.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.center?.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.displayName?.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.address?.toLowerCase().includes(searchedVal.toLowerCase())
      );
    });
    setPhysiotherapistsList(filteredPhysiotherapistsList);
  };
  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  useEffect(() => {
    // get appointment data
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    var query = '';

    fetch('http://localhost:3001/physiotherapists', requestOptions)
      .then(response => response.json())
      .then(data => {
        setAllPhysiotherapistsList(data?.res);
        setPhysiotherapistsList(data?.res);
      });

  }, []);

  return (
    <>
      <PageTitle title="物理治療師列表" />
      <SearchBar
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
      />
      <Paper className={classes.iconsContainer}>
        <Table className="mb-0">
          <TableHead>
            <TableRow>
              {["醫護服務地點編號", "醫護機構", "物理治療師", "地址",  "電話號碼",  "預約"].map(key => (
                <TableCell key={key}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {physiotherapistsList?.map(physiotherapist => (
              <TableRow>
                <TableCell className="pl-3 fw-normal">{physiotherapist.serviceId}</TableCell>
                <TableCell>{physiotherapist.center}</TableCell>
                <TableCell>{physiotherapist.displayName}</TableCell>
                <TableCell>{physiotherapist.address}</TableCell>
                <TableCell>{physiotherapist.phoneNum}</TableCell>
                <TableCell>
                    <Chip label={"預約診症"} onClick={() => {window.location = `/#/app/booking/${physiotherapist.id}`}} classes={{ root: classes.success }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}
