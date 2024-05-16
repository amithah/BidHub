import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./feature/auth/authSlice";
import { useNavigate } from "react-router-dom";

export function Home() {
  const { isAuthenticated ,user} = useSelector((state) => state.auth);


  return (
    <>
      Welcome
   
    </>
  );
}
