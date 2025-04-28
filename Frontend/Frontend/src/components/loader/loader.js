import React from "react";
import "./loader.css";
import { MoonLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="loading-screen">
      <MoonLoader color="#16f1f5" loading={true} height={15} width={5} />
    </div>
  );
};

export default Loader;
