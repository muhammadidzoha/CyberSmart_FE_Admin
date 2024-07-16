import React, { useEffect, useState } from "react";
import routes from "../routes/routes";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getRoutes = (routes) => {
    return routes.map((prop) => {
      if (prop.layout === "/admin") {
        if (prop.subRoutes) {
          return prop.subRoutes.map((route) => (
            <Route
              path={`/${prop.path}/${route.path}`}
              element={route.component}
              key={route.id}
            />
          ));
        } else {
          return (
            <Route
              path={`/${prop.path}`}
              element={prop.component}
              key={prop.id}
            />
          );
        }
      } else {
        return null;
      }
    });
  };

  useEffect(() => {
    reToken();
  }, []);

  const reToken = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/retoken",
        {
          withCredentials: true,
        }
      );
      const decoded = jwtDecode(response.data.accessToken);
      setUsername(decoded.username);
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error.response);
      navigate("/auth/masuk");
    }
  };

  return (
    <div className="flex">
      <div className="basis-2/12">
        <Sidebar isLoggedIn={isLoggedIn} />
      </div>
      <div className="basis-full 2xl:ml-[116px] 3xl:ml-[53px] overflow-x-auto">
        <div className="flex flex-col justify-between min-h-screen">
          <div>
            <Header username={username} />
            <div className="p-4">
              <Routes>
                {getRoutes(routes)}
                <Route
                  path="/"
                  element={<Navigate to="/admin/dashboard" replace />}
                />
              </Routes>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
