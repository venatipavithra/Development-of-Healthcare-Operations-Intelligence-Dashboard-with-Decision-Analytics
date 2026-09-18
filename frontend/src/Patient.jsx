import { useEffect, useState } from "react";

function Patient() {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    department: "",
    visitType: "OPD",
    admissionStatus: "Outpatient",
    waitingTime: 0,
    appointmentStatus: "Scheduled",
    lengthOfStay: 0
});

    const [editId, setEditId] = useState(null);

    // Get patients
    const fetchPatients = () => {
        fetch("http://localhost:5000/api/patients")
            .then((response) => response.json())
            .then((data) => setPatients(data))
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    // Handle input
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    // Add / Update patient
    const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("Form submitted");
    console.log("Patient data:", formData);

    try {
        let url = "http://localhost:5000/api/patients";
        let method = "POST";

        if (editId) {
            url = `http://localhost:5000/api/patients/${editId}`;
            method = "PUT";
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
    ...formData,
    age: Number(formData.age),
    waitingTime: Number(formData.waitingTime),
    lengthOfStay: Number(formData.lengthOfStay)
})
        });

        const data = await response.json();

        console.log("Backend response:", data);

        if (response.ok) {
            alert(
                editId
                    ? "Patient updated successfully!"
                    : "Patient added successfully!"
            );

            setFormData({
    name: "",
    age: "",
    gender: "",
    phone: "",
    department: "",
    visitType: "OPD",
    admissionStatus: "Outpatient",
    waitingTime: 0,
    appointmentStatus: "Scheduled",
    lengthOfStay: 0
});

            setEditId(null);

            fetchPatients();
        } else {
            alert(
                "Error: " +
                (data.message || "Unable to save patient")
            );
        }

    } catch (error) {
        console.error("Fetch error:", error);

        alert(
            "Cannot connect to backend. Make sure backend is running on port 5000."
        );
    }
};

    // Edit
    const handleEdit = (patient) => {
        setEditId(patient._id);

        setFormData({
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    phone: patient.phone,
    department: patient.department,
    visitType: patient.visitType || "OPD",
    admissionStatus: patient.admissionStatus || "Outpatient",
    waitingTime: patient.waitingTime || 0,
    appointmentStatus: patient.appointmentStatus || "Scheduled",
    lengthOfStay: patient.lengthOfStay || 0
});
    };

    // Delete
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this patient?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/patients/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (response.ok) {
                alert("Patient deleted successfully!");
                fetchPatients();
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Filter patients
    const filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.department.toLowerCase().includes(search.toLowerCase())
    );

    // KPI calculations
    const totalPatients = patients.length;

    const malePatients = patients.filter(
        (patient) => patient.gender.toLowerCase() === "male"
    ).length;

    const femalePatients = patients.filter(
        (patient) => patient.gender.toLowerCase() === "female"
    ).length;

    const departments = new Set(
        patients.map((patient) => patient.department)
    ).size;

    // PATIENT OPERATIONS KPIs

const admittedPatients = patients.filter(
    (patient) =>
        patient.admissionStatus === "Admitted"
).length;

const dischargedPatients = patients.filter(
    (patient) =>
        patient.admissionStatus === "Discharged"
).length;

const completedAppointments = patients.filter(
    (patient) =>
        patient.appointmentStatus === "Completed"
).length;

const cancelledAppointments = patients.filter(
    (patient) =>
        patient.appointmentStatus === "Cancelled"
).length;

const totalWaitingTime = patients.reduce(
    (sum, patient) =>
        sum + Number(patient.waitingTime || 0),
    0
);

const averageWaitingTime =
    totalPatients > 0
        ? totalWaitingTime / totalPatients
        : 0;

        const patientsWithLongWait = patients.filter(
    (patient) => Number(patient.waitingTime || 0) > 30
).length;

const maximumWaitingTime =
    patients.length > 0
        ? Math.max(
            ...patients.map(
                (patient) =>
                    Number(patient.waitingTime || 0)
            )
        )
        : 0;

const totalLengthOfStay = patients.reduce(
    (sum, patient) =>
        sum + Number(patient.lengthOfStay || 0),
    0
);

const averageLengthOfStay =
    totalPatients > 0
        ? totalLengthOfStay / totalPatients
        : 0;

        // PATIENT FLOW ANALYSIS

