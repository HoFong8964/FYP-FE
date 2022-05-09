import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, TextField, Select, MenuItem, Box, Button, FormControl, InputLabel, Checkbox} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import classnames from "classnames";
import DatePicker from "react-date-picker";
import "react-datetime/css/react-datetime.css";


// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";

// components
import Widget from "../../components/Widget/Widget";
import PageTitle from "../../components/PageTitle/PageTitle";
import Notification from "../../components/Notification";
import { set } from "date-fns";


const positions = [
  toast.POSITION.TOP_LEFT,
  toast.POSITION.TOP_CENTER,
  toast.POSITION.TOP_RIGHT,
  toast.POSITION.BOTTOM_LEFT,
  toast.POSITION.BOTTOM_CENTER,
  toast.POSITION.BOTTOM_RIGHT,
];


export default function NotificationsPage(props) {
  var classes = useStyles();

  // local
  var [phyList, setPhyList] = useState(undefined);
  var [phyId, setPhyId] = useState('');
  var [bookDate, setBookDate] = useState(new Date());
  var [hour, setHour] = useState('');
  var [minute, setMinute] = useState('');
  var [remarks, setRemarks] = useState('');
  var [agreement ,setAgreement] = useState(false);
  var { selectedPhyId } = useParams();
  

  var hours = ['10','11','12','13','14','15','16','17','18']
  var minutes = ['00','30']


  var nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);

  useEffect(() => {
    // get phy data
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch('http://localhost:3001/physiotherapists', requestOptions)
      .then(response => response.json())
      .then(data => {
        setPhyList(data.res);
        if(selectedPhyId){
          console.log("selectedPhyId: ", selectedPhyId);
          setPhyId(selectedPhyId);
        }
      });
  }, []);
  

  return (
    <>
      <PageTitle title="預約診症" />
      <Grid container spacing={4}>
        <ToastContainer
          className={classes.toastsContainer}
          closeButton={
            <CloseButton className={classes.notificationCloseButton} />
          }
          closeOnClick={false}
          progressClassName={classes.notificationProgress}
        />
        <Grid item xs={12}>
        <Widget disableWidgetMenu>
          <Grid container item xs={12}>
          <div className={classes.formContainer}>
            <div className={classes.form}>
              <div>
                <TextField
                  id="outlined-name"
                  label="姓名"
                  value={localStorage.getItem('displayName')}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="filled"
                />
              </div>
              <div>&nbsp;</div>
              <div>
                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">物理治療師</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={phyId}
                      label="PhyId"
                      onChange={e => {setPhyId(e.target.value)}}
                    >
                      {phyList?.length > 0 ? phyList?.map((value,index)=>{
                        return <MenuItem value={value.id}>{value.center} - {value.displayName}</MenuItem>
                      }) : ''}
                    </Select>
                  </FormControl>
                </Box>
              </div>
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              <div>
                <DatePicker
                  value={bookDate}
                  onChange={(date) => {setBookDate(date)}}
                  minDate={nextDay}
                
                />
              </div>
              <div>&nbsp;</div>
              <div>
                <Box sx={{ minWidth: 160 }}>
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">時</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={hour}
                      label="Hours"
                      onChange={e => {setHour(e.target.value)}}
                    >
                      {hours.map((value,index)=>{
                        return <MenuItem value={value}>{value}</MenuItem>
                      })}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">分</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={minute}
                      label="Minutes"
                      onChange={e => {setMinute(e.target.value)}}
                    >
                      {minutes.map((value,index)=>{
                        return <MenuItem value={value}>{value}</MenuItem>
                      })}
                    </Select>
                  </FormControl>
                </Box>
              </div>
              <div>&nbsp;</div>
              <div>
                <TextField
                  id="outlined-name"
                  label="備註"
                  value={remarks}
                  onChange={e => {setRemarks(e.target.value)}}
                  multiline
                  maxRows={4}
                />
              </div>
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              <div>
                <Checkbox
                  className={classes.checkbox}
                  checked={agreement}
                  onChange={e => {setAgreement(e.target.checked)}}
                />
                我同意相關機構取閱我的電子健康紀錄
              </div>
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              <div className={classes.formButtons}>
                <Button
                  onClick={() =>
                    confirmBook()
                  }
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  確定
                </Button>
              </div>
            </div>
          </div>
          </Grid>
          </Widget>
        </Grid>
      </Grid>
    </>
  );

  function confirmBook() {
    var appointmentDate = bookDate.getFullYear() + "-" + ((bookDate.getMonth()+1)<10 ? '0' : '') + (bookDate.getMonth()+1) + "-" + (bookDate.getDate() < 10 ? '0' : '') + bookDate.getDate();
    var appointmentTime = hour + ":" + minute;
    if(!agreement){
      alert('請同意相關機構取閱你的電子健康紀錄');
      return false;
    }
    if(phyId && appointmentDate && appointmentTime){
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: localStorage.getItem('id'),
          phyId: phyId,
          appointmentDate: appointmentDate,
          appointmentTime: appointmentTime,
          remarks: remarks,
         })
      };
      fetch('http://localhost:3001/makeAppointment', requestOptions)
        .then(response => response.json())
        .then(data => {
          if(data.status === 200){
            window.location.href = '/#/app/appointment';
          }
        });
    }

    
  }

}

function CloseButton({ closeToast, className }) {
  return <CloseIcon className={className} onClick={closeToast} />;
}
