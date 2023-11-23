import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import "./AppLayout.css";
import AuthContextProvider from "../Providers/AuthContextProvider";
import { useState } from "react";
import SearchPage from "../../pages/Search";

function AppLayout() {
  const [search, setSearch] = useState("");
  return (
    <AuthContextProvider>
      <main>
        <Sidebar search={search} setSearch={setSearch} />
        <section>
          {search ? <SearchPage search={search} /> : <Outlet />}
        </section>
      </main>
    </AuthContextProvider>
  );
}

export default AppLayout;
