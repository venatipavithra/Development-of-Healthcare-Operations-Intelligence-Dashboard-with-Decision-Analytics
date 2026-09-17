import { useEffect, useState } from "react";

function Staff() {

    const [staff, setStaff] = useState([]);

    const [search, setSearch] = useState("");

    const [departmentFilter, setDepartmentFilter] = useState("All");

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        department: "",
        phone: "",
        attendance: "",
        workload: "",
        productivity: ""
    });

    const [editId, setEditId] = useState(null);

    // GET STAFF
    const fetchStaff = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/staff"
            );

            const data = await response.json();

            setStaff(data);

        } catch (error) {

            console.log("Error fetching staff:", error);

        }

    };

    useEffect(() => {
        fetchStaff();
    }, []);


    // HANDLE INPUT
    const handleChange = (event) => {

        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });

    };


    // ADD / UPDATE STAFF
    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            let url = "http://localhost:5000/api/staff";
            let method = "POST";

            if (editId) {

                url =
                    `http://localhost:5000/api/staff/${editId}`;

                method = "PUT";

            }

            const response = await fetch(url, {

                method: method,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    ...formData,
                    attendance: Number(formData.attendance),
                    workload: Number(formData.workload),
                    productivity: Number(formData.productivity)
                })

            });

            const data = await response.json();

            if (response.ok) {

                alert(
                    editId
                        ? "Staff updated successfully!"
                        : "Staff added successfully!"
                );

                setFormData({
                    name: "",
                    role: "",
                    department: "",
                    phone: "",
                    attendance: "",
                    workload: "",
                    productivity: ""
                });

                setEditId(null);

                fetchStaff();

            } else {

                alert(
                    data.message || "Error saving staff"
                );

            }

        } catch (error) {

            console.log(error);

            alert("Cannot connect to backend");

        }

    };


    // EDIT STAFF
    const handleEdit = (person) => {

        setEditId(person._id);

        setFormData({
            name: person.name,
            role: person.role,
            department: person.department,
            phone: person.phone,
            attendance: person.attendance,
            workload: person.workload,
            productivity: person.productivity
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // DELETE STAFF
    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this staff member?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:5000/api/staff/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert("Staff deleted successfully!");

                fetchStaff();

            } else {

                alert(
                    data.message || "Error deleting staff"
                );

            }

        } catch (error) {

            console.log(error);

        }

    };


    return (

        <div style={{
            padding: "30px",
            fontFamily: "Arial"
        }}>

            <h1>
                Doctors & Staff Intelligence
            </h1>

            <p>
                Monitor staff productivity, workload and attendance.
            </p>

            <hr />

            {/* STAFF KPI CARDS */}

<div style={{
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "30px"
}}>

    {/* TOTAL STAFF */}

    <div style={{
        border: "1px solid #ccc",
        padding: "20px",
        width: "200px",
        borderRadius: "10px"
    }}>

        <h3>Total Staff</h3>

        <h1>
            {staff.length}
        </h1>

    </div>


    {/* AVERAGE ATTENDANCE */}

    <div style={{
        border: "1px solid #ccc",
        padding: "20px",
        width: "200px",
        borderRadius: "10px"
    }}>

        <h3>Avg Attendance</h3>

        <h1>

            {staff.length > 0
                ? (
                    staff.reduce(
                        (sum, person) =>
                            sum + Number(person.attendance || 0),
                        0
                    ) / staff.length
                ).toFixed(1)
                : 0
            }%

        </h1>

    </div>


    {/* AVERAGE WORKLOAD */}

    <div style={{
        border: "1px solid #ccc",
        padding: "20px",
        width: "200px",
        borderRadius: "10px"
    }}>

        <h3>Avg Workload</h3>

        <h1>

            {staff.length > 0
                ? (
                    staff.reduce(
                        (sum, person) =>
                            sum + Number(person.workload || 0),
                        0
                    ) / staff.length
                ).toFixed(1)
                : 0
            }

        </h1>

    </div>


    {/* AVERAGE PRODUCTIVITY */}

    <div style={{
        border: "1px solid #ccc",
        padding: "20px",
        width: "200px",
        borderRadius: "10px"
    }}>

        <h3>Avg Productivity</h3>

        <h1>

            {staff.length > 0
                ? (
                    staff.reduce(
                        (sum, person) =>
                            sum + Number(person.productivity || 0),
                        0
                    ) / staff.length
                ).toFixed(1)
                : 0
            }%

        </h1>

    </div>

</div>


            {/* STAFF FORM */}

            <h2>
                {editId ? "Update Staff" : "Add Doctor / Staff"}
            </h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Staff Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="text"
                    name="role"
                    placeholder="Role (Doctor/Nurse/Admin)"
                    value={formData.role}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="number"
                    name="attendance"
                    placeholder="Attendance %"
                    value={formData.attendance}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="number"
                    name="workload"
                    placeholder="Workload"
                    value={formData.workload}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="number"
                    name="productivity"
                    placeholder="Productivity %"
                    value={formData.productivity}
                    onChange={handleChange}
                />

                <br /><br />

                <button type="submit">

                    {editId
                        ? "Update Staff"
                        : "Add Staff"}

                </button>

                {editId && (

                    <button
                        type="button"
                        onClick={() => {

                            setEditId(null);

                            setFormData({
                                name: "",
                                role: "",
                                department: "",
                                phone: "",
                                attendance: "",
                                workload: "",
                                productivity: ""
                            });

                        }}
                        style={{
                            marginLeft: "10px"
                        }}
                    >
                        Cancel
                    </button>

                )}

            </form>

            {/* STAFF SEARCH */}

<div style={{
    marginTop: "40px"
}}>

    <h2>Staff Search</h2>

    <input
        type="text"
        placeholder="Search by name, role or department"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
            width: "350px",
            padding: "10px",
            fontSize: "16px"
        }}
    />

