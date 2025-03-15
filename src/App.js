import "./App.css";
import DoList from "./css/list.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-grid-system";
import background from "./images/background.jpg";

function App() {
  const [tasklist, setTask] = useState("");
  const [taskstatus, setStatus] = useState("");
  const [taskcomplete, setComplete] = useState("");
  const [taskaction, setAction] = useState("");
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [completionFilter, setCompletionFilter] = useState("");

  useEffect(() => {
    dataFunction();
  }, []);

  // Fetch Task Data
  const dataFunction = () => {
    axios
      .get("http://localhost:8000/getTaskData")
      .then((response) => setData(response.data))
      .catch(() => console.log("Failed to fetch data"));
  };

  // Handle Task Submission
  const taskFunction = (e) => {
    e.preventDefault();
    if (!tasklist || !taskstatus || !taskcomplete || !taskaction) {
      alert("All fields are required!");
      return;
    }

    if (editId) {
      // Update existing task
      axios
        .put(`http://localhost:8000/editfunction/${editId}`, {
          tasklist,
          taskstatus,
          taskcomplete,
          taskaction,
        })
        .then(() => {
          alert("Task updated successfully!");
          setEditId(null);
          resetForm();
          dataFunction();
        })
        .catch(() => alert("Failed to update task"));
    } else {
      // Insert new task
      axios
        .post("http://localhost:8000/taskfunction", {
          tasklist,
          taskstatus,
          taskcomplete,
          taskaction,
        })
        .then(() => {
          alert("Task added successfully!");
          resetForm();
          dataFunction();
        })
        .catch(() => alert("Failed to insert data"));
    }
  };

  // Edit Task
  const editFunction = (id) => {
    const editTask = data.find((task) => task.id === id);
    if (editTask) {
      setEditId(id);
      setTask(editTask.tasklist);
      setStatus(editTask.taskstatus);
      setComplete(editTask.taskcomplete);
      setAction(editTask.taskaction);
    }
  };

  // Delete Task
  const deleteFunction = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      axios
        .delete(`http://localhost:8000/deletefunction/${id}`)
        .then(() => {
          alert("Task deleted successfully");
          dataFunction();
        })
        .catch(() => alert("Failed to delete task"));
    }
  };

  // Reset Form Fields
  const resetForm = () => {
    setTask("");
    setStatus("");
    setComplete("");
    setAction("");
    setEditId(null);
  };

  return (
    <div className="App">
      <div className={DoList.listContainer}>
        <h1>To-Do List</h1>
        <form onSubmit={taskFunction}>
          <Container className={DoList.ColContainer}>
            <Row className={DoList.RowContainer}>
              <Col sm={3} className={DoList.ColSub}>
                <input
                  type="text"
                  value={tasklist}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Enter task"
                />
              </Col>
              <Col sm={3} className={DoList.ColSub}>
                <select
                  value={taskstatus}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="action">Needs Action</option>
                </select>
              </Col>
              <Col sm={3} className={DoList.ColSub}>
                <select
                  value={taskcomplete}
                  onChange={(e) => setComplete(e.target.value)}
                >
                  <option value="">Select Completion</option>
                  <option value="completed">Completed</option>
                  <option value="uncompleted">Uncompleted</option>
                </select>
              </Col>
              <Col sm={3} className={DoList.ColSub}>
                <input
                  type="text"
                  value={taskaction}
                  onChange={(e) => setAction(e.target.value)}
                  placeholder="Enter action"
                />
              </Col>
            </Row>
            <button type="submit" className={DoList.TaskBtn}>
              {editId ? "Update Task" : "Add Task"}
            </button>
          </Container>
        </form>

        {/* Task Table */}
        <table className={DoList.TaskTbl}>
          <thead>
            <tr>
              <th>No</th>
              <th>Task</th>
              <th>Status</th>
              <th>Completion</th>
              <th>Action</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter((task) =>
                statusFilter ? task.taskstatus === statusFilter : true
              )
              .filter((task) =>
                completionFilter ? task.taskcomplete === completionFilter : true
              )
              .map((task, index) => (
                <tr key={task.id}>
                  <td>{index + 1}</td>
                  <td>{task.tasklist}</td>
                  <td>{task.taskstatus}</td>
                  <td>{task.taskcomplete}</td>
                  <td>{task.taskaction}</td>
                  <td>
                    <button
                      className={DoList.EditBtn}
                      onClick={() => editFunction(task.id)}
                    >
                      Edit
                    </button>
                    <button
                      className={DoList.DeleteBtn}
                      onClick={() => deleteFunction(task.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
