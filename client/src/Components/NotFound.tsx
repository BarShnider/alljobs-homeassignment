// NotFound.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const NotFound: React.FC = () => {
  const navigate = useNavigate();


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "0.2rem" }}>404</h1>
      <h5 style={{ fontSize: "1.4rem", marginBottom: "0.2rem", marginTop:"0.6rem" }}>Somthing went wrong :(</h5>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to={"/orders"}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        style={{ marginBottom: "1rem" }}
        >
        Go Back To Orders
      </Button>
        </Link>

    </div>
  );
};

export default NotFound;