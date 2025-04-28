import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/layout";
import {
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Box,
} from "@mui/material";
import "./history.css";
import { useDispatch, useSelector } from "react-redux";
import { historyList } from "../../redux/auth/auth";

function History({ open }) {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
      dispatch(historyList())
  }, [dispatch]);

  const historyListing = useSelector((state) => state?.dataSlice?.historyListing);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Layout>
      <div className={open ? "content expanded" : "content collapsed"}>
        <Container>
          <Grid
            container
            spacing={2}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
          >
            <Container>
              <Typography
                variant="h4"
                style={{ textAlign: "center", marginTop: "100px" }}
                gutterBottom
              >
                History
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sr No.</TableCell>
                    <TableCell>Image/Video</TableCell>
                    <TableCell>Fake %age</TableCell>
                    <TableCell>Real %age</TableCell>
                    <TableCell>Result</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyListing
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.Image_video_data}</TableCell>
                        <TableCell>{row.prdicted_percentage_data.split(", ")[0].replace("Fake: ", "") + "%"}</TableCell>
                        <TableCell>{row.prdicted_percentage_data.split(", ")[1].replace("Real: ", "") + "%"}</TableCell>
                        <TableCell>{row.Result}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Container>
            <TablePagination
              component="div"
              count={data.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </Container>
      </div>
    </Layout>
  );
}

export default History;
