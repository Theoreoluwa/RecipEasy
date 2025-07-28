import React, { useEffect, useState } from "react";
import "../Login/Login.scss";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useRegisterMutation } from "../../redux/features/api/auth";

const Register = () => {
  const [passwordShow, setPasswordShow] = useState(false);
  const [passwordConfirmShow, setPasswordConfirmShow] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [signUp, { isLoading, error, data, isSuccess }] = useRegisterMutation();

  React.useEffect(() => {
    if (error)
      toast.error(
        String(
          error?.data?.errorMessage ||
            error?.message ||
            "Login: An error occurred"
        )
      );
  }, [error]);

  React.useEffect(() => {
    if (isSuccess && data) {
      toast.success("User Registered Successfully!");
      navigate("/login");
    }
  }, [isSuccess, navigate, data]);

  const setProfile = (e) => {
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    if (image) {
      setPreview(URL.createObjectURL(image));
    }
  }, [image]);

  const handleSumbit = (e) => {
    e.preventDefault();

    if (isLoading) return;

    const { username, email, password, confirmpassword } = form;

    if (username === "") {
      toast.error("Username is required");
    } else if (email === "") {
      toast.error("Email is required");
    } else if (!email.includes("@")) {
      toast.error("Please enter a valid Email");
    } else if (image === "") {
      toast.error("Please upload a profile picture");
    } else if (password === "") {
      toast.error("Password is required");
    } else if (confirmpassword === "") {
      toast.error("Confirm Password is required");
    } else if (password !== confirmpassword) {
      toast.error("Passwords do not match!");
    } else {
      const data = new FormData();
      data.append("username", username);
      data.append("userprofile", image);
      data.append("email", email);
      data.append("password", password);
      data.append("confirmpassword", confirmpassword);

      signUp(data);
    }
  };
  return (
    <>
      <section>
        <div className="form-data glass-effect">
          <div className="form-heading">
            <h2>Sign up to RecipeEasy!</h2>
          </div>

          <div className="profile_div text-center">
            <img
              src={preview ? preview : "/Recipeasy-logo.png"}
              alt=""
              style={{ width: "90px" }}
            />
          </div>

          <form>
            <div className="form_input">
              <input
                type="text"
                name="username"
                onChange={handleChange}
                id=""
                placeholder="Enter Your UserName"
              />
            </div>

            <div className="form_input">
              <input
                type="email"
                name="email"
                onChange={handleChange}
                id=""
                placeholder="Enter your email address"
              />
            </div>

            <div className="form_input">
              <input
                type="file"
                name="userprofile"
                onChange={setProfile}
                id=""
                accept=".jpeg,.jpg,.png"
              />
            </div>

            <div className="form_input">
              <div className="two">
                <input
                  type={!passwordShow ? "password" : "text"}
                  name="password"
                  onChange={handleChange}
                  id=""
                  placeholder="Enter Your password"
                />
                <div
                  className="showpass"
                  onClick={() => setPasswordShow(!passwordShow)}
                >
                  {!passwordShow ? "Show" : "Hide"}
                </div>
              </div>
            </div>

            <div className="form_input">
              <div className="two">
                <input
                  type={!passwordConfirmShow ? "password" : "text"}
                  name="confirmpassword"
                  onChange={handleChange}
                  id=""
                  placeholder="Confirm Password"
                />
                <div
                  className="showpass"
                  onClick={() => setPasswordConfirmShow(!passwordConfirmShow)}
                >
                  {!passwordConfirmShow ? "Show" : "Hide"}
                </div>
              </div>
            </div>

            <button className="btn" disabled={isLoading} onClick={handleSumbit}>
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
            <p>
              Already have an account? <NavLink to={"/login"}>Log In</NavLink>
            </p>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
