import { useEffect, useState } from "react";

function Billing() {

    const [bills, setBills] = useState([]);

    const [formData, setFormData] = useState({
        patientName: "",
        department: "",
        provider: "",
        amount: "",
        paidAmount: "",
        paymentStatus: "Pending",
        paymentMethod: "Cash"
    });

    const [editId, setEditId] = useState(null);

    const [search, setSearch] = useState("");

    const [departmentFilter, setDepartmentFilter] = useState("All");


    // GET BILLING RECORDS

    const fetchBills = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/billing"
            );

            const data = await response.json();

            setBills(data);

        } catch (error) {

            console.log("Error fetching billing:", error);

        }

    };


    useEffect(() => {

        fetchBills();

    }, []);


    // HANDLE INPUT

    const handleChange = (event) => {

        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });

    };


    // ADD / UPDATE BILL

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            let url =
                "http://localhost:5000/api/billing";

            let method = "POST";


            if (editId) {

                url =
                    `http://localhost:5000/api/billing/${editId}`;

                method = "PUT";

            }


            const response = await fetch(url, {

                method: method,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    ...formData,

                    amount: Number(formData.amount),

                    paidAmount: Number(formData.paidAmount)

                })

            });


            const data = await response.json();


            if (response.ok) {

                alert(
                    editId
                        ? "Bill updated successfully!"
                        : "Bill added successfully!"
                );


                setFormData({
                    patientName: "",
                    department: "",
                    provider: "",
                    amount: "",
                    paidAmount: "",
                    paymentStatus: "Pending",
                    paymentMethod: "Cash"
                });


                setEditId(null);

                fetchBills();

            } else {

                alert(
                    data.message || "Error saving bill"
                );

            }

        } catch (error) {

            console.log(error);

            alert("Cannot connect to backend");

        }

    };


    // EDIT BILL

    const handleEdit = (bill) => {

        setEditId(bill._id);

        setFormData({

            patientName: bill.patientName,

            department: bill.department,

            provider: bill.provider,

            amount: bill.amount,

            paidAmount: bill.paidAmount,

            paymentStatus: bill.paymentStatus,

            paymentMethod: bill.paymentMethod

        });


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // DELETE BILL

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this bill?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            const response = await fetch(

                `http://localhost:5000/api/billing/${id}`,

                {
                    method: "DELETE"
                }

            );


            const data = await response.json();


            if (response.ok) {

                alert(
                    "Bill deleted successfully!"
                );

                fetchBills();

            } else {

                alert(
                    data.message || "Error deleting bill"
                );

            }

        } catch (error) {

            console.log(error);

        }

    };


    // FILTER BILLING RECORDS

    const filteredBills = bills.filter((bill) => {

        const matchesSearch =

            bill.patientName
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            bill.provider
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            bill.department
                .toLowerCase()
                .includes(search.toLowerCase());


        const matchesDepartment =

            departmentFilter === "All" ||

            bill.department === departmentFilter;


        return matchesSearch && matchesDepartment;

    });


    // KPI CALCULATIONS

    const totalRevenue = bills.reduce(
        (sum, bill) =>
            sum + Number(bill.paidAmount || 0),
        0
    );


    const totalBilled = bills.reduce(
        (sum, bill) =>
            sum + Number(bill.amount || 0),
        0
    );


    const outstandingAmount =
        totalBilled - totalRevenue;


    return (

        <div style={{
            padding: "30px",
            fontFamily: "Arial"
        }}>


            <h1>
                Billing & Revenue Intelligence
            </h1>


            <p>
                Monitor hospital billing, payments and revenue.
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
                        Total Billed
                    </h3>

                    <h1>
                        ₹{totalBilled.toLocaleString()}
                    </h1>

                </div>


                <div style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    width: "200px",
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
                    width: "200px",
                    borderRadius: "10px"
                }}>

                    <h3>
                        Outstanding
                    </h3>

                    <h1>
                        ₹{outstandingAmount.toLocaleString()}
                    </h1>

                </div>


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
                        {bills.length}
                    </h1>

                </div>

            </div>


            {/* BILL FORM */}

            <h2 style={{
                marginTop: "40px"
            }}>

                {editId
                    ? "Update Bill"
                    : "Add Billing Record"}

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
                    name="department"
                    placeholder="Department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                />


                <br />
                <br />


                <input
                    type="text"
                    name="provider"
                    placeholder="Doctor / Provider"
                    value={formData.provider}
                    onChange={handleChange}
                    required
                />


                <br />
                <br />


                <input
                    type="number"
                    name="amount"
                    placeholder="Total Bill Amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                />


                <br />
                <br />


                <input
                    type="number"
                    name="paidAmount"
                    placeholder="Paid Amount"
                    value={formData.paidAmount}
                    onChange={handleChange}
                />


                <br />
                <br />


                <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                >

                    <option value="Pending">
                        Pending
                    </option>

                    <option value="Partial">
                        Partial
                    </option>

                    <option value="Paid">
                        Paid
                    </option>

                </select>


                <br />
                <br />


                <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                >

                    <option value="Cash">
                        Cash
                    </option>

                    <option value="UPI">
                        UPI
                    </option>

                    <option value="Card">
                        Card
                    </option>

                    <option value="Insurance">
                        Insurance
                    </option>

                </select>


                <br />
                <br />


                <button type="submit">

                    {editId
                        ? "Update Bill"
                        : "Add Bill"}

                </button>


                {editId && (

                    <button
                        type="button"
                        onClick={() => {

                            setEditId(null);

                            setFormData({
                                patientName: "",
                                department: "",
                                provider: "",
                                amount: "",
                                paidAmount: "",
                                paymentStatus: "Pending",
                                paymentMethod: "Cash"
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


            {/* SEARCH & FILTER */}

            <div style={{
                marginTop: "40px"
            }}>

                <h2>
                    Billing Records
                </h2>


                <input
                    type="text"
                    placeholder="Search patient, provider or department"
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

            {/* REVENUE ANALYSIS */}

<div style={{
    marginTop: "50px"
}}>

    <h2>
        Revenue Analysis
    </h2>


    {/* PAYMENT STATUS */}

    <h3>
        Payment Status Summary
    </h3>

    <div style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap"
    }}>

        <div style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "10px",
            width: "180px"
        }}>

            <h4>Paid Bills</h4>

            <h2>
                {bills.filter(
                    bill =>
                        bill.paymentStatus === "Paid"
                ).length}
            </h2>

        </div>


        <div style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "10px",
            width: "180px"
        }}>

            <h4>Partial Payments</h4>

            <h2>
                {bills.filter(
                    bill =>
                        bill.paymentStatus === "Partial"
                ).length}
            </h2>

        </div>


        <div style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "10px",
            width: "180px"
        }}>

            <h4>Pending Bills</h4>

            <h2>
                {bills.filter(
                    bill =>
                        bill.paymentStatus === "Pending"
                ).length}
            </h2>

        </div>

    </div>


    {/* DEPARTMENT REVENUE */}

    <h3 style={{
        marginTop: "30px"
    }}>
        Department Revenue
    </h3>

    <table
        border="1"
        cellPadding="10"
        width="100%"
    >

        <thead>

            <tr>

                <th>
                    Department
                </th>

                <th>
                    Total Billed
                </th>

                <th>
                    Total Collected
                </th>

            </tr>

        </thead>

        <tbody>

            {[
                "Cardiology",
                "General",
                "Emergency",
                "Laboratory",
                "Pharmacy"
            ].map((department) => {

                const departmentBills =
                    bills.filter(
                        bill =>
                            bill.department === department
                    );

                const billed =
                    departmentBills.reduce(
                        (sum, bill) =>
                            sum + Number(
                                bill.amount || 0
                            ),
                        0
                    );

                const collected =
                    departmentBills.reduce(
                        (sum, bill) =>
                            sum + Number(
                                bill.paidAmount || 0
                            ),
                        0
                    );

                return (

                    <tr key={department}>

                        <td>
                            {department}
                        </td>

                        <td>
                            ₹{billed.toLocaleString()}
                        </td>

                        <td>
                            ₹{collected.toLocaleString()}
                        </td>

                    </tr>

                );

            })}

        </tbody>

    </table>


    {/* PAYMENT METHOD */}

    <h3 style={{
        marginTop: "30px"
    }}>
        Payment Method Summary
    </h3>

    <table
        border="1"
        cellPadding="10"
        width="100%"
    >

        <thead>

            <tr>

                <th>
                    Payment Method
                </th>

                <th>
                    Number of Bills
                </th>

                <th>
                    Amount Collected
                </th>

            </tr>

        </thead>

        <tbody>

            {[
                "Cash",
                "UPI",
                "Card",
                "Insurance"
            ].map((method) => {

                const methodBills =
                    bills.filter(
                        bill =>
                            bill.paymentMethod === method
                    );

                const collected =
                    methodBills.reduce(
                        (sum, bill) =>
                            sum + Number(
                                bill.paidAmount || 0
                            ),
                        0
                    );

                return (

                    <tr key={method}>

                        <td>
                            {method}
                        </td>

                        <td>
                            {methodBills.length}
                        </td>

                        <td>
                            ₹{collected.toLocaleString()}
                        </td>

                    </tr>

                );

            })}

        </tbody>

    </table>

