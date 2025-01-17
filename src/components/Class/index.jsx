import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import './index.css';
import { useAlert } from "../AlertContext";

const tableStyles = {
  maxWidth: 900,
      margin: "auto",
      marginTop: "100px",
      width: 900,
      height: 350,
      marginLeft: "20%",
      overflow: "auto",
};

const titleStyles = {
  fontWeight: "bold",
    backgroundColor: "#aabce7", // Background color for the titles
    padding: "10px", // Adding padding to the title cells
};

const headingStyle = {
  position: "absolute",
  left: "45%",
  top: "15%",
  padding: "10px",
  boxShadow: "0px 0.5px 1px",
     };

const buttonStyle ={
    position:"absolute",
    left: "68%",
    top: "18%",
    padding: "5px",
    boxShadow: "0px 0.5px 1px",
            }

const ClassInstance = () => {
  const [classData, setClassData] = useState([]);
  const [newClassData, setNewClassData] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editData, setEditData] = useState({
    classId: "",
    className: "",
    classSection: "",
    classStrength: "",
  });

  const alert = useAlert();
  useEffect(() => {
     fetchData();
  }, []);

  const fetchData = () => {
      axios
       .get("http://localhost:8087/class")
       .then((response) => {
         console.log("hi");
         console.log(response.data);
         setClassData(response.data);
       })
       .catch((error) => {
         console.error("Error fetching class data:", error);
       });
  };


   const handleEdit = (classId) => {
     const classInstance = classData.find(
       (classInstance) => classInstance.classId === classId
     );
     if (classInstance) {
       setEditData({
         classId: classInstance.classId,
         className: classInstance.className,
         classSection: classInstance.classSection,
         classStrength: classInstance.classStrength,
       });
       setOpenEditDialog(true);
     }
     console.log(editData);
   };

   const handleSaveEdit = () => {
     console.log(editData);
     axios
       .put(
         `http://localhost:8087/class/${editData.classId}/${editData.classStrength}`
       )
       .then((response) => {
         setClassData((prevData) =>
           prevData.map((classInstance) =>
             classInstance.classId === editData.classId
               ? {
                   ...classInstance,
                    classStrength: editData.classStrength,
                 }
               : classInstance
           )
         );
         setOpenEditDialog(false);
         alert.showAlertWithMessage(response.data, "success");
       })
       .catch((error) => {
         console.error("Error updating classInstance data:", error);
         setOpenEditDialog(false);
       });
   };

    const handleAdd = () => {
      setNewClassData([]);
      setOpenAddDialog(true);
    };

   const handleSaveAdd = () => {
       console.log("hello");
       console.log(newClassData);
       console.log("hello");
       axios
         .post(
           `http://localhost:8087/class/${newClassData.className}/${newClassData.classSection}/${newClassData.classStrength}`,
         )
         .then((response) => {
           console.log(response);
           fetchData();
           setOpenAddDialog(false);
           alert.showAlertWithMessage(response.data, "success");
         })
         .catch((error) => {
           console.error("Error adding class data:", error);
           setOpenAddDialog(false);
         });
     };

   const handleDelete = (classId) => {
     try{
       axios
       .delete(`http://localhost:8087/class/${classId}`)
       .then((response) => {
         setClassData((prevData) =>
           prevData.filter(
             (classInstance) => classInstance.classId !== classId
           )
         );
         alert.showAlertWithMessage(response.data, "success");
       })
     }
     catch(error){
         console.error("Error deleting class data:", error);
     };
   };
  return (
     <card classInstanceName="App-card">
       <div style={headingStyle}>LIST OF classes</div>
       <Button onClick={() => handleAdd()} style={buttonStyle} >Add New Class</Button>

       <TableContainer component={Paper} style={tableStyles}>
         <Table>
           <TableHead>
             <TableRow>
               <TableCell style={titleStyles}>Serial Number</TableCell>
               <TableCell style={titleStyles}>class ID</TableCell>
               <TableCell style={titleStyles}>class Name</TableCell>
               <TableCell style={titleStyles}>class Section</TableCell>
               <TableCell style={titleStyles}>class Strength</TableCell>
               <TableCell style={titleStyles}>Update/Delete</TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
             {classData.map((classInstance, index) => (
               <TableRow key={classInstance.classId}>
                 <TableCell style={{ padding: "10px" }}>{index + 1}</TableCell>
                 <TableCell style={{ padding: "10px" }}>
                   {classInstance.classId}
                 </TableCell>
                 <TableCell style={{ padding: "10px" }}>
                   {classInstance.className}
                 </TableCell>
                 <TableCell style={{ padding: "10px" }}>
                   {classInstance.classSection}
                 </TableCell>
                 <TableCell style={{ padding: "10px" }}>
                   {classInstance.classStrength}
                 </TableCell>
                 <TableCell style={{ padding: "10px" }}>
                   <IconButton
                     aria-label="edit"
                     onClick={() => handleEdit(classInstance.classId)}
                   >
                     <EditIcon />
                   </IconButton>
                   <IconButton
                     aria-label="delete"
                     onClick={() => handleDelete(classInstance.classId)}
                   >
                     <DeleteIcon />
                   </IconButton>
                 </TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       </TableContainer>
       <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} PaperProps={{className: 'class-edit-dialog-box' }} >
         <DialogTitle>Edit class</DialogTitle>
         <DialogContent>
           <TextField
             label="Class Strength"
             value={editData.classStrength}
             onChange={(e) =>
               {
               setEditData({ ...editData, classStrength: e.target.value });
               }
             }
             style={{ marginTop: '10px'}}
             fullWidth
           />
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
           <Button onClick={handleSaveEdit} variant="contained" color="primary">
             Save
           </Button>
         </DialogActions>
       </Dialog>

       <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} PaperProps={{ className: 'class-add-dialog-box' }}>
         <DialogTitle>Add Class</DialogTitle>
         <DialogContent>
           <TextField
             label="Class Name"
             value={newClassData.className}
             onChange={(e) =>
               setNewClassData({ ...newClassData, className: e.target.value })
             }
             style={{ marginBottom: '10px' ,marginTop: '10px'}}
             fullWidth
           />
           <TextField
             label="Class Section"
             value={newClassData.classSection}
             onChange={(e) =>
               setNewClassData({ ...newClassData, classSection: e.target.value })
             }
             style={{ marginBottom: '10px' }}
             fullWidth
           />
           <TextField
             label="Strength"
             value={newClassData.classStrength}
             onChange={(e) =>
               setNewClassData({ ...newClassData, classStrength: e.target.value })
             }
             style={{ marginBottom: '10px'}}
             fullWidth
           />
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
           <Button onClick={handleSaveAdd} variant="contained" color="primary" >
             Save
           </Button>
         </DialogActions>
       </Dialog>
     </card>
   );
 };

export default ClassInstance;
