import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";

import { initializeCurrentUser } from "./reducers/currentUserReducer";

import Home from "./pages/Home";
import UsersPage from "./pages/Users";
import UserDetailPage from "./pages/UserDetail";
import BlogDetailPage from "./pages/BlogDetail";

import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Navigation from "./components/Navigation";
import { Container } from "@mui/material";

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.currentUser);

  useEffect(() => {
    dispatch(initializeCurrentUser());
  }, []);

  if (!user) {
    return <LoginForm />;
  }

  return (
    <>
      <Navigation />
      <Notification />
      <Container maxWidth="md">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
