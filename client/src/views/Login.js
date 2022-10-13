import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import http from "../libs/http";
import "./Login.css";

export default function Login({ setToken }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { data } = await http.post("/api/auth/login", { email, password });
      setToken(data.token);
      navigate("/");
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  return (
    <div className="login">
      <form className="card" onSubmit={handleSubmit}>
        <h3>Login</h3>

        <TextInput
          label="Email"
          type="email"
          pattern=".+@globex\.com"
          onChange={(e) => setEmail(e.target.value)}
          required={true}
        ></TextInput>
        <TextInput
          label="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required={true}
        ></TextInput>
        <Button type="submit" color="secondary" label="Login" />
        {<p>{error}</p>}
      </form>
    </div>
  );
}
