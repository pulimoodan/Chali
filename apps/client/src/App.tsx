import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";
import AppLayout from "./components/Layouts/AppLayout";
import {
  HomePage,
  CreatePage,
  ProfilePage,
  SettingsPage,
  NotificationsPage,
  PostPage,
  SignInPage,
  FollowingPage,
  BookmarksPage,
  TrendingPage,
} from "./pages";
import AuthLayout from "./components/Layouts/AuthLayout";
import ChatPage from "./pages/Chat";
import UIContextProvider from "./components/Providers/UIContextProvider";
import SignUpPage from "./pages/SignUp";
import VerifyPage from "./pages/Verify";
import CompletePage from "./pages/Complete";

function App() {
  useEffect(() => {
    try {
      const theme = localStorage.getItem("theme");
      if (theme == "dark") {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    } catch (_error) {}
  }, []);

  return (
    <BrowserRouter>
      <UIContextProvider>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signup/completed" element={<CompletePage />} />
            <Route path="/verify/:id" element={<VerifyPage />} />
          </Route>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/following" element={<FollowingPage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Route>
        </Routes>
      </UIContextProvider>
    </BrowserRouter>
  );
}

export default App;
