import { useEffect, useState, useCallback } from "react";

import AssignHODModal from "../components/AssignHODModal";
import DepartmentForm from "../components/DepartmentForm";
import departmentService from "../services/departmentService";

function DepartmentForms({
  creating,
  editing,
  handleCreate,
  handleUpdate,
  setEditing,
}) {
  return (
    <>
      {creating && (
        <DepartmentForm
          onSubmit={handleCreate}
          submitLabel="Create Department"
        />
      )}

      {editing && (
        <div className="edit-block">
          <h3>Edit — {editing.name}</h3>

          <DepartmentForm
            initial={editing}
            onSubmit={handleUpdate}
            submitLabel="Update Department"
          />

          <button className="ghost" onClick={() => setEditing(null)}>
            Cancel edit
          </button>
        </div>
      )}
    </>
  );
}

function DepartmentsTable({
  departments,
  setEditing,
  setAssigning,
  handleDelete,
}) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Type</th>
          <th>Years</th>
          <th>HOD</th>
          <th>Active</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {departments.map((d) => (
          <tr key={d._id} style={{ opacity: d.isActive ? 1 : 0.5 }}>
            <td>{d.code}</td>
            <td>{d.name}</td>
            <td>{d.departmentType}</td>
            <td>{d.durationYears}</td>
            <td>{d.hodId || "—"}</td>
            <td>{d.isActive ? "Yes" : "No"}</td>

            <td className="actions">
              <button onClick={() => setEditing(d)}>Edit</button>

              <button onClick={() => setAssigning(d)}>Assign HOD</button>

              <button onClick={() => handleDelete(d)}>Delete</button>
            </td>
          </tr>
        ))}

        {!departments.length && (
          <tr>
            <td colSpan="7" style={{ textAlign: "center" }}>
              No departments yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function useDepartments(
  editing,
  setDepartments,
  setLoading,
  setError,
  setCreating,
  setEditing,
) {
  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await departmentService.getDepartments({
        includeInactive: "true",
      });

      setDepartments(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  }, [setDepartments, setLoading, setError]);

  const handleCreate = async (payload) => {
    await departmentService.createDepartment(payload);
    setCreating(false);
    load();
  };

  const handleUpdate = async (payload) => {
    await departmentService.updateDepartment(editing._id, payload);

    setEditing(null);
    load();
  };

  const handleDelete = async (dep) => {
    if (!confirm(`Deactivate department "${dep.name}"?`)) {
      return;
    }

    await departmentService.deleteDepartment(dep._id);
    load();
  };

  return { load, handleCreate, handleUpdate, handleDelete };
}

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [assigning, setAssigning] = useState(null);

  const { load, handleCreate, handleUpdate, handleDelete } = useDepartments(
    editing,
    setDepartments,
    setLoading,
    setError,
    setCreating,
    setEditing,
  );

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="page">
      <div className="page-head">
        <h2>Departments ({departments.length})</h2>

        <button className="btn" onClick={() => setCreating((c) => !c)}>
          {creating ? "Close" : "+ Add Department"}
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <DepartmentForms
        creating={creating}
        editing={editing}
        handleCreate={handleCreate}
        handleUpdate={handleUpdate}
        setEditing={setEditing}
      />

      {loading ? (
        <p>Loading…</p>
      ) : (
        <DepartmentsTable
          departments={departments}
          setEditing={setEditing}
          setAssigning={setAssigning}
          handleDelete={handleDelete}
        />
      )}

      {assigning && (
        <AssignHODModal
          department={assigning}
          onClose={() => setAssigning(null)}
          onAssigned={load}
        />
      )}
    </div>
  );
}
