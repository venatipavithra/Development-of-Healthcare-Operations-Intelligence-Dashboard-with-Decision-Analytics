import { useEffect, useState } from "react";

function Claims() {

    const [claims, setClaims] = useState([]);

    const [formData, setFormData] = useState({
        patientName: "",
        insuranceProvider: "",
        claimNumber: "",
        department: "",
        claimAmount: "",
        approvedAmount: "",
        claimStatus: "Submitted",
        denialReason: ""
    });

    const [editId, setEditId] = useState(null);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");


    // GET CLAIMS

    const fetchClaims = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/claims"
            );

            const data = await response.json();

            setClaims(data);

        } catch (error) {

            console.log("Error fetching claims:", error);

        }

    };


    useEffect(() => {

        fetchClaims();

    }, []);


    // HANDLE INPUT

    const handleChange = (event) => {

        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });

    };


    // ADD / UPDATE CLAIM

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            let url =
                "http://localhost:5000/api/claims";

            let method = "POST";


            if (editId) {

                url =
                    `http://localhost:5000/api/claims/${editId}`;

                method = "PUT";

            }


            const response = await fetch(url, {

                method: method,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    ...formData,

                    claimAmount:
                        Number(formData.claimAmount),

                    approvedAmount:
                        Number(formData.approvedAmount)

                })

            });


            const data = await response.json();


            if (response.ok) {

                alert(
                    editId
                        ? "Claim updated successfully!"
                        : "Claim added successfully!"
                );


                setFormData({
                    patientName: "",
                    insuranceProvider: "",
                    claimNumber: "",
                    department: "",
                    claimAmount: "",
                    approvedAmount: "",
                    claimStatus: "Submitted",
                    denialReason: ""
                });


                setEditId(null);

                fetchClaims();

            } else {

                alert(
                    data.message || "Error saving claim"
                );

            }

        } catch (error) {

            console.log(error);

            alert("Cannot connect to backend");

        }

    };


    // EDIT CLAIM

    const handleEdit = (claim) => {

        setEditId(claim._id);

        setFormData({

            patientName: claim.patientName,

            insuranceProvider:
                claim.insuranceProvider,

            claimNumber: claim.claimNumber,

            department: claim.department,

            claimAmount: claim.claimAmount,

            approvedAmount:
                claim.approvedAmount,

            claimStatus: claim.claimStatus,

            denialReason:
                claim.denialReason || ""

        });


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // DELETE CLAIM

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this claim?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            const response = await fetch(

                `http://localhost:5000/api/claims/${id}`,

                {
                    method: "DELETE"
                }

            );


            const data = await response.json();


            if (response.ok) {

                alert(
                    "Claim deleted successfully!"
                );

                fetchClaims();

            } else {

                alert(
                    data.message ||
                    "Error deleting claim"
                );

            }

        } catch (error) {

            console.log(error);

        }

    };


    // FILTER CLAIMS

    const filteredClaims = claims.filter((claim) => {

        const matchesSearch =

            claim.patientName
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            claim.insuranceProvider
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            claim.claimNumber
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            claim.department
                .toLowerCase()
                .includes(search.toLowerCase());


        const matchesStatus =

            statusFilter === "All" ||

            claim.claimStatus === statusFilter;


        return matchesSearch && matchesStatus;

    });


    // KPI CALCULATIONS

    const totalClaims = claims.length;


    const totalClaimAmount = claims.reduce(
        (sum, claim) =>
            sum + Number(
                claim.claimAmount || 0
            ),
        0
    );


    const totalApprovedAmount = claims.reduce(
        (sum, claim) =>
            sum + Number(
                claim.approvedAmount || 0
            ),
        0
    );


    const deniedClaims = claims.filter(
        claim =>
            claim.claimStatus === "Denied"
    ).length;


    return (

        <div style={{
            padding: "30px",
            fontFamily: "Arial"
        }}>


            <h1>
                Insurance & Claims Automation
            </h1>


            <p>
                Monitor insurance claims, approvals,
                denials and claim amounts.
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

                    <h3>
                        Total Claims
                    </h3>

                    <h1>
                        {totalClaims}
                    </h1>

                </div>


                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "200px",
                    borderRadius: "10px"
                }}>

                    <h3>
                        Claim Amount
                    </h3>

                    <h1>
                        ₹{totalClaimAmount.toLocaleString()}
                    </h1>

                </div>


                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "200px",
                    borderRadius: "10px"
                }}>

                    <h3>
                        Approved Amount
                    </h3>

                    <h1>
                        ₹{totalApprovedAmount.toLocaleString()}
                    </h1>

                </div>


                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "200px",
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


            {/* CLAIM FORM */}

            <h2 style={{
                marginTop: "40px"
            }}>

                {editId
                    ? "Update Claim"
                    : "Add Insurance Claim"}

            </h2>


            <form onSubmit={handleSubmit}>


                <input
                    type="text"
                    name="patientName"
                    placeholder="Patient Name"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                />


                <br />
                <br />


                <input
                    type="text"
                    name="insuranceProvider"
                    placeholder="Insurance Provider"
                    value={
                        formData.insuranceProvider
                    }
                    onChange={handleChange}
                    required
                />


                <br />
                <br />


                <input
                    type="text"
                    name="claimNumber"
                    placeholder="Claim Number"
                    value={formData.claimNumber}
                    onChange={handleChange}
                    required
                />


                <br />
                <br />


                <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                />


                <br />
                <br />


                <input
                    type="number"
                    name="claimAmount"
                    placeholder="Claim Amount"
                    value={formData.claimAmount}
                    onChange={handleChange}
                    required
                />


                <br />
                <br />


                <input
                    type="number"
                    name="approvedAmount"
                    placeholder="Approved Amount"
                    value={formData.approvedAmount}
                    onChange={handleChange}
                />


                <br />
                <br />


                <select
                    name="claimStatus"
                    value={formData.claimStatus}
                    onChange={handleChange}
                >

                    <option value="Submitted">
                        Submitted
                    </option>

                    <option value="Processing">
                        Processing
                    </option>

                    <option value="Approved">
                        Approved
                    </option>

                    <option value="Denied">
                        Denied
                    </option>

                </select>


                <br />
                <br />


                <input
                    type="text"
                    name="denialReason"
                    placeholder="Denial Reason (if applicable)"
                    value={formData.denialReason}
                    onChange={handleChange}
                />


                <br />
                <br />


                <button type="submit">

                    {editId
                        ? "Update Claim"
                        : "Add Claim"}

                </button>


                {editId && (

                    <button
                        type="button"
                        onClick={() => {

                            setEditId(null);

                            setFormData({
                                patientName: "",
                                insuranceProvider: "",
                                claimNumber: "",
                                department: "",
                                claimAmount: "",
                                approvedAmount: "",
                                claimStatus: "Submitted",
                                denialReason: ""
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


            {/* SEARCH AND FILTER */}

            <div style={{
                marginTop: "40px"
            }}>

                <h2>
                    Claims Records
                </h2>


                <input
                    type="text"
                    placeholder="Search patient, insurance or claim number"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    style={{
                        width: "350px",
                        padding: "10px",
                        fontSize: "16px"
                    }}
                />


                <br />
                <br />


                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                    style={{
                        padding: "10px",
                        fontSize: "16px"
                    }}
                >

                    <option value="All">
                        All Status
                    </option>

                    <option value="Submitted">
                        Submitted
                    </option>

                    <option value="Processing">
                        Processing
                    </option>

                    <option value="Approved">
                        Approved
                    </option>

                    <option value="Denied">
                        Denied
                    </option>

                </select>

            </div>


            {/* CLAIMS TABLE */}

            <div style={{
                marginTop: "25px"
            }}>

                <table
                    border="1"
                    cellPadding="10"
                    width="100%"
                >

                    <thead>

                        <tr>

                            <th>Patient</th>

                            <th>Insurance</th>

                            <th>Claim Number</th>

                            <th>Department</th>

                            <th>Claim Amount</th>

                            <th>Approved</th>

                            <th>Status</th>

                            <th>Denial Reason</th>

                            <th>Actions</th>

                        </tr>

                    </thead>


                    <tbody>

                        {filteredClaims.map(
                            (claim) => (

                                <tr key={claim._id}>

                                    <td>
                                        {claim.patientName}
                                    </td>

                                    <td>
                                        {claim.insuranceProvider}
                                    </td>

                                    <td>
                                        {claim.claimNumber}
                                    </td>

                                    <td>
                                        {claim.department}
                                    </td>

                                    <td>
                                        ₹{Number(
                                            claim.claimAmount || 0
                                        ).toLocaleString()}
                                    </td>

                                    <td>
                                        ₹{Number(
                                            claim.approvedAmount || 0
                                        ).toLocaleString()}
                                    </td>

                                    <td>
                                        {claim.claimStatus}
                                    </td>

                                    <td>
                                        {claim.denialReason || "-"}
                                    </td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                handleEdit(
                                                    claim
                                                )
                                            }
                                        >
                                            Edit
                                        </button>


                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    claim._id
                                                )
                                            }
                                            style={{
                                                marginLeft: "5px"
                                            }}
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>


                {filteredClaims.length === 0 && (

                    <p>
                        No claims found.
                    </p>

                )}

            </div>


            {/* DENIAL ANALYSIS */}

            <div style={{
                marginTop: "50px"
            }}>

                <h2>
                    Denial Analysis
                </h2>


                <p>
                    Total Denied Claims:
                    {" "}
                    <strong>
                        {deniedClaims}
                    </strong>
                </p>


                {claims
                    .filter(
                        claim =>
                            claim.claimStatus === "Denied"
                    )
                    .map((claim) => (

                        <div
                            key={claim._id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "15px",
                                marginBottom: "10px",
                                borderRadius: "8px"
                            }}
                        >

                            <strong>
                                {claim.patientName}
                            </strong>

                            {" - "}

                            {claim.insuranceProvider}

                            <br />

                            Claim:
                            {" "}
                            {claim.claimNumber}

                            <br />

                            Reason:
                            {" "}

                            {claim.denialReason || "Not specified"}

                        </div>

                    ))}

            </div>

        </div>

    );

}

export default Claims;