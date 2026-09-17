function Sidebar({ setPage }) {
    return (
        <div style={{
            width: "240px",
            minHeight: "100vh",
            borderRight: "1px solid #ccc",
            padding: "20px",
            boxSizing: "border-box"
        }}>

            <h2>Medical Operations</h2>

            <hr />

            <button onClick={() => setPage("dashboard")}>
                🏠 Dashboard
            </button>

            <br /><br />

            <button onClick={() => setPage("patients")}>
                👤 Patients
            </button>

            <br /><br />

            <button onClick={() => setPage("staff")}>
                👨‍⚕️ Doctors & Staff
            </button>

            <br /><br />

            <button onClick={() => setPage("billing")}>
                💰 Billing & Revenue
            </button>

            <br /><br />

            <button onClick={() => setPage("claims")}>
                🛡️ Insurance & Claims
            </button>

            <br /><br />

            <button onClick={() => setPage("pharmacy")}>
                💊 Pharmacy
            </button>

            <br /><br />

            <button onClick={() => setPage("laboratory")}>
                🧪 Laboratory
            </button>

            <br /><br />

            <button onClick={() => setPage("emergency")}>
                🚨 Emergency
            </button>

            <br /><br />

            <button onClick={() => setPage("quality")}>
                ⭐ Quality & Compliance
            </button>

            <br /><br />

            <button onClick={() => setPage("experience")}>
                😊 Patient Experience
            </button>

            <br /><br />

            <button onClick={() => setPage("supply")}>
                📦 Supply Chain
            </button>

            <br /><br />

            <button onClick={() => setPage("financial")}>
                📊 Financial Intelligence
            </button>

            <br /><br />

            <button onClick={() => setPage("ai")}>
                🤖 AI Intelligence
            </button>

            <br /><br />

            <button onClick={() => setPage("automation")}>
                ⚙️ Automation
            </button>

        </div>
    );
}

export default Sidebar;