import React, { useState, useEffect, Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import iit_ropar_logo_clear from "../../images/iit-ropar-logo-clear.png";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import axios from "axios";
import { getToken } from "../SignIn_SignUp/Sessions";
import { useNavigate } from "react-router-dom";
import DefaultProfilePicture from "../../images/default-profile-picture.svg";
import { Link } from "react-router-dom";

const navigation = [
  { name: "Home", to: "/home", id: 1 },
  { name: "My Applications", to: "/my-applications", id: 2 },
  { name: "My Profile", to: "/my-profile", id: 3 },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function DashboardNavBar(props) {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    axios
      .get("/get-user-info", {
        headers: {
          Authorization: getToken(),
        },
      })
      .then((response) => {
        if (response.data === 1) {
          navigate("/logout");
        } else {
          setUser(response.data);
        }
      })
      .catch((err) => console.log(err));
  }, [navigate]);

  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-12 w-12"
                      src={iit_ropar_logo_clear}
                      alt="IIT Ropar logo"
                    />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      <Link
                        key="Home"
                        to="/home"
                        className={classNames(
                          0 === props.currentFlag
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                        aria-current={
                          0 === props.currentFlag ? "page" : undefined
                        }
                      >
                        Home
                      </Link>

                      <Link
                        key="My Applications"
                        to="/my-applications"
                        className={classNames(
                          1 === props.currentFlag
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                        aria-current={
                          1 === props.currentFlag ? "page" : undefined
                        }
                      >
                        My Applications
                      </Link>

                      <Link
                        key="My Profile"
                        to="/my-profile"
                        className={classNames(
                          2 === props.currentFlag
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                        aria-current={
                          2 === props.currentFlag ? "page" : undefined
                        }
                      >
                        My Profile
                      </Link>

                      
                    </div>
                  </div>
                </div>

                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                      <div>
                        <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full bg-white"
                            src={
                              user.profile_image_url
                                ? user.profile_image_url
                                : DefaultProfilePicture
                            }
                            alt=""
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <Disclosure.Button
                                as="a"
                                href="logout"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Sign out
                              </Disclosure.Button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>

                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <table>
                  <tbody>
                    {navigation.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <Link to={item.to}>
                            <Disclosure.Button
                              key={item.name}
                              className={classNames(
                                item.current
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                "block px-3 py-2 rounded-md text-base font-medium"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                            </Disclosure.Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full bg-white"
                      src={
                        user.profile_image_url
                          ? user.profile_image_url
                          : DefaultProfilePicture
                      }
                      alt=""
                    />
                  </div>
                  <div className="ml-3 items-center">
                    <div className="text-base mb-1 font-medium leading-none text-white">
                      {user.full_name}
                    </div>
                    <div className="text-sm font-medium leading-none text-gray-400">
                      {user.email_id}
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Disclosure.Button
                    as="a"
                    href="logout"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}

export default DashboardNavBar;
