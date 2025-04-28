import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = (props) => {
  const { Components } = props;

  return (
    <>
      <Components />
    </>
  );
};

export default ProtectedRoutes;
