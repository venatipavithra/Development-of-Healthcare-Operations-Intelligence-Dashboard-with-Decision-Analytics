import { useEffect, useState } from "react";

function Dashboard() {

    const [patients, setPatients] = useState([]);

    useEffect(() => {

        fetch("http://localhost:5000/api/patients")
            .then((response) => response.json())
            .then((data) => {
                setPatients(data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);

    const totalPatients = patients.length;

    const malePatients = patients.filter(
        (patient) =>
            patient.gender.toLowerCase() === "male"
    ).length;

    const femalePatients = patients.filter(
        (patient) =>
            patient.gender.toLowerCase() === "female"
    ).length;

    const departments = [
        ...new Set(
            patients.map(
                (patient) => patient.department
            )
        )
    ];

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

            {/* KPI CARDS */}

            <div style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                marginTop: "30px"
            }}>

                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "200px",
                    borderRadius: "10px"
                }}>

                    <h3>Total Patients</h3>

                    <h1>
                        {totalPatients}
                    </h1>

                </div>


                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "200px",
                    borderRadius: "10px"
                }}>

                    <h3>Male Patients</h3>

                    <h1>
                        {malePatients}
                    </h1>

                </div>


                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "200px",
                    borderRadius: "10px"
                }}>

                    <h3>Female Patients</h3>

                    <h1>
                        {femalePatients}
                    </h1>

                </div>


                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "200px",
                    borderRadius: "10px"
                }}>

                    <h3>Departments</h3>

                    <h1>
                        {departments.length}
                    </h1>

                </div>

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
                            <th>Metric</th>
                            <th>Value</th>
                            <th>Status</th>
                        </tr>

                    </thead>

                    <tbody>

                        <tr>
                            <td>Patient Volume</td>
                            <td>{totalPatients}</td>
                            <td>Normal</td>
                        </tr>

                        <tr>
                            <td>Appointments</td>
                            <td>0</td>
                            <td>Monitoring</td>
                        </tr>

                        <tr>
                            <td>Bed Utilization</td>
                            <td>0%</td>
                            <td>Monitoring</td>
                        </tr>

                        <tr>
                            <td>Staff Utilization</td>
                            <td>0%</td>
                            <td>Monitoring</td>
                        </tr>

                    </tbody>

                </table>

            </div>


            {/* DEPARTMENT PERFORMANCE */}

            <div style={{
                marginTop: "40px"
            }}>

                <h2>
                    Department Performance
                </h2>

                {departments.map(
                    (department) => {

                        const count =
                            patients.filter(
                                (patient) =>
                                    patient.department === department
                            ).length;

                        const percentage =
                            totalPatients > 0
                                ? (count / totalPatients) * 100
                                : 0;

                        return (

                            <div
                                key={department}
                                style={{
                                    marginBottom: "20px"
                                }}
                            >

                                <strong>
                                    {department}
                                </strong>

                                <span style={{
                                    marginLeft: "20px"
                                }}>
                                    {count} patients
                                </span>

                                <div style={{
                                    width: "100%",
                                    height: "20px",
                                    border: "1px solid #ccc",
                                    marginTop: "8px"
                                }}>

                                    <div style={{
                                        width: `${percentage}%`,
                                        height: "100%",
                                        backgroundColor: "steelblue"
                                    }}>
                                    </div>

                                </div>

                            </div>

                        );

                    }
                )}

            </div>


            {/* ALERTS */}

            <div style={{
                marginTop: "40px"
            }}>

                <h2>
                    Operational Alerts
                </h2>

                <ul>

                    <li>
                        Patient volume monitoring active
                    </li>

                    <li>
                        Bed utilization monitoring active
                    </li>

                    <li>
                        Staff utilization monitoring active
                    </li>

                    <li>
                        Revenue monitoring active
                    </li>

                </ul>

            </div>

        </div>
    );
}

export default Dashboard;