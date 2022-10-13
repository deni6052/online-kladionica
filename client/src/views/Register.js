import React, { useState } from "react";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import http from "../libs/http";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [fullName, setFullName] = useState();

  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await http.post("/api/auth/register", {
        email,
        password,
        fullName,
      });
      navigate("/login");
      setError("");
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  return (
    <div className="login">
      <form className="card" onSubmit={handleSubmit}>
        <h3>Register </h3>
        <TextInput
          label="Full name"
          type="text"
          onChange={(e) => setFullName(e.target.value)}
          required={true}
        ></TextInput>
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
