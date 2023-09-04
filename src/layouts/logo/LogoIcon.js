import React from "react";
import { Link } from "@mui/material";
//import Logo from "/static/images/SOGEM.jpg";

const LogoIcon = () => {
  return (
    <Link href="/">
      <img src='/static/images/SOGEM.jpg' alt="Logo"/>
    </Link>
  );
};

//<Image src=
//width={219}
//height={231}
//alt="Picture of the author"
//unoptimized
///>

export default LogoIcon;
