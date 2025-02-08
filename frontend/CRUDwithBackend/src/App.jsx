import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", age: "" });
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:5000/users");
    setUsers(response.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUserId) {
      await axios.put(`http://localhost:5000/users/${editingUserId}`, formData);
      setEditingUserId(null);
    } else {
      await axios.post("http://localhost:5000/users", formData);
    }
    setFormData({ name: "", email: "", age: "" });
    fetchUsers();
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditingUserId(user.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/users/${id}`);
    fetchUsers();
  };

  return (
    <div className="container">
      <h1>CRUD with React , Node, MySql</h1>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
          <button type="submit">{editingUserId ? "Update" : "Add"} User</button>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.age}</td>
              <td>
                <div className="action">
                <button className="edit-btn" onClick={() => handleEdit(user)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
