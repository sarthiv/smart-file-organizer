import { useState } from "react";
import Activity from "./components/activity/Activity";
import Layout from "./components/layouts/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import Organizer from "./components/organizer/Organizer";
import Duplicates from "./components/duplicates/Duplicates";
import DateOrganizer from "./components/dateOrganizer/DateOrganizer";
import RuleManager from "./components/rules/RuleManager";
import Settings from "./components/settings/Settings";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;

      case "Organizer":
        return <Organizer />;

      case "Duplicates":
        return <Duplicates />;

      case "Date Organizer":
        return <DateOrganizer />;

      case "Activity":
        return <Activity />;
      case "Rules":
        return <RuleManager />;

      case "Settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout
      activePage={activePage}
      onNavigate={setActivePage}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;