const opdPatients = patients.filter(
    (patient) => patient.visitType === "OPD"
).length;

const ipdPatients = patients.filter(
    (patient) => patient.visitType === "IPD"
).length;

const emergencyPatients = patients.filter(
    (patient) => patient.visitType === "Emergency"
).length;

const outpatientPatients = patients.filter(
    (patient) => patient.admissionStatus === "Outpatient"
).length;

    return (
        <div style={{ padding: "30px", fontFamily: "Arial" }}>

            <h1>Patient Operations Dashboard</h1>

            <p>
                Manage patient information and monitor patient operations.
            </p>

            {/* KPI CARDS */}

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "30px"
                }}
            >

                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "180px",
                    borderRadius: "10px"
                }}>
                    <h3>Total Patients</h3>
                    <h2>{totalPatients}</h2>
                </div>

                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "180px",
                    borderRadius: "10px"
                }}>
                    <h3>Male Patients</h3>
                    <h2>{malePatients}</h2>
                </div>

                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "180px",
                    borderRadius: "10px"
                }}>
                    <h3>Female Patients</h3>
                    <h2>{femalePatients}</h2>
                </div>

                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "180px",
                    borderRadius: "10px"
                }}>
                    <h3>Departments</h3>
                    <h2>{departments}</h2>
                </div>

            </div>


            {/* PATIENT OPERATIONS KPIs */}

<div
    style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        marginBottom: "30px"
    }}
>

    <div style={{
        border: "1px solid #ccc",
        padding: "20px",
        width: "180px",
        borderRadius: "10px"
    }}>
        <h3>Admitted</h3>
        <h2>{admittedPatients}</h2>
    </div>


    <div style={{
        border: "1px solid #ccc",
        padding: "20px",
        width: "180px",
        borderRadius: "10px"
    }}>
        <h3>Discharged</h3>
        <h2>{dischargedPatients}</h2>
    </div>


    <div style={{
        border: "1px solid #ccc",
        padding: "20px",
        width: "180px",
        borderRadius: "10px"
    }}>
        <h3>Avg Waiting</h3>
        <h2>
            {averageWaitingTime.toFixed(1)} min
        </h2>
    </div>


    <div style={{
        border: "1px solid #ccc",
        padding: "20px",
        width: "180px",
        borderRadius: "10px"
    }}>
        <h3>Completed</h3>
        <h2>{completedAppointments}</h2>
    </div>


    <div style={{
        border: "1px solid #ccc",
        padding: "20px",
        width: "180px",
        borderRadius: "10px"
    }}>
        <h3>Cancelled</h3>
        <h2>{cancelledAppointments}</h2>
    </div>


    <div style={{
        border: "1px solid #ccc",
        padding: "20px",
        width: "180px",
        borderRadius: "10px"
    }}>
        <h3>Avg Stay</h3>
        <h2>
            {averageLengthOfStay.toFixed(1)} days
        </h2>
    </div>

</div>


{/* PATIENT FLOW ANALYSIS */}

<div
    style={{
        marginBottom: "40px",
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "10px"
    }}
>

    <h2>
        Patient Flow Analysis
    </h2>

    <table
        border="1"
        cellPadding="12"
        width="100%"
    >

        <thead>

            <tr>
                <th>Flow Type</th>
                <th>Patient Count</th>
            </tr>

        </thead>

        <tbody>

            <tr>
                <td>OPD Visits</td>
                <td>{opdPatients}</td>
            </tr>

            <tr>
                <td>IPD Admissions</td>
                <td>{ipdPatients}</td>
            </tr>

            <tr>
                <td>Emergency Visits</td>
                <td>{emergencyPatients}</td>
            </tr>

            <tr>
                <td>Outpatients</td>
                <td>{outpatientPatients}</td>
            </tr>

            <tr>
                <td>Admitted Patients</td>
                <td>{admittedPatients}</td>
            </tr>

            <tr>
                <td>Discharged Patients</td>
                <td>{dischargedPatients}</td>
            </tr>

        </tbody>

    </table>

</div>

{/* WAITING TIME ANALYSIS */}

<div
    style={{
        marginBottom: "40px",
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "10px"
    }}
