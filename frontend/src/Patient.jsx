import { useEffect, useState } from "react";

function Patient() {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        phone: "",
        department: ""
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
                age: Number(formData.age)
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
                department: ""
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
            department: patient.department
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