import { useState } from "react";

import Dashboard from "./Dashboard";
import Patient from "./Patient";
import Staff from "./Staff";
import Billing from "./Billing";
import Sidebar from "./Sidebar";

function App() {

    const [page, setPage] = useState("dashboard");

    const renderPage = () => {

        if (page === "dashboard") {
            return <Dashboard />;
        }

        if (page === "patients") {
            return <Patient />;
        }

        if (page === "staff") {
            return <Staff />;
        }

        if (page === "billing") {
             return <Billing />;
        }

        return (
            <div style={{ padding: "30px" }}>
                <h1>Module Coming Soon</h1>
                <p>
                    This module will be developed in the next development day.
                </p>
            </div>
        );
    };

    return (

        <div style={{
            display: "flex",
            minHeight: "100vh"
        }}>

            <Sidebar setPage={setPage} />

            <div style={{
                flex: 1,
                padding: "20px"
            }}>
                {renderPage()}
            </div>

        </div>

    );
}

export default App;