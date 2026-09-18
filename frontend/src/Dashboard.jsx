import { useEffect, useState } from "react";

function Dashboard() {

    const [patients, setPatients] = useState([]);
    const [staff, setStaff] = useState([]);
    const [bills, setBills] = useState([]);
    const [claims, setClaims] = useState([]);

    useEffect(() => {

        fetch("http://localhost:5000/api/patients")
            .then((response) => response.json())
            .then((data) => {
                setPatients(data);
            })
            .catch((error) => {
                console.log("Patient error:", error);
            });


        fetch("http://localhost:5000/api/staff")
            .then((response) => response.json())
            .then((data) => {
                setStaff(data);
            })
            .catch((error) => {
                console.log("Staff error:", error);
            });


        fetch("http://localhost:5000/api/billing")
            .then((response) => response.json())
            .then((data) => {
                setBills(data);
            })
            .catch((error) => {
                console.log("Billing error:", error);
            });


        fetch("http://localhost:5000/api/claims")
            .then((response) => response.json())
            .then((data) => {
                setClaims(data);
            })
            .catch((error) => {
                console.log("Claims error:", error);
            });

    }, []);


    // PATIENT CALCULATIONS

    const totalPatients = patients.length;

    const malePatients = patients.filter(
        (patient) =>
            patient.gender &&
            patient.gender.toLowerCase() === "male"
    ).length;

    const femalePatients = patients.filter(
        (patient) =>
            patient.gender &&
            patient.gender.toLowerCase() === "female"
    ).length;


    const departments = [
        ...new Set(
            patients.map(
                (patient) => patient.department
            )
        )
    ];

    const allDepartments = [
    ...new Set([
        ...patients.map(
            (patient) => patient.department
        ),
        ...staff.map(
            (member) => member.department
        )
    ])
];


    // BILLING CALCULATIONS

    const totalBills = bills.length;

    const totalRevenue = bills.reduce(
        (sum, bill) =>
            sum + Number(
                bill.paidAmount || 0
            ),
        0
    );


    const totalBilled = bills.reduce(
        (sum, bill) =>
            sum + Number(
                bill.amount || 0
            ),
        0
    );


    const outstandingAmount =
        totalBilled - totalRevenue;


    // CLAIM CALCULATIONS

    const totalClaims = claims.length;

    const approvedClaims = claims.filter(
        (claim) =>
            claim.claimStatus === "Approved"
    ).length;


    const deniedClaims = claims.filter(
        (claim) =>
            claim.claimStatus === "Denied"
    ).length;

    // OPERATIONAL HEALTH SCORE

let operationalHealthScore = 100;

if (totalPatients > 0) {
    operationalHealthScore -= 10;
}

if (staff.length === 0) {
    operationalHealthScore -= 20;
}

if (deniedClaims > 0) {
    operationalHealthScore -= 10;
}

if (outstandingAmount > 0) {
    operationalHealthScore -= 10;
}

if (operationalHealthScore < 0) {
    operationalHealthScore = 0;
}


    return (

        <div style={{
            padding: "30px",
            fontFamily: "Arial"
        }}>


            {/* HEADER */}

            <h1>
                Medical Operations Intelligence Dashboard
            </h1>

            <p>
                Executive Command Center
            </p>

            <hr />


            {/* MAIN KPI CARDS */}

            <div style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                marginTop: "30px"
            }}>


                {/* PATIENTS */}

                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "200px",
                    borderRadius: "10px"
                }}>

                    <h3>
                        Total Patients
                    </h3>

                    <h1>
                        {totalPatients}
                    </h1>

                </div>


                {/* STAFF */}

                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "200px",
                    borderRadius: "10px"
                }}>

                    <h3>
                        Total Staff
                    </h3>

                    <h1>
                        {staff.length}
                    </h1>

                </div>


                {/* BILLS */}

                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "200px",
                    borderRadius: "10px"
                }}>

                    <h3>
                        Total Bills
                    </h3>

                    <h1>
                        {totalBills}
                    </h1>

                </div>


                {/* CLAIMS */}

                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "200px",
                    borderRadius: "10px"
                }}>

                    <h3>
                        Total Claims
                    </h3>

                    <h1>
                        {totalClaims}
                    </h1>

                </div>

            </div>

            {/* OPERATIONAL HEALTH */}

<div style={{
    marginTop: "30px",
    border: "1px solid #ccc",
    padding: "25px",
    borderRadius: "10px"
}}>

    <h2>
        Operational Health Score
    </h2>

    <h1>
        {operationalHealthScore}/100
    </h1>

    <p>
        Based on current patient, staff,
        billing and claims information.
    </p>

