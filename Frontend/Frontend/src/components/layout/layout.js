import React, { useState } from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import Sidebar from "../sidebar/sidebar";

function Layout({ children }) {
  const [open, setOpen] = useState(true);

  const toggleSidebar = () => {
    setOpen(!open);
    // setOpen((prevOpen) => !prevOpen);
  };

  return (
    <div
      className={open ? "main-div" : ""}
      style={{
        transition: !open
          ? "padding-left 0.3s ease-in-out"
          : "padding-left 0.3s ease-in-out",
      }}
    >
      <Sidebar open={open} toggleSidebar={toggleSidebar} />
      <Header open={open} toggleSidebar={toggleSidebar} />
      {children}
      <Footer open={open} />
    </div>
  );
}

export default Layout;
