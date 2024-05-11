import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { Link } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%", // Adjusting the width of the modal
  maxWidth: "80%", // Set maximum width to maintain responsiveness
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
};

export default function ReApplyModal(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {props.application.is_accepting_applications === true ? (
        <button
          onClick={handleOpen}
          type="button"
          className="focus:outline-none text-indigo-600 hover:text-indigo-900"
        >
          Edit
        </button>
      ) : (
        <button className="text-gray-300" disabled>
          Edit
        </button>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid container>
            <Grid item xs={11}>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
              ></Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                className="focus:outline-none"
                aria-label="Close"
                onClick={handleClose}
              >
                <Close />
              </IconButton>
            </Grid>
          </Grid>
          <div
            className="pl-5 bg-white rounded-lg "
            id="modal-modal-description"
          >
            <div className="flex flex-col items-start mt-4">
              <h2 className="text-xl font-bold mb-4">
                Are you sure you want to Edit for{" "}
                <span className="italic font-semibold">
                  {props.application.specialization}
                </span>
                ?
              </h2>
              <p className="text-sm text-gray-500">
                The existing application will be replaced on successful
                re-submission.
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-end mt-8 text-xs">
              <Link to={{pathname : "/re-apply/" + props.application.offering_id,
                  search: `?data=${encodeURIComponent(JSON.stringify(props.application))}`
                }}>
                <button
                  type="button"
                  className="hover:shadow-lg transition duration-200 border border-red-400 hover:bg-red-600 hover:text-white focus:outline-none w-28 px-4 py-2 font-medium text-red-600 rounded bg-red-50 mb-2 md:mb-0 md:mr-2"
                >
                  Yes, I'm sure
                </button>
              </Link>

              <button
                type="button"
                onClick={handleClose}
                className="border border-gray-400 transition duration-200 hover:bg-gray-600 hover:text-gray-50 focus-outline-none px-4 py-2 font-medium text-gray-600 rounded bg-gray-50"
              >
                No, go back
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