</div>


            {/* REVENUE KPI CARDS */}

            <div style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                marginTop: "25px"
            }}>


                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "250px",
                    borderRadius: "10px"
                }}>

                    <h3>
                        Total Revenue
                    </h3>

                    <h1>
                        ₹{totalRevenue.toLocaleString()}
                    </h1>

                </div>


                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "250px",
                    borderRadius: "10px"
                }}>

                    <h3>
                        Outstanding Amount
                    </h3>

                    <h1>
                        ₹{outstandingAmount.toLocaleString()}
                    </h1>

                </div>


                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "250px",
                    borderRadius: "10px"
                }}>

                    <h3>
                        Approved Claims
                    </h3>

                    <h1>
                        {approvedClaims}
                    </h1>

                </div>


                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "250px",
                    borderRadius: "10px"
                }}>

                    <h3>
                        Denied Claims
                    </h3>

                    <h1>
                        {deniedClaims}
                    </h1>

                </div>

            </div>


            {/* PATIENT OVERVIEW */}

            <div style={{
                marginTop: "40px"
            }}>

                <h2>
                    Patient Overview
                </h2>

                <table
                    border="1"
                    cellPadding="12"
                    width="100%"
                >

                    <thead>

                        <tr>

                            <th>
                                Metric
                            </th>

                            <th>
                                Value
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td>
                                Total Patients
                            </td>

                            <td>
                                {totalPatients}
                            </td>

                        </tr>

                        <tr>

                            <td>
                                Male Patients
                            </td>

                            <td>
                                {malePatients}
                            </td>

                        </tr>

                        <tr>

                            <td>
                                Female Patients
                            </td>

                            <td>
                                {femalePatients}
                            </td>

                        </tr>

                        <tr>

                            <td>
                                Departments
                            </td>

                            <td>
                                {departments.length}
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>


            {/* OPERATIONAL OVERVIEW */}

            <div style={{
                marginTop: "40px"
            }}>

                <h2>
                    Operational Overview
                </h2>

                <table
                    border="1"
                    cellPadding="12"
                    width="100%"
                >

                    <thead>

                        <tr>

                            <th>
                                Metric
                            </th>

                            <th>
                                Value
                            </th>

                            <th>
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td>
                                Patient Volume
                            </td>

                            <td>
                                {totalPatients}
                            </td>

                            <td>
                                Monitoring
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Staff Count
                            </td>

                            <td>
                                {staff.length}
                            </td>

                            <td>
                                Monitoring
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Billing Records
                            </td>

                            <td>
                                {totalBills}
                            </td>

                            <td>
                                Monitoring
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Insurance Claims
                            </td>

                            <td>
                                {totalClaims}
                            </td>

                            <td>
                                Monitoring
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>


            {/* DEPARTMENT INTELLIGENCE */}

<div style={{
    marginTop: "40px"
}}>

    <h2>
        Department Intelligence
    </h2>

    <table
        border="1"
        cellPadding="12"
        width="100%"
    >

        <thead>

            <tr>

                <th>
                    Department
                </th>

                <th>
                    Patients
                </th>

                <th>
                    Staff
                </th>

                <th>
                    Patient Percentage
                </th>

            </tr>

        </thead>

        <tbody>

            {allDepartments.map(
                (department) => {

                    const patientCount =
                        patients.filter(
                            (patient) =>
                                patient.department === department
                        ).length;

                    const staffCount =
                        staff.filter(
                            (member) =>
                                member.department === department
                        ).length;

                    const percentage =
                        totalPatients > 0
                            ? (
                                patientCount /
                                totalPatients
                            ) * 100
                            : 0;

                    return (

                        <tr key={department}>

                            <td>
                                <strong>
                                    {department}
                                </strong>
                            </td>

                            <td>
                                {patientCount}
                            </td>

                            <td>
                                {staffCount}
                            </td>

                            <td>
                                {percentage.toFixed(1)}%
                            </td>

                        </tr>

                    );

                }
            )}

        </tbody>

    </table>

</div>


            {/* EXECUTIVE SUMMARY */}

            <div style={{
                marginTop: "40px",
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "10px"
            }}>

                <h2>
                    Executive Summary
                </h2>

                <p>
                    The dashboard currently monitors
                    patient volume, staff availability,
                    billing activity and insurance claims.
                </p>

                <p>
                    Total patient records:
                    {" "}
                    <strong>{totalPatients}</strong>
                </p>

                <p>
                    Total staff records:
                    {" "}
                    <strong>{staff.length}</strong>
                </p>

                <p>
                    Total revenue collected:
                    {" "}
                    <strong>
                        ₹{totalRevenue.toLocaleString()}
                    </strong>
                </p>

                <p>
                    Outstanding amount:
                    {" "}
                    <strong>
                        ₹{outstandingAmount.toLocaleString()}
                    </strong>
                </p>

            </div>


            {/* EXECUTIVE ALERTS */}

<div style={{
    marginTop: "40px",
    border: "1px solid #ccc",
    padding: "20px",
    borderRadius: "10px"
}}>

    <h2>
        Executive Alerts
    </h2>

    {totalPatients === 0 && (
        <p>
            ⚠️ No patient records available.
        </p>
    )}

    {staff.length === 0 && (
        <p>
            ⚠️ No staff records available.
        </p>
    )}

    {outstandingAmount > 0 && (
        <p>
            ⚠️ Outstanding billing amount:
            {" "}
            <strong>
                ₹{outstandingAmount.toLocaleString()}
            </strong>
        </p>
    )}

    {deniedClaims > 0 && (
        <p>
            ⚠️ {deniedClaims} insurance claim(s)
            require attention.
        </p>
    )}

    {totalPatients > 0 &&
        staff.length > 0 &&
        outstandingAmount === 0 &&
        deniedClaims === 0 && (
            <p>
                ✅ Current operational indicators
                are within the monitored range.
            </p>
        )
    }

</div>

        </div>

    );
}

export default Dashboard;