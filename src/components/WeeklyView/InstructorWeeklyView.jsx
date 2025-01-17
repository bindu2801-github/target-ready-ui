import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { useAlert } from "../AlertContext";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  CardContent,
  Modal,
  Typography,
} from "@mui/material";
import "./index.css";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

const CustomTableContainer = styled(TableContainer)({
  maxWidth: 900,
  margin: "auto",
  marginTop: "16px",
  width: 1900,
  height: 400,
  marginLeft: "-20%",
  overflow: "auto",
});

const InstructorWeeklyView = () => {
  const [selectedCellData, setSelectedCellData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  
  const alert = useAlert();
  const handleCellClick = (cellData) => {
    setSelectedCellData(cellData);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const [table,setTable]=useState([]);

  const id = localStorage.getItem('id');

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = () => {
    try{
        axios
        .get(`http://localhost:8087/time_table/instructor/${id}`)
        .then((response) => {
          setTable(response.data);
        })
    }catch(error) {
        alert.showAlertWithMessage("No data found!", "error");
    };
  };

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const timeSlots = [
    "9:00am-10:00am",
    "10:00am-11:00am",
    "11:00am-12:00pm",
    "12:00pm-1:00pm",
    "1:00pm-2:00pm",
    "2:00pm-3:00pm",
    "3:00pm-4:00pm",
    "4:00pm-5:00pm",
  ];

  return (
    <>
      <CustomTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell id="bold">Time Slot</TableCell>
              {timeSlots.map((slot) => (
                <TableCell key={slot}>{slot}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {days.map((day) => (
              <TableRow key={day}>
                <TableCell id="bold">{day}</TableCell>
                {timeSlots.map((slot) => {
                  const cellData = table.find(
                    (item) => item.week === day && item.slot === slot
                  );
                  let message;
                  if (cellData) {
                    message = <p>{cellData.className +' - ' + cellData.section}</p>;
                  }
                  else if(slot==="12:00pm-1:00pm"){
                    message = <p>Lunch</p>;
                  }
                  else {
                    message = <p>Leisure</p>;
                  }
                  return (
                    <TableCell
                      key={`${slot}-${day}`}
                      onClick={() => handleCellClick(cellData)}
                    >
                      {message}
                      {/* {cellData ? cellData.courseName : "lunch"} */}
                    </TableCell>
                  );
                 })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CustomTableContainer>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Card className="modal-card">
          <CardContent>
            <Typography variant="h6">
              Class: {selectedCellData?.className + ' - ' + selectedCellData?.section}
            </Typography>

            <Typography variant="body1">
              Subject: {selectedCellData?.courseName}
            </Typography>
            <Typography variant="body1">
              Location: {selectedCellData?.location}
            </Typography>
            <Typography variant="body1">
              Day: {selectedCellData?.week}
            </Typography>
            <Typography variant="body1">
              Time: {selectedCellData?.slot}
            </Typography>

          </CardContent>
        </Card>
      </Modal>



    </>
  );
};
export default InstructorWeeklyView;
