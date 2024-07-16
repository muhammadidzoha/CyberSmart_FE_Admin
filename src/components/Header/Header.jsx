import {
  Avatar,
  Breadcrumbs,
  Card,
  CardBody,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Navbar,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Header = ({ currentRoute, username }) => {
  const navigate = useNavigate();

  const Logout = async () => {
    try {
      await axios.delete("http://localhost:5000/api/auth/logout", {
        withCredentials: true,
      });
      navigate("/auth/masuk");
    } catch (error) {
      console.log(error.response);
    }
  };

  const getPathnames = () => {
    const pathnames = location.pathname
      .split("/")
      .filter((pathname) => pathname !== "");
    const filteredPathnames = pathnames
      .filter((pathname) => pathname.toLowerCase() !== "admin")
      .map((pathname) => pathname.replace(/-/g, " ")); // Mengganti semua '-' dengan spasi
    return filteredPathnames;
  };

  return (
    <Navbar
      fullWidth
      className="sticky top-0 z-[900] flex items-center justify-between bg-white/10"
    >
      <div>
        <Breadcrumbs className="bg-transparent p-0">
          <Typography variant="small" color="gray">
            Pages
          </Typography>
          {/* <Typography variant="small" color="gray">
            {currentRoute}
          </Typography> */}
          {getPathnames().map((pathname, index) => (
            <Typography
              key={index}
              variant="small"
              color="gray"
              className="capitalize"
            >
              {pathname}
            </Typography>
          ))}
        </Breadcrumbs>
        <Typography variant="h4" color="gray" className="capitalize">
          {getPathnames().length > 0
            ? getPathnames()[getPathnames().length - 1]
            : currentRoute}
        </Typography>
      </div>
      <div>
        <div className="w-96">
          <Card shadow={false} className="rounded-full">
            <CardBody className="flex items-center justify-between !p-4">
              <div className="w-72">
                <Input
                  label="Cari"
                  color="deep-purple"
                  containerProps={{
                    className: "bg-lightPrimary",
                  }}
                />
              </div>
              <Menu placement="bottom-end">
                <MenuHandler>
                  <Avatar
                    size="sm"
                    src="https://docs.material-tailwind.com/img/face-2.jpg"
                    alt="avatar"
                    className="cursor-pointer"
                  />
                </MenuHandler>
                <MenuList className="flex flex-col space-y-2">
                  <MenuItem className="cursor-text">
                    <Typography variant="small" color="gray">
                      Hai, {username}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={Logout}>
                    <Typography variant="small" color="gray">
                      Logout
                    </Typography>
                  </MenuItem>
                </MenuList>
              </Menu>
            </CardBody>
          </Card>
        </div>
      </div>
    </Navbar>
  );
};

Header.propTypes = {
  currentRoute: PropTypes.string,
  username: PropTypes.string,
};

export default Header;
