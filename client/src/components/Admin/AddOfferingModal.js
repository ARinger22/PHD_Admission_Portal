import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Tooltip } from "@mui/material";
import Toggle from "./Toggle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Axios from "axios";
import { getToken } from "../SignIn_SignUp/Sessions";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import spinner from "../../images/SpinnerWhite.gif";
import { getAdminType } from "./AdminTypes";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 5,
};

export default function AddOfferingModal(props) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [applicationChecked, setApplicationChecked] = useState(false);
  const [draftChecked, setDraftChecked] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const admin_type = getAdminType();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    onClose();
    setOpen(false);
  };

  const handleChange1 = (event) => {
    setApplicationChecked(event.target.checked);
  };

  const handleChange2 = (event) => {
    setDraftChecked(event.target.checked);
  };

  const onClose = () => {
    reset();
    setApplicationChecked(false);
    setDraftChecked(false);
  };

  const onSubmit = (data) => {
    setIsLoading(true);
    const formData = new FormData();

    formData.append("offering_type", data.offering_type);
    formData.append("department", data.department);
    formData.append("specialization", data.specialization);
    formData.append("eligibility", data.eligibility);
    const currentDate = new Date();

    const deadlineDate = new Date(data.deadline);
    if (deadlineDate > currentDate) {
      formData.append("deadline", data.deadline);
    } else {
      window.alert("Deadline should be after the current day.");
      setIsLoading(false);
      return;
    }
    formData.append("is_accepting_applications", applicationChecked);
    formData.append("is_draft_mode", draftChecked);
    formData.append("cycle_id", props.cycle_id);

    Axios.post("/add-offering", formData, {
      headers: {
        Authorization: getToken(),
      },
    })
      .then((response) => {
        if (response.data === 1) {
          navigate("/logout");
        } else {
          window.location.reload();
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="relative">
      <Tooltip title="Add">
        <button
          type="button"
          onClick={handleOpen}
          className="focus:outline-none text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm inline-flex items-center px-3 py-2 text-center"
        >
          <svg
            className="-ml-1 mr-2 h-6 w-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Offering
        </button>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div
            id="modal-modal-description"
            className="relative w-full h-[80vh] md:h-auto overflow-y-auto"
          >
            <div className="bg-white rounded-lg shadow relative p-5">
              <h3 className="text-xl font-semibold mb-6">Add offering</h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="department"
                      className="text-sm font-medium text-gray-900 block mb-2"
                    >
                      Department
                    </label>
                    <select
                      id="department"
                      {...register("department")}
                      required
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    >
                      <option value="">- Select -</option>
                      {props.department.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="specialization"
                      className="text-sm font-medium text-gray-900 block mb-2"
                    >
                      Specialization
                    </label>
                    <input
                      type="text"
                      {...register("specialization")}
                      id="specialization"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="offering_type"
                      className="text-sm font-medium text-gray-900 block mb-2"
                    >
                      Offering Type
                    </label>
                    <select
                      id="offering_type"
                      name="offering_type"
                      {...register("offering_type")}
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      required
                    >
                      <option value="">None</option>
                      <option value="Regular/External/Part Time">
                        Regular/External/Part Time
                      </option>
                      <option value="Direct">Direct</option>
                      <option value="Staff Member">Staff Member</option>
                      <option value="Project Staff">Project Staff</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="deadline"
                      className="text-sm font-medium text-gray-900 block mb-2"
                    >
                      Deadline
                    </label>
                    <input
                      type="date"
                      required
                      id="deadline"
                      {...register("deadline")}
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    />
                  </div>
                  <div className="col-span-full">
                    <label
                      htmlFor="eligibility"
                      className="text-sm font-medium text-gray-900 block mb-2"
                    >
                      Eligibility
                    </label>
                    <textarea
                      required
                      {...register("eligibility")}
                      id="eligibility"
                      rows={6}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4"
                      defaultValue={""}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  {admin_type === "0" ? (
                    <>
                      <div className="p-3">
                        <FormControlLabel
                          control={
                            <Toggle
                              checked={applicationChecked}
                              onChange={handleChange1}
                              sx={{ m: 1 }}
                            />
                          }
                          label="Accept Applications"
                        />
                      </div>
                      <div className="p-3">
                        <FormControlLabel
                          control={
                            <Toggle
                              checked={draftChecked}
                              onChange={handleChange2}
                              sx={{ m: 1 }}
                            />
                          }
                          label="Draft Mode"
                        />
                      </div>
                    </>
                  ) : (
                    <h3 className="italic text-base font-normal text-gray-500 mt-4 mb-1">
                      This offering will be added in draft mode.
                    </h3>
                  )}
                </div>
                <div className="p-3 border-t border-gray-200 rounded-b">
                  {!isLoading ? (
                    <button
                      className="text-white focus:outline-none block w-full bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm py-2"
                      type="submit"
                    >
                      Add Offering
                    </button>
                  ) : (
                    <button
                      className="text-white focus:outline-none block w-full bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm py-2"
                      type="submit"
                      disabled
                    >
                      <img
                        className="h-5 w-5 mx-auto"
                        alt="spinner"
                        src={spinner}
                      />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
