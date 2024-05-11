import React from "react";
import { PaperClipIcon } from "@heroicons/react/solid";
import PersonalInfo from "./PersonalInfo";
import CommunicationDetails from "./CommunicationDetails";
import EducationalDetails from "./EducationalDetails";
import ExperienceDetails from "./ExperienceDetails";
import DashboardNavBar from "./DashboardNavBar";
import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../SignIn_SignUp/Sessions";
import { useNavigate } from "react-router-dom";
import DefaultProfilePicture from "../../images/default-profile-picture.svg";

export default function Profile() {
  const navigate = useNavigate();

  function initDegrees() {
    let result = [];
    for (let i = 0; i < 5; i++) {
      let temp = {
        id: 0,
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
        7: "",
        8: "",
        9: "",
      };
      temp["id"] = i;
      result.push(temp);
    }
    return result;
  }

  function init_percentage_cgpa_pattern(
    localProfileInfoTemp,
    localDegreesTemp
  ) {
    let result = [];
    if (localProfileInfoTemp.percentage_cgpa_format_10th === "Percentage") {
      result.push("(^100(\\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\\.[0-9]{1,2})?$)");
    } else {
      result.push("^(([0-9]{1})|([0-9]{1}\\.\\d{1,2}))|10\\.00|10\\.0|10");
    }

    if (localProfileInfoTemp.percentage_cgpa_format_12th === "Percentage") {
      result.push("(^100(\\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\\.[0-9]{1,2})?$)");
    } else {
      result.push("^(([0-9]{1})|([0-9]{1}\\.\\d{1,2}))|10\\.00|10\\.0|10");
    }

    for (let i = 0; i < 5; i++) {
      if (localDegreesTemp[i]["4"] === "Percentage") {
        result.push(
          "(^100(\\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\\.[0-9]{1,2})?$)"
        );
      } else {
        if (localDegreesTemp[i]["6"] === "10") {
          result.push("^(([0-9]{1})|([0-9]{1}\\.\\d{1,2}))|10\\.00|10\\.0|10");
        } else if (localDegreesTemp[i]["6"] === "5") {
          result.push("^(([0-4]{1})|([0-4]{1}\\.\\d{1,2}))|5\\.00|5\\.0|5");
        } else {
          result.push("^(([0-3]{1})|([0-3]{1}\\.\\d{1,2}))|4\\.00|4\\.0|4");
        }
      }
    }
    return result;
  }

  const [percentage_cgpa_pattern, setPercentageCgpaPattern] = useState(
    Array.from(
      { length: 7 },
      () => "(^100(\\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\\.[0-9]{1,2})?$)"
    )
  );
  const [profileInfo, setProfileInfo] = useState(0);
  const [BtechInfo, setBtechInfo] = useState(0);
  const [localProfileInfo, setLocalProfileInfo] = useState(0);
  const [degrees, setDegrees] = useState(initDegrees());
  const [degrees2, setDegrees2] = useState(initDegrees());
  const [localDegrees, setLocalDegrees] = useState(initDegrees());
  const [localDegrees2, setLocalDegrees2] = useState(initDegrees());
  const [degreeSize, setDegreeSize] = useState(0);
  const [degreeSize2, setDegreeSize2] = useState(0);
  const [count, setCount] = useState(1);
  const [count2, setCount2] = useState(1);

  function emptyFile(key) {
    let copy = { ...localProfileInfo };
    assign(copy, key, null);
    setLocalProfileInfo(copy);
  }

  function emptyFileDegree2(index, id) {
    let copy = [...localDegrees2];
    copy[id][String(index)] = null;
    setLocalDegrees2(copy);
  }

  function emptyFileDegree(index, id) {
    let copy = [...localDegrees];
    copy[id][String(index)] = null;
    setLocalDegrees(copy);
  }

  function syncLocalGlobalData2() {
    let copy = { ...profileInfo };
    setLocalProfileInfo(copy);

    let copy2 = [];
    for (let i = 0; i < 5; i++) {
      let temp = { ...degrees2[i] };
      copy2.push(temp);
    }

    setLocalDegrees2(copy2);
  }

  function syncLocalGlobalData() {
    let copy = { ...profileInfo };
    setLocalProfileInfo(copy);

    let copy2 = [];
    for (let i = 0; i < 5; i++) {
      let temp = { ...degrees[i] };
      copy2.push(temp);
    }

    setLocalDegrees(copy2);
  }

  const getDegreeSize2 = (degrees2) => {
    if (degrees2 === null) return 0;
    let cnt = 0;
    for (var i = 0; i < degrees2.length; i++) {
      if (degrees2[i][0] !== "") {
        cnt = cnt + 1;
      }
    }
    return cnt;
  };

  const getDegreeSize = (degrees) => {
    if (degrees === null) return 0;
    let cnt = 0;
    for (var i = 0; i < degrees.length; i++) {
      if (degrees[i][0] !== "") {
        cnt = cnt + 1;
      }
    }
    return cnt;
  };

  function convert2dArrayToJsonObjectArray(degrees) {
    if (degrees === null) {
      return initDegrees();
    }

    var result = [];
    for (var i = 0; i < degrees.length; i++) {
      var degree = {};
      for (var j = 0; j < degrees[i].length; j++) {
        degree[String(j)] = degrees[i][j];
      }
      degree["id"] = i;
      result.push(degree);
    }
    return result;
  }

  function assign(obj, prop, value) {
    if (typeof prop === "string") prop = prop.split(".");

    if (prop.length > 1) {
      var e = prop.shift();
      assign(
        (obj[e] =
          Object.prototype.toString.call(obj[e]) === "[object Object]"
            ? obj[e]
            : {}),
        prop,
        value
      );
    } else obj[prop[0]] = value;
  }

  useEffect(() => {
    axios
      .get("/get-profile-info", {
        headers: {
          Authorization: getToken(),
        },
      })
      .then((response) => {
        if (response.data === 1) {
          navigate("/logout");
        } else {
          let copy = { ...response.data };

          for (const key in copy) {
            if (copy[key] === null || copy[key] === "null") {
              copy[key] = "";
            }
          }

          let copy2 = { ...response.data };
          for (const key in copy2) {
            if (copy2[key] === null || copy2[key] === "null") {
              copy2[key] = "";
            }
          }

          let copy3 = { ...response.data };
          for (const key in copy3) {
            if (copy3[key] === null || copy3[key] === "null") {
              copy3[key] = "";
            }
          }

          setProfileInfo(copy);
          setLocalProfileInfo(copy2);

          setDegrees(convert2dArrayToJsonObjectArray(response.data.degrees));
          setDegrees2(convert2dArrayToJsonObjectArray(response.data.degrees2));
          setLocalDegrees(
            convert2dArrayToJsonObjectArray(response.data.degrees)
          );
          setLocalDegrees2(
            convert2dArrayToJsonObjectArray(response.data.degrees2)
          );
          setDegreeSize(getDegreeSize(response.data.degrees));
          setDegreeSize2(getDegreeSize2(response.data.degrees2));
          setCount(Math.max(1, getDegreeSize(response.data.degrees)));
          setCount2(Math.max(1, getDegreeSize2(response.data.degrees2)));
          setPercentageCgpaPattern(
            init_percentage_cgpa_pattern(
              copy3,
              convert2dArrayToJsonObjectArray(response.data.degrees)
            )
          );
        }
      })
      .catch((err) => console.log(err));
  }, [navigate]);

  const handleLocalChange = (event, key) => {
    let copy = { ...localProfileInfo };
    assign(copy, key, event.target.value);
    setLocalProfileInfo(copy);
  };

  const handleLocalChangeDegrees2 = (index, key, event) => {
    let copy = [...localDegrees2];
    let temp = copy[index];
    assign(temp, key, event.target.value);
    copy[index] = temp;
    setLocalDegrees2(copy);
  };

  const handleLocalChangeDegrees = (index, key, event) => {
    let copy = [...localDegrees];
    let temp = copy[index];
    assign(temp, key, event.target.value);
    copy[index] = temp;
    setLocalDegrees(copy);
  };

  const removeLocalDegree2 = (index) => {
    let copy = [...localDegrees2];
    for (let i = 0; i < 10; i++) {
      copy[index][String(i)] = "";
    }
    setLocalDegrees2(copy);
  };

  const removeLocalDegree = (index) => {
    let copy = [...localDegrees];
    for (let i = 0; i < 10; i++) {
      copy[index][String(i)] = "";
    }
    setLocalDegrees(copy);
  };

  const onChangeNationality = (val) => {
    let copy = { ...localProfileInfo };
    assign(copy, "nationality", val);
    setLocalProfileInfo(copy);
  };

  return (
    <>
      <DashboardNavBar currentFlag={2} />
      <div className="flex justify-center">
        <div className="flex-2 my-20 mx-20 block">
          <img
            className="ring-2 h-40 w-40 ring-gray-700 rounded-full border border-black"
            src={
              profileInfo.profile_image_url
                ? profileInfo.profile_image_url
                : DefaultProfilePicture
            }
            alt="Profile"
          />
        </div>
      </div>

      <div className="flex my-10 mx-20 md:px-20  ">
        <div className="my-2 flex-1 bg-white shadow overflow-hidden sm:rounded-lg">          <div className="flex space-x-3 px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Personal Details
          </h3>


            <PersonalInfo
              onChangeNationality={onChangeNationality}
              localProfileInfo={localProfileInfo}
              onChange={handleLocalChange}
              emptyFile={emptyFile}
              syncLocalGlobalData={syncLocalGlobalData}
            />

          <div
            id="tooltip-animation"
            role="tooltip"
            className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700"
          >
            Edit Details
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
          <div className="border-t border-gray-300">
            <dl>
              <div className="bg-gray-50 px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">Full name</dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.full_name
                    ? profileInfo.full_name
                    : "Your Full Name"}
                </dd>

                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                  Father's Name
                </dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.fathers_name
                    ? profileInfo.fathers_name
                    : "Your Father's Name"}
                </dd>
              </div>
              <div className="bg-white px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                  Date of Birth
                </dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.date_of_birth
                    ? profileInfo.date_of_birth
                    : "Your Date of Birth"}
                </dd>

                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">Gender</dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.gender ? profileInfo.gender : "Your Gender"}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                  Nationality
                </dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.nationality
                    ? profileInfo.nationality
                    : "Your Nationality"}
                </dd>

                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">Category</dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.category
                    ? profileInfo.category
                    : "Your Category"}
                </dd>
              </div>
              <div className="bg-white px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                  Aadhaar Card Number
                </dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.aadhar_card_number
                    ? profileInfo.aadhar_card_number
                    : "Your Aadhar Card Number"}
                </dd>

                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                  Marital Status
                </dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.marital_status
                    ? profileInfo.marital_status
                    : "Your Marital Status"}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                  Belongs to PWD
                </dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.is_pwd ? profileInfo.is_pwd : "Your PWD Status"}
                </dd>
                <dt className="text-sm font-medium text-gray-500">
                  Student_Status
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profileInfo.status_student ? profileInfo.status_student : "Your Student Status"}
                </dd>
              </div>

              {profileInfo.category_certificate_url ? (
                <div className="bg-white px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                  <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                    Category Certificate
                  </dt>
                  <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                    <div className="mr-4 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <PaperClipIcon
                          className="flex-shrink-0 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span className="ml-2 flex-1 w-0 truncate">
                          Category_Certificate
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href={
                            profileInfo.category_certificate_url
                              ? profileInfo.category_certificate_url
                              : "#"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </dd>
                </div>
              ) : (
                ""
              )}
            </dl>
          </div>
        </div>
      </div>

      <div className="flex my-10 mx-20 md:px-20 mx-auto">
        <div className="my-2 flex-1 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="flex space-x-3 px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Communication Details
            </h3>

            <CommunicationDetails
              localProfileInfo={localProfileInfo}
              onChange={handleLocalChange}
              syncLocalGlobalData={syncLocalGlobalData}
            />
          </div>
          <div className="border-t border-gray-300">
            <dl>
              <div className="bg-gray-50 px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                  Address for communication
                </dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.communication_address
                    ? profileInfo.communication_address
                    : "Your Communication Address"}
                </dd>

                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">City</dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.communication_city
                    ? profileInfo.communication_city
                    : "Your City"}
                </dd>
              </div>
              <div className="bg-white px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">State</dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.communication_state
                    ? profileInfo.communication_state
                    : "Your State"}
                </dd>

                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">PIN Code</dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.communication_pincode
                    ? profileInfo.communication_pincode
                    : "Your Pincode"}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                  Permanent Address
                </dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.permanent_address
                    ? profileInfo.permanent_address
                    : "Your Permanent Address"}
                </dd>

                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">City</dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.permanent_city
                    ? profileInfo.permanent_city
                    : "Your City"}
                </dd>
              </div>
              <div className="bg-white px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">State</dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.permanent_state
                    ? profileInfo.permanent_state
                    : "Your State"}
                </dd>

                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">PIN Code</dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.permanent_pincode
                    ? profileInfo.permanent_pincode
                    : "Your Pincode"}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">Email</dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.email_id
                    ? profileInfo.email_id
                    : "Your Email ID"}
                </dd>

                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                  Mobile Number
                </dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.mobile_number
                    ? profileInfo.mobile_number
                    : "Your Mobile Number"}
                </dd>
              </div>

              {profileInfo.alternate_mobile_number && (
                <div className="bg-gray-50 px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                  <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                    Alternate Mobile Number
                  </dt>
                  <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                    {profileInfo.alternate_mobile_number
                      ? profileInfo.alternate_mobile_number
                      : "Your Mobile Number"}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      <div className="flex my-10 mx-20 md:px-20 mx-auto">
        <div className="my-2 flex-1 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="flex space-x-3 px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Education Details
            </h3>

            <EducationalDetails
              setPercentageCgpaPattern={setPercentageCgpaPattern}
              percentage_cgpa_pattern={percentage_cgpa_pattern}
              count={count}
              setCount={setCount}
              localDegrees={localDegrees}
              localProfileInfo={localProfileInfo}
              onChange={handleLocalChange}
              onChangeDegrees={handleLocalChangeDegrees}
              syncLocalGlobalData={syncLocalGlobalData}
              emptyFile={emptyFile}
              emptyFileDegree={emptyFileDegree}
              removeLocalDegree={removeLocalDegree}
            />
          </div>
          <div className="border-t border-gray-300">
            <dl className="py-3 border-t border-gray-200">
              <div className="bg-gray-50 px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">Degree</dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.degree_10th
                    ? profileInfo.degree_10th
                    : "Your 10th Degree"}
                </dd>

                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                  Board/University
                </dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.board_10th
                    ? profileInfo.board_10th
                    : "Your 10th Board"}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                  Percentage/CGPA
                </dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.percentage_cgpa_value_10th
                    ? profileInfo.percentage_cgpa_value_10th
                    : "Your Percentage/CGPA in 10th"}
                </dd>

                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                  Year of Passing
                </dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.year_of_passing_10th
                    ? profileInfo.year_of_passing_10th
                    : "Your Year of Passing of Class 10th"}
                </dd>
              </div>
              <div className="bg-white px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                  Attachments
                </dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  <div className="mr-4 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <PaperClipIcon
                        className="flex-shrink-0 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="ml-2 flex-1 w-0 truncate">
                        10th_marksheet
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href={
                          profileInfo.marksheet_10th_url
                            ? profileInfo.marksheet_10th_url
                            : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
          <div className="border-t border-gray-300">
            <dl className="py-3 border-t border-gray-200">
              <div className="bg-gray-50 px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">Degree</dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.degree_12th
                    ? profileInfo.degree_12th
                    : "Your 12th Degree"}
                </dd>

                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                  Board/University
                </dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.board_12th
                    ? profileInfo.board_12th
                    : "Your 12th Board"}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                  Percentage/CGPA
                </dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.percentage_cgpa_value_12th
                    ? profileInfo.percentage_cgpa_value_12th
                    : "Your Percentage/CGPA in 12th"}
                </dd>

                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                  Year of Passing
                </dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  {profileInfo.year_of_passing_12th
                    ? profileInfo.year_of_passing_12th
                    : "Your Year of Passing of Class 12th"}
                </dd>
              </div>
              <div className="bg-white px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                  Attachments
                </dt>
                <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                  <div className="pr-4 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <PaperClipIcon
                        className="flex-shrink-0 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="ml-2 flex-1 w-0 truncate">
                        12th_marksheet
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href={
                          profileInfo.marksheet_12th_url
                            ? profileInfo.marksheet_12th_url
                            : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
          <div className="border-t border-gray-300">
            <dl className="py-3 border-t border-gray-200">
              <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Degree</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {degrees[0]["1"] && degrees[0]["0"]
                  ? `${degrees[0]["1"]}, ${degrees[0]["0"]}`
                  : "Your B.Tech Degree"}
                </dd>

                <dt className="text-sm font-medium text-gray-500">
                  University/Institute
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {degrees[0]["2"]
                    ? degrees[0]["2"]
                    : "Your Branch"}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Percentage/CGPA
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {degrees[0]["5"]
                    ? degrees[0]["5"]
                    : "Your Percentage/CGPA in B.Tech"}
                </dd>

                <dt className="text-sm font-medium text-gray-500">
                  Year of Passing
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {degrees[0]["3"]
                    ? degrees[0]["3"]
                    : "Your Year of Completing B.Tech"}
                </dd>
              </div>
              <div className="bg-white px-4 py-3 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Attachments
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="pr-4 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <PaperClipIcon
                          className="flex-shrink-0 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span className="ml-2 flex-1 w-0 truncate">
                          Gradesheet
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href={degrees[0]["8"] ? degrees[0]["8"] : "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </dd>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="pr-4 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <PaperClipIcon
                          className="flex-shrink-0 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span className="ml-2 flex-1 w-0 truncate">Degree</span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href={degrees[0]["9"] ? degrees[0]["9"] : "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </dd>
                </div>
            </dl>
          </div>
          {degreeSize-1 > 0 && <div className="border-t border-gray-300">
            {[...Array(degreeSize-1)].map((_, i) => (
              <dl className="py-3 border-t border-gray-200" key={degrees[i].id}>
                <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Degree</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {degrees[i+1]["1"]}, {degrees[i+1]["0"]}
                  </dd>

                  <dt className="text-sm font-medium text-gray-500">
                    University/Institute
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {degrees[i+1]["2"]}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                  <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                    Percentage/CGPA
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {degrees[i+1]["5"]}
                  </dd>

                  <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                    Year of Passing
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {degrees[i+1]["3"]}
                  </dd>
                </div>
                <div className="bg-white px-4 py-3 lg:grid lg:grid-cols-6 sm:gap-4 sm:px-6">
                  <dt className=" whitespace-normal break-words text-sm font-medium text-gray-500">
                    Attachments
                  </dt>
                  <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                    <div className="pr-4 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <PaperClipIcon
                          className="flex-shrink-0 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span className="ml-2 flex-1 w-0 truncate">
                          Gradesheet
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href={degrees[i+1]["8"] ? degrees[i+1]["8"] : "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </dd>
                  <dd className=" whitespace-normal break-words mt-1 text-sm text-gray-900 sm:mt-0 lg:col-span-2">
                    <div className="pr-4 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <PaperClipIcon
                          className="flex-shrink-0 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span className="ml-2 flex-1 w-0 truncate">Degree</span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href={degrees[i+1]["9"] ? degrees[i+1]["9"] : "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </dd>
                </div>
              </dl>
            ))}
          </div>}
        </div>
      </div>
      <div className="flex mx-20 mt-2 mb-10 md:px-20">
        <div className="my-2 flex-1 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="flex space-x-3 px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Experience Details
            </h3>

            <ExperienceDetails
              count={count2}
              setCount={setCount2}
              localDegrees={localDegrees2}
              localProfileInfo={localProfileInfo}
              onChange={handleLocalChange}
              onChangeDegrees={handleLocalChangeDegrees2}
              syncLocalGlobalData={syncLocalGlobalData2}
              emptyFile={emptyFile}
              emptyFileDegree={emptyFileDegree2}
              removeLocalDegree={removeLocalDegree2}
            />
          </div>
          {degreeSize2 > 0 && (
            <div className="border-t border-gray-300">
              {[...Array(degreeSize2)].map((_, i) => (
                <dl
                  className="py-3 border-t border-gray-200"
                  key={degrees2[i].id}
                >
                  <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                    Company/Organization
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {degrees2[i]["0"]}
                    </dd>

                    <dt className="text-sm font-medium text-gray-500">
                    Title/Position
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {degrees2[i]["1"]}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Year of Completion
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {degrees2[i]["2"]}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-3 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Attachments
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <div className="pr-4 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <PaperClipIcon
                            className="flex-shrink-0 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="ml-2 flex-1 w-0 truncate">
                            Certificate
                          </span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <a
                            href={
                              degrees2[i]["8"] ? degrees2[i]["8"] : "#"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            View
                          </a>
                        </div>
                      </div>
                    </dd>
                  </div>
                </dl>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
