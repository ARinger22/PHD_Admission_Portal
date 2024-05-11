import React, { useState, useEffect } from "react";
import ChevronDots from "./ChevronDots.js";
import QualifyingExamDetails from "./QualifyingExamDetails";
import Declaration from "./Declaration";
import ApplicationFeeDetails from "./ApplicationFeeDetails";
import Review from "./Review.js";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../SignIn_SignUp/Sessions";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import screenSpinner from "../../images/2300-spinner.gif";
import ExperienceAndPublications from "./ExperienceAndPublications.js";
import GeneralApplicationDetails from "./GeneralApplicationDetails.js"
import { useLocation } from "react-router-dom";


function ReApplicantionDetails() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const data = searchParams.get("data");
  const decodedData = JSON.parse(data);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { handleSubmit } = useForm();
  const [full_name, setFullName] = useState("");
  const [category, setCategory] = useState("");
  const [categoryFees, setCategoryFees] = useState("");
  const [offering, setOffering] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  // const [hasFilledHighestGate, setHasFilledHighestGate] = useState("");
  // const [hasGivenMultipleGates, setHasGivenMultipleGates] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  function changeDateFormat() {
    let date = new Date();

    let month = date.getMonth() + 1;
    let day = String(date.getDate());
    if (day.length === 1) day = "0" + day;
    if (month.length === 1) month = "0" + month;

    date = date.getFullYear() + "-0" + month + "-" + day;

    return date;
  }

  const [previous_info, setPreviousInfo] = useState();
  useEffect(() => {
    Axios.get("/reapply-check-applicant-info", {
      headers: {
        Authorization: getToken(),
        offering_id: params.offering_id,
      },
    })
      .then((response) => {
        if (response.data === 1) {
          navigate("/logout");
        } else if (response.data === 2) {
          navigate("/home");
        } else if (response.data === 3) {
          navigate("/home");
        } else {
          const names = response.data.previous_info.rows[0];
          console.log("names : ", names)
          setPreviousInfo(names);
          setFullName(response.data.full_name);
          setCategory(response.data.category);
          setCategoryFees(response.data.category_fees);
          setIsFetching(false);
        }
      })
      .catch((err) => console.log(err));

    Axios.get("/get-offering-info", {
      headers: {
        Authorization: getToken(),
        offering_id: params.offering_id,
      },
    })
      .then((response) => {
        if (response.data === 1) {
          navigate("/logout");
        } else {
          setOffering(response.data);
        }
      })
      .catch((err) => console.log(err));
  }, [navigate]);

  const init_application_details = () => {
    const array = Array.from({ length: 66 }, () => "");
    if (offering.department === "Computer Science and Engineering") {
      array[5] = "GATE";
      array[11] = "GATE";
    }
    array[4] = changeDateFormat();
    array[23] = changeDateFormat();
    array[27] = changeDateFormat();
    array[28] = changeDateFormat();
    array[32] = changeDateFormat();
    array[33] = changeDateFormat();
    array[55] = params.offering_id;
    return array;
  };

  const [applicant_details, setApplicantDetails] = useState(
    init_application_details()
  );

  useEffect(() => {
    if (previous_info) {
      if(previous_info.interdisciplinary_prog_check && !applicant_details[42]) applicant_details[42] = previous_info.interdisciplinary_prog_check;
      if(previous_info.interdisciplinary_prog_name && !applicant_details[65]) applicant_details[65] = previous_info.interdisciplinary_prog_name;
      if(previous_info.mode_of_app && !applicant_details[43]) applicant_details[43] = previous_info.mode_of_app;
      if(previous_info.area_of_research && !applicant_details[44]) applicant_details[44] = previous_info.area_of_research;
      if(previous_info.first_pref && !applicant_details[45]) applicant_details[45] = previous_info.first_pref;
      if(previous_info.second_pref && !applicant_details[46]) applicant_details[46] = previous_info.second_pref;
      if(previous_info.third_pref && !applicant_details[47]) applicant_details[47] = previous_info.third_pref;
      if(previous_info.fourth_pref && !applicant_details[48]) applicant_details[48] = previous_info.fourth_pref;
      if(previous_info.specific_research_area && !applicant_details[49]) applicant_details[49] = previous_info.specific_research_area;
      if(previous_info.bachelor_degree_complete && !applicant_details[50]) applicant_details[50] = previous_info.bachelor_degree_complete;
      if(previous_info.pi_project_number && !applicant_details[51]) applicant_details[51] = previous_info.pi_project_number;
      if(previous_info.specific_research_area && !applicant_details[15]) applicant_details[15] = previous_info.specific_research_area;
      if(previous_info.noc_pdf && !applicant_details[61]) applicant_details[61] = previous_info.noc_pdf;
      if(previous_info.resume_pdf && !applicant_details[62]) applicant_details[62] = previous_info.resume_pdf;
      if(previous_info.letter_PI_pdf && !applicant_details[63]) applicant_details[63] = previous_info.letter_PI_pdf;
      if(previous_info.sop_pdf && !applicant_details[64]) applicant_details[64] = previous_info.sop_pdf;

      if(previous_info.qualifying_examination_1 && !applicant_details[5]) applicant_details[5] = previous_info.qualifying_examination_1;
      if(previous_info.branch_code_1 && !applicant_details[6]) applicant_details[6] = previous_info.branch_code_1
      if(previous_info.year_1 && !applicant_details[7]) applicant_details[7] = previous_info.year_1
      if(previous_info.valid_upto_1 && !applicant_details[8]) applicant_details[8] = previous_info.valid_upto_1
      if(previous_info.all_india_rank_1 && !applicant_details[9]) applicant_details[9] = previous_info.all_india_rank_1
      if(previous_info.score_1 && !applicant_details[10]) applicant_details[10] = previous_info.score_1
      if(previous_info.qualifying_examination_2 && !applicant_details[11]) applicant_details[11] = previous_info.qualifying_examination_2
      if(previous_info.branch_code_2 && !applicant_details[12]) applicant_details[12] = previous_info.branch_code_2
      if(previous_info.year_2 && !applicant_details[13]) applicant_details[13] = previous_info.year_2
      if(previous_info.valid_upto_2 && !applicant_details[14]) applicant_details[14] = previous_info.valid_upto_2
      if(previous_info.all_india_rank_2 && !applicant_details[15]) applicant_details[15] = previous_info.all_india_rank_2
      if(previous_info.score_2 && !applicant_details[16]) applicant_details[16] = previous_info.score_2
      if(previous_info.qualifying_examination_3 && !applicant_details[17]) applicant_details[17] = previous_info.qualifying_examination_3
      if(previous_info.branch_code_3 && !applicant_details[18]) applicant_details[18] = previous_info.branch_code_3
      if(previous_info.year_3 && !applicant_details[19]) applicant_details[19] = previous_info.year_3
      if(previous_info.valid_upto_3 && !applicant_details[20]) applicant_details[20] = previous_info.valid_upto_3
      if(previous_info.all_india_rank_3 && !applicant_details[21]) applicant_details[21] = previous_info.all_india_rank_3
      if(previous_info.score_3 && !applicant_details[22]) applicant_details[22] = previous_info.score_3
      if(previous_info.exam_result_pdf && !applicant_details[58]) applicant_details[58] = previous_info.exam_result_pdf
      
      if(previous_info.name_of_working_org_1 && !applicant_details[25]) applicant_details[25] = previous_info.name_of_working_org_1;
      if(previous_info.designation_1 && !applicant_details[26]) applicant_details[26] = previous_info.designation_1
      if(previous_info.duration_post_start_1 && !applicant_details[27]) applicant_details[27] = previous_info.duration_post_start_1
      if(previous_info.duration_post_end_1 && !applicant_details[28]) applicant_details[28] = previous_info.duration_post_end_1
      if(previous_info.nature_of_work_1 && !applicant_details[29]) applicant_details[29] = previous_info.nature_of_work_1
      if(previous_info.name_of_working_org_2 && !applicant_details[30]) applicant_details[30] = previous_info.name_of_working_org_2
      if(previous_info.designation_2 && !applicant_details[31]) applicant_details[31] = previous_info.designation_2
      if(previous_info.duration_post_start_2 && !applicant_details[32]) applicant_details[32] = previous_info.duration_post_start_2
      if(previous_info.duration_post_end_2 && !applicant_details[33]) applicant_details[33] = previous_info.duration_post_end_2
      if(previous_info.nature_of_work_2 && !applicant_details[34]) applicant_details[34] = previous_info.nature_of_work_2
      if(previous_info.total_years_of_service && !applicant_details[35]) applicant_details[35] = previous_info.total_years_of_service;
      if(previous_info.ieee_acm_springer_journals && !applicant_details[36]) applicant_details[36] = previous_info.ieee_acm_springer_journals
      if(previous_info.natn_itnl_journals && !applicant_details[37]) applicant_details[37] = previous_info.natn_itnl_journals
      if(previous_info.us_patents && !applicant_details[38]) applicant_details[38] = previous_info.us_patents
      if(previous_info.indian_patents && !applicant_details[39]) applicant_details[39] = previous_info.indian_patents
      if(previous_info.details_research_work && !applicant_details[40]) applicant_details[40] = previous_info.details_research_work
      if(previous_info.stat_of_purpose && !applicant_details[41]) applicant_details[41] = previous_info.stat_of_purpose
      if(previous_info.publications_pdf && !applicant_details[60]) applicant_details[60] = previous_info.publications_pdf
      
      if(previous_info.category && !applicant_details[0]) applicant_details[0] = previous_info.category;
      if(previous_info.amount && !applicant_details[1]) applicant_details[1] = previous_info.amount
      if(previous_info.transaction_id && !applicant_details[2]) applicant_details[2] = previous_info.transaction_id
      if(previous_info.bank && !applicant_details[3]) applicant_details[3] = previous_info.bank
      if(previous_info.transaction_slip_url && !applicant_details[59]) applicant_details[59] = previous_info.transaction_slip_url
      if(previous_info.date_of_transaction && !applicant_details[4]) applicant_details[4] = previous_info.date_of_transaction
      
      if(previous_info.full_name && !applicant_details[56]) applicant_details[56] = previous_info.full_name;
      if(previous_info.signature_url && !applicant_details[57]) applicant_details[57] = previous_info.signature_url
      if(previous_info.place_of_declaration && !applicant_details[24]) applicant_details[24] = previous_info.place_of_declaration
      if(previous_info.date_of_declaration && !applicant_details[23]) applicant_details[23] = previous_info.date_of_declaration
      
    }
  });

  function handleApplicantDetailsChange(e, index) {
    let copy = [...applicant_details];
    copy[index] = e.target.value;
    setApplicantDetails(copy);
  }

  function emptyFileIndex(index) {
    let copy = [...applicant_details];
    copy[index] = "";
    setApplicantDetails(copy);
  }

  const handleFileSubmit = (e, maxSize, index, fileType) => {
    const file = e.target.files[0];
    // ref.current = file;

    if (fileType === 1) {
      if (file.type !== "application/pdf") {
        e.target.value = null;
        alert("File format not followed! Allowed formats: .pdf");
        return;
      }
    } else if (fileType === 2) {
      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/jpg" &&
        file.type !== "application/pdf"
      ) {
        e.target.value = null;
        alert("File format not followed! Allowed formats: .jpeg, .jpg, .pdf");
        return;
      }
    } else if (fileType === 3) {
      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/jpg" &&
        file.type !== "image/png" &&
        file.type !== "image/gif"
      ) {
        e.target.value = null;
        alert(
          "File format not followed! Allowed formats: .jpeg, .jpg, .png, .gif"
        );
        return;
      }
    }

    if (file.size > maxSize * 1000000) {
      e.target.value = null;
      const error =
        "File size cannot exceed more than " + maxSize.toString() + "MB";
      alert(error);
    } else {
      let copy = [...applicant_details];
      copy[index] = file;
      setApplicantDetails(copy);
    }
  };

  function handleApplicationSubmit() {
    setIsLoading(true);
    const formData = new FormData();
    if (offering.department === "Computer Science and Engineering") {
      applicant_details[5] = "GATE";
      applicant_details[11] = "GATE";
    }
    applicant_details[52] = offering.department;
    applicant_details[53] = offering.specialization;
    applicant_details[54] = offering.offering_type;

    formData.append("applicant_details", JSON.stringify(applicant_details));
    formData.append("signature", applicant_details[57]);
    formData.append("exam_result_pdf", applicant_details[58]);
    formData.append("transaction_slip", applicant_details[59]);
    formData.append("publications_pdf", applicant_details[60]);
    formData.append("noc_pdf", applicant_details[61]);
    formData.append("resume_pdf", applicant_details[62]);
    formData.append("letter_PI_pdf", applicant_details[63]);
    formData.append("sop_pdf", applicant_details[64]);
    formData.append("page", page);
    formData.append("stat", 1);

    Axios.post("/reapply-save-application-info", formData, {
      headers: {
        Authorization: getToken(),
      },
    })
      .then((response) => {
        if (response.data === 1) {
          navigate("/logout");
        } else {
          if (page === 6) navigate("/success");
          else setIsLoading(false);
        }
      })
      .catch((err) => console.log(err));
  }

  function increasePageNumber() {
    setPage(page + 1);
  }

  function decreasePageNumber() {
    setPage(page - 1);
  }

  return (
    <div>
      {isFetching ? (
        <div className="mt-40">
          <img
            className="mx-auto h-[200px] w-[200px]"
            alt="Spinner"
            src={screenSpinner}
          />{" "}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-12 gap-2">
            <div className="mx-12 mb-12 mt-10 px-12 col-start-1 col-end-12">
              <ChevronDots
                steps={[
                    "General Application Details",
                    "Qualifying Exam Details",
                    "Experiences and Publications",
                    "Application Fee Details",
                    "Declaration",
                    "Review",
                ]}
                currentStep={page}
              />
            </div>

            <Link
              to="/my-applications"
              className="col-start-12 col-end-13 justify-center lg:w-12 lg:h-12 w-8 h-8 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm m-3 p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="lg:w-6 lg:h-6 w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          {
              {
                1: (
                  <GeneralApplicationDetails
                    decodedData={decodedData}
                    increasePageNumber={increasePageNumber}
                    offering={offering}
                    details={applicant_details}
                    onChange={handleApplicantDetailsChange}
                    handleFileSubmit={handleFileSubmit}
                    onSubmit={handleApplicationSubmit}
                    emptyFileIndex={emptyFileIndex}
                  />
                ),
                2: (
                  <QualifyingExamDetails
                    decodedData={decodedData}
                    increasePageNumber={increasePageNumber}
                    decreasePageNumber={decreasePageNumber}
                    offering={offering}
                    details={applicant_details}
                    onChange={handleApplicantDetailsChange}
                    onSubmit={handleApplicationSubmit}
                    handleFileSubmit={handleFileSubmit}
                    emptyFileIndex={emptyFileIndex}
                  />
                ),
                3: (
                  <ExperienceAndPublications
                    increasePageNumber={increasePageNumber}
                    decreasePageNumber={decreasePageNumber}
                    offering={offering}
                    details={applicant_details}
                    onChange={handleApplicantDetailsChange}
                    onSubmit={handleApplicationSubmit}
                    handleFileSubmit={handleFileSubmit}
                    emptyFileIndex={emptyFileIndex}
                  />
                ),
                4: (
                  <ApplicationFeeDetails
                    category={category}
                    increasePageNumber={increasePageNumber}
                    decreasePageNumber={decreasePageNumber}
                    details={applicant_details}
                    onChange={handleApplicantDetailsChange}
                    onSubmit={handleApplicationSubmit}
                    handleFileSubmit={handleFileSubmit}
                    emptyFileIndex={emptyFileIndex}
                    categoryFees={categoryFees}
                  />
                ),
                5: (
                  <Declaration
                    full_name={full_name}
                    increasePageNumber={increasePageNumber}
                    details={applicant_details}
                    decreasePageNumber={decreasePageNumber}
                    onChange={handleApplicantDetailsChange}
                    onSubmit={handleApplicationSubmit}
                    handleFileSubmit={handleFileSubmit}
                    emptyFileIndex={emptyFileIndex}
                  />
                ),
                6: (
                  <Review
                    offering={offering}
                    decreasePageNumber={decreasePageNumber}
                    details={applicant_details}
                    handleSubmit={handleSubmit}
                    onSubmit={handleApplicationSubmit}
                    isLoading={isLoading}
                  />
                ),
              }[page]
          }
        </div>
      )}
    </div>
  );
}

export default ReApplicantionDetails;