>

    <h2>
        Waiting Time Analysis
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
                <td>Average Waiting Time</td>

                <td>
                    {averageWaitingTime.toFixed(1)} minutes
                </td>

                <td>
                    {averageWaitingTime > 30
                        ? "Attention Required"
                        : "Normal"}
                </td>
            </tr>

            <tr>
                <td>Maximum Waiting Time</td>

                <td>
                    {maximumWaitingTime} minutes
                </td>

                <td>
                    {maximumWaitingTime > 60
                        ? "High"
                        : "Normal"}
                </td>
            </tr>

            <tr>
                <td>Patients Waiting Over 30 Minutes</td>

                <td>
                    {patientsWithLongWait}
                </td>

                <td>
                    {patientsWithLongWait > 0
                        ? "Monitor"
                        : "Normal"}
                </td>
            </tr>

        </tbody>

    </table>

</div>

{/* PATIENT FLOW ALERT */}

<div
    style={{
        marginBottom: "40px",
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "10px"
    }}
>

    <h2>
        Patient Operations Alerts
    </h2>

    {patientsWithLongWait > 0 ? (
        <p>
            ⚠️ {patientsWithLongWait} patient(s)
            have waiting times above 30 minutes.
        </p>
    ) : (
        <p>
            ✅ No patients currently have
            waiting times above 30 minutes.
        </p>
    )}

    {maximumWaitingTime > 60 && (
        <p>
            ⚠️ Maximum waiting time has exceeded
            60 minutes and requires attention.
        </p>
    )}

</div>

            {/* ADD / EDIT PATIENT */}

            <h2>{editId ? "Edit Patient" : "Add Patient"}</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Patient Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="gender"
                    placeholder="Gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                />

                <select
    name="visitType"
    value={formData.visitType}
    onChange={handleChange}
>
    <option value="OPD">OPD</option>
    <option value="IPD">IPD</option>
    <option value="Emergency">Emergency</option>
</select>

<select
    name="admissionStatus"
    value={formData.admissionStatus}
    onChange={handleChange}
>
    <option value="Outpatient">Outpatient</option>
    <option value="Admitted">Admitted</option>
    <option value="Discharged">Discharged</option>
</select>

<input
    type="number"
    name="waitingTime"
    placeholder="Waiting Time (minutes)"
    value={formData.waitingTime}
    onChange={handleChange}
/>

<select
    name="appointmentStatus"
    value={formData.appointmentStatus}
    onChange={handleChange}
>
    <option value="Scheduled">Scheduled</option>
    <option value="Completed">Completed</option>
    <option value="Cancelled">Cancelled</option>
</select>

<input
    type="number"
    name="lengthOfStay"
    placeholder="Length of Stay (days)"
    value={formData.lengthOfStay}
    onChange={handleChange}
/>

                <button type="submit">
                    {editId ? "Update Patient" : "Add Patient"}
                </button>

                {editId && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditId(null);

                            setFormData({
                                name: "",
                                age: "",
                                gender: "",
                                phone: "",
                                department: ""
                            });
                        }}
                    >
                        Cancel
                    </button>
                )}

            </form>

            {/* SEARCH */}

            <h2>Patient List</h2>

            <input
                type="text"
                placeholder="Search by name or department"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                style={{
                    padding: "10px",
                    width: "300px",
                    marginBottom: "20px"
                }}
            />

            {/* PATIENT TABLE */}

            <table border="1" cellPadding="10" width="100%">

                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Phone</th>
                        <th>Department</th>
<th>Visit Type</th>
<th>Admission Status</th>
<th>Waiting Time</th>
<th>Appointment</th>
<th>Length of Stay</th>
<th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {filteredPatients.map((patient) => (

                        <tr key={patient._id}>

                            <td>{patient.name}</td>
                            <td>{patient.age}</td>
                            <td>{patient.gender}</td>
                            <td>{patient.phone}</td>
                            <td>{patient.department}</td>

<td>{patient.visitType || "OPD"}</td>

<td>{patient.admissionStatus || "Outpatient"}</td>

<td>
    {patient.waitingTime || 0} min
</td>

<td>
    {patient.appointmentStatus || "Scheduled"}
</td>

<td>
    {patient.lengthOfStay || 0} days
</td>

<td>

                                <button
                                    onClick={() => handleEdit(patient)}
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(patient._id)
                                    }
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default Patient;