</div>


            {/* BILLING TABLE */}

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

                            <th>Department</th>

                            <th>Provider</th>

                            <th>Amount</th>

                            <th>Paid</th>

                            <th>Outstanding</th>

                            <th>Status</th>

                            <th>Payment Method</th>

                            <th>Actions</th>

                        </tr>

                    </thead>


                    <tbody>

                        {filteredBills.map((bill) => (

                            <tr key={bill._id}>

                                <td>
                                    {bill.patientName}
                                </td>

                                <td>
                                    {bill.department}
                                </td>

                                <td>
                                    {bill.provider}
                                </td>

                                <td>
                                    ₹{Number(
                                        bill.amount || 0
                                    ).toLocaleString()}
                                </td>

                                <td>
                                    ₹{Number(
                                        bill.paidAmount || 0
                                    ).toLocaleString()}
                                </td>

                                <td>
                                    ₹{(
                                        Number(bill.amount || 0) -
                                        Number(bill.paidAmount || 0)
                                    ).toLocaleString()}
                                </td>

                                <td>
                                    {bill.paymentStatus}
                                </td>

                                <td>
                                    {bill.paymentMethod}
                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            handleEdit(bill)
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                bill._id
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

                        ))}

                    </tbody>

                </table>


                {filteredBills.length === 0 && (

                    <p>
                        No billing records found.
                    </p>

                )}

            </div>

        </div>

    );

}

export default Billing;