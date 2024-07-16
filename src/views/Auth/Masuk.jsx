import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { PiEyeSlashLight, PiEyeLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Masuk = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (values) => {
    try {
      await axios.post("http://localhost:5000/api/auth/login", values, {
        withCredentials: true,
      });

      navigate("/admin");
    } catch (error) {
      toast.error(error.response.data.msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const { handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit,
  });

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-96">
        <Card>
          <div className="flex justify-center items-center gap-3 mt-4">
            <img src="/logo.png" alt="logo" className="w-[50px]" />
            <div>
              <Typography variant="h6" color="gray">
                Desa Citeureup Admin
              </Typography>
              <Typography variant="h6" color="gray">
                Silahkan Masuk
              </Typography>
            </div>
          </div>
          <CardHeader floated={false}>
            <img src="/img/pattern1.png" alt="pattern" />
          </CardHeader>
          <CardBody>
            <div className="flex flex-col">
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Username"
                  color="deep-purple"
                  name="username"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  color="deep-purple"
                  icon={
                    <div
                      onClick={toggleShowPassword}
                      className="cursor-pointer"
                    >
                      {showPassword ? <PiEyeLight /> : <PiEyeSlashLight />}
                    </div>
                  }
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="flex gap-5">
                  <Button
                    type="submit"
                    variant="gradient"
                    fullWidth
                    color="deep-purple"
                  >
                    Masuk
                  </Button>
                </div>
              </form>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Masuk;
