import { useState, useEffect } from 'react';

export default function SuperAdminTable({ onLogout }) {
    const [admins, setAdmins] = useState([]);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');

    const [editName, setEditName] = useState('');
    const [editLastName, setEditLastName] = useState('');
    const [editID, setEditID] = useState('');
    const [isModalOpen, setisModalOpen] = useState(false);
    const [error, setError] = useState('');

    const api_url = 'http://localhost:8080/api/admins';

    useEffect(() => {
        fetch(api_url) //1. get raw json data from the server
            .then((response) => {
                if (!response.ok) throw new Error('Unable to load the admins list.');
                return response.json(); //2. convert it to a readable format for js
            })
            .then((data) => setAdmins(data)) //3. put the data in a variable
            .catch((err) => {
                console.log('Error in', err);
                setError('Cannot connect to the server. Make sure server.js is running.');
            });
    }, []); //to ensure that it will run at once only

    //post method
    async function formSubmit(event) {
        event.preventDefault(); //prevent refresh
        setError('');
        try {
            const response = await fetch(api_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, lastName })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Unable to add the admin.');
                return;
            }

            setAdmins((prev) => [...prev, data]);
            setName('');
            setLastName('');
        } catch (err) {
            console.log(err);
            setError('Cannot connect to the server.');
        }
    }

    // put method (update)
    async function handleUpdate(event) {
        event.preventDefault();
        setError('');

        try {
            const response = await fetch(`${api_url}/${editID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editName,
                    lastName: editLastName
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Unable to update the admin.');
                return;
            }

            setAdmins((prevAdmins) =>
                prevAdmins.map((a) => (a.id === Number(editID) ? data : a))
            );

            setisModalOpen(false);
        } catch (err) {
            console.log(err);
            setError('Cannot connect to the server.');
        }
    }

    async function handleDelete(id) {
        setError('');
        try {
            const response = await fetch(`${api_url}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || 'Unable to delete the admin.');
                return;
            }

            setAdmins((prev) => prev.filter((a) => a.id !== Number(id)));

            setisModalOpen(false);
        } catch (err) {
            console.log(err);
            setError('Cannot connect to the server.');
        }
    }

    function openEdit(adminEdit) {
        setisModalOpen(true);
        setEditID(adminEdit.id);
        setEditName(adminEdit.name);
        setEditLastName(adminEdit.lastName);
    }

    return (
        <div data-bs-theme="light" className="bg-success-subtle text-dark min-vh-100 pb-5">
            <header className="bg-success text-white text-start fw-bold m-0 p-4 shadow-sm">
                Campus Tracker <i className="bi bi-clipboard-fill"></i>
            </header>

            <h1 className="text-dark text-center fw-bold mt-3">
                Superadmin Dashboard
            </h1>

            {error && (
                <div className="alert alert-danger text-center mx-4" role="alert">
                    {error}
                </div>
            )}

            <form className="text-center text-dark" onSubmit={formSubmit}>
                <label className="form-label  mx-2" htmlFor="name">Name:</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                />

                <label className="form-label mx-2 ms-3" htmlFor="lastName">Last Name:</label>
                <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    required
                />

                <input type="submit" className="btn btn-success ms-3" value="Add Admin" />
            </form>

            <br />

            <table className="table table-striped table-fixed">
                <thead>
                    <tr className="table-dark">
                        <th scope="col">Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="text-center text-muted py-4">
                                No admins yet. Add one above.
                            </td>
                        </tr>
                    ) : (
                        admins.map((admin) => (
                            <tr key={admin.id}>
                                <td>{admin.name}</td>
                                <td>{admin.lastName}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary mx-2"
                                        onClick={() => openEdit(admin)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => handleDelete(admin.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {onLogout && (
                <div className="d-flex justify-content-center align-items-center mt-3 fixed-bottom mb-3">
                    <button className="btn btn-danger" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            )}

            {isModalOpen && (
                <>
                    <div className="modal-backdrop fade show"></div>

                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Admin</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={() => setisModalOpen(false)}
                                    ></button>
                                </div>
                                <form onSubmit={handleUpdate}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label htmlFor="editName" className="form-label">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="editName"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="editLastName" className="form-label">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="editLastName"
                                                value={editLastName}
                                                onChange={(e) => setEditLastName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setisModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}