<br />
<br />

<select
    value={departmentFilter}
    onChange={(e) =>
        setDepartmentFilter(e.target.value)
    }
    style={{
        padding: "10px",
        fontSize: "16px"
    }}
>

    <option value="All">
        All Departments
    </option>

    <option value="Cardiology">
        Cardiology
    </option>

    <option value="General">
        General
    </option>

    <option value="Emergency">
        Emergency
    </option>

    <option value="Laboratory">
        Laboratory
    </option>

    <option value="Pharmacy">
        Pharmacy
    </option>

</select>

</div>


            {/* STAFF LIST */}

            <div style={{
                marginTop: "40px"
            }}>

                <h2>
                    Staff List
                </h2>

                <table
                    border="1"
                    cellPadding="10"
                    width="100%"
                >

                    <thead>

                        <tr>

                            <th>Name</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Phone</th>
                            <th>Attendance</th>
                            <th>Workload</th>
                            <th>Productivity</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {staff
    .filter((person) => {

    const matchesSearch =
        person.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        person.role
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        person.department
            .toLowerCase()
            .includes(search.toLowerCase());

    const matchesDepartment =
        departmentFilter === "All" ||
        person.department === departmentFilter;

    return matchesSearch && matchesDepartment;

})
    .map((person) => (

                            <tr key={person._id}>

                                <td>
                                    {person.name}
                                </td>

                                <td>
                                    {person.role}
                                </td>

                                <td>
                                    {person.department}
                                </td>

                                <td>
                                    {person.phone}
                                </td>

                                <td>
                                    {person.attendance}%
                                </td>

                                <td>
                                    {person.workload}
                                </td>

                                <td>
                                    {person.productivity}%
                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            handleEdit(person)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(person._id)
                                        }
                                        style={{
                                            marginLeft: "5px"
                                        }}
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                {staff.length === 0 && (

                    <p>
                        No staff records found.
                    </p>

                )}

            </div>

            {/* STAFF PERFORMANCE */}

<div style={{
    marginTop: "50px"
}}>

    <h2>
        Staff Performance
    </h2>

    {staff.map((person) => (

        <div
            key={person._id}
            style={{
                border: "1px solid #ccc",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "10px"
            }}
        >

            <h3>
                {person.name}
            </h3>

            <p>
                {person.role} - {person.department}
            </p>


            {/* WORKLOAD */}

            <strong>
                Workload: {person.workload}%
            </strong>

            <div style={{
                width: "100%",
                height: "20px",
                border: "1px solid #ccc",
                marginTop: "8px",
                marginBottom: "15px"
            }}>

                <div style={{
                    width: `${Math.min(
                        Number(person.workload) || 0,
                        100
                    )}%`,
                    height: "100%",
                    backgroundColor: "steelblue"
                }}>
                </div>

            </div>


            {/* PRODUCTIVITY */}

            <strong>
                Productivity: {person.productivity}%
            </strong>

            <div style={{
                width: "100%",
                height: "20px",
                border: "1px solid #ccc",
                marginTop: "8px"
            }}>

                <div style={{
                    width: `${Math.min(
                        Number(person.productivity) || 0,
                        100
                    )}%`,
                    height: "100%",
                    backgroundColor: "green"
                }}>
                </div>

            </div>

        </div>

    ))}

</div>

        </div>

        
    );
}

export default Staff;