import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MainLayout from "../../components/MainLayout";
import BaseUrl from "../../data/Baseurl";
import { images, stables } from "../../constants";

import {
  Box,
  Grid,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Modal,
  TableHead,
  Button,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const ListPage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    const fetchData = async () => {
      try {
        const account = localStorage.getItem("account");
        const user_id = JSON.parse(account)._id;
        const token = JSON.parse(account).token;
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(
          `${BaseUrl}/api/users/getuserposts/${user_id}`,
          config
        );
        setPosts(response.data.posts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

 const filteredPosts = posts.filter((post) =>
   post.title.toLowerCase().includes(searchTerm.toLowerCase())
 );

 let sortedPosts = [...filteredPosts];

 switch (sortOption) {
   case "titleAZ":
     sortedPosts.sort((a, b) => a.title.localeCompare(b.title));
     break;
   case "titleZA":
     sortedPosts.sort((a, b) => b.title.localeCompare(a.title));
     break;
   case "dateNewOld":
     sortedPosts.sort(
       (a, b) => new Date(b.created_at) - new Date(a.created_at)
     );
     break;
   case "dateOldNew":
     sortedPosts.sort(
       (a, b) => new Date(a.created_at) - new Date(b.created_at)
     );
     break;
   default:
     break;
 }


  const handleDelete = async (postId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmation) {
      return;
    }

    try {
      const account = localStorage.getItem("account");
      const token = JSON.parse(account).token;

      await axios.delete(`${BaseUrl}/api/users/deletepost/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenModal = (post) => {
    setModalData(post);
    setIsModalOpen(true);
  };

  return (
    <MainLayout>
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          backgroundColor: "#fff",
          fontFamily: "Georgia, serif",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              component="div"
              gutterBottom
              style={{ color: "#ea580c", fontWeight: "bold" }}
            >
              My Collection
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search by Name"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              fullWidth
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="default">Sort by...</MenuItem>
              <MenuItem value="titleAZ">Name A-Z</MenuItem>
              <MenuItem value="titleZA">Name Z-A</MenuItem>
              <MenuItem value="dateNewOld">Date New-Old</MenuItem>
              <MenuItem value="dateOldNew">Date Old-New</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: isMobile ? 300 : 650 }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedPosts.map((post) => (
                    <TableRow key={post._id}>
                      <TableCell component="th" scope="row">
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item>
                            <img
                              className="w-20 h-20 mr-4 rounded"
                              src={
                                post.photo
                                  ? stables.UPLOAD_FOLDER_BASE_URL + post.photo
                                  : images.samplePostImage
                              }
                              alt="post"
                            />
                          </Grid>
                          <Grid item>
                            <span>{post.title}</span>
                          </Grid>
                        </Grid>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleDelete(post._id)}
                          color="secondary"
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleOpenModal(post)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Modal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setModalData(null);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isMobile ? "90%" : 800,
              bgcolor: "background.paper",
              border: "2px solid #ea580c",
              boxShadow: 24,
              p: 4,
              display: "flex", // Add display flex
               flexDirection: isMobile ? "column" : "row", // Make it horizontal flex container
              justifyContent: "space-between",
              overflow: "auto", // Add this line
              maxHeight: "90%",
            }}
          >
            {modalData && (
              <>
                <div
                  style={{
                    width: isMobile ? "100%" : "40%",
                    marginRight: isMobile ? "0px" : "20px",
                  }}
                >
                  {modalData.photo && (
                    <img
                      src={
                        modalData?.photo
                          ? stables.UPLOAD_FOLDER_BASE_URL + modalData?.photo
                          : images.samplePostImage
                      }
                      alt={modalData.title}
                      style={{
                        width: "100%",
                        objectFit: "cover",
                        marginTop: "10px",
                      }}
                    />
                  )}
                </div>
                <div style={{ width: isMobile ? "100%" : "60%" }}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="div"
                    style={{ color: "#ea580c", fontWeight: "bold" }}
                  >
                    {modalData.title}
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <strong>Brand:</strong> {modalData.brand} <br />
                    <strong>Series:</strong> {modalData.series} <br />
                    <strong>Model:</strong> {modalData.model} <br />
                    <strong>Produced:</strong> {modalData.produced} <br />
                    <strong>Color:</strong> {modalData.color} <br />
                    <strong>Price:</strong> {modalData.price} <br />
                    <strong>Details:</strong> {JSON.stringify(modalData.detail)}{" "}
                    <br />
                    <strong>Tags:</strong> {modalData.tags.join(", ")} <br />
                  </Typography>
                  <Button
                    onClick={() => {
                      setIsModalOpen(false);
                      setModalData(null);
                    }}
                    color="secondary"
                    variant="contained"
                    style={{
                      backgroundColor: "#ea580c",
                      color: "#fff",
                      fontWeight: "bold",
                      marginTop: "20px",
                    }}
                  >
                    Close
                  </Button>
                </div>
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </MainLayout>
  );
};

export default ListPage;




