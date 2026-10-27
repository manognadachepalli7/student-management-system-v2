import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  // ================= ADD STUDENT =================
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");
  const [marks, setMarks] = useState("");

  // ================= EDIT STUDENT =================
  const [editingId, setEditingId] = useState(null);
  const [editAge, setEditAge] = useState("");
  const [editCourse, setEditCourse] = useState("");
  const [editMarks, setEditMarks] = useState("");

  // =================================================
  // COURSE DROPDOWN OPTIONS
  // =================================================

  const courses = [
    "CSE",
    "ECE",
    "EEE",
    "ME",
    "CE",
    "IT",
    "AI & ML",
    "Data Science",
    "AERO",
    "Chemical Engineering",
    "Biotechnology",
  ];

  // =================================================
  // GET STUDENTS
  // =================================================

  const getStudents = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/students"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();

      setStudents(data);
    } catch (error) {
      console.error(error);
      alert("❌ Cannot connect to backend.");
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  // =================================================
  // ADD STUDENT - POST
  // =================================================

  const addStudent = async () => {

    // NAME REQUIRED
    if (name.trim() === "") {
      alert("⚠️ Name is required.");
      return;
    }

    // NAME LENGTH
    if (name.trim().length < 2) {
      alert("⚠️ Name must contain at least 2 characters.");
      return;
    }

    if (name.trim().length > 30) {
      alert("⚠️ Name cannot contain more than 30 characters.");
      return;
    }

    // NAME FORMAT
    const namePattern = /^[A-Za-z ]+$/;

    if (!namePattern.test(name.trim())) {
      alert(
        "❌ Name can contain only alphabets and spaces."
      );
      return;
    }

    // DUPLICATE NAME
    const duplicateName = students.some(
      (student) =>
        student.name?.toLowerCase() ===
        name.trim().toLowerCase()
    );

    if (duplicateName) {
      alert(
        "❌ Constraint Error: Student name already exists."
      );
      return;
    }

    // AGE REQUIRED
    if (age === "") {
      alert("⚠️ Age is required.");
      return;
    }

    // AGE INTEGER
    if (!Number.isInteger(Number(age))) {
      alert("❌ Age must be a whole number.");
      return;
    }

    // AGE RANGE
    if (Number(age) < 1 || Number(age) >= 70) {
      alert("❌ Age must be between 1 and 69.");
      return;
    }

    // COURSE REQUIRED
    if (course === "") {
      alert("⚠️ Please select a course.");
      return;
    }

    // MARKS REQUIRED
    if (marks === "") {
      alert("⚠️ Marks are required.");
      return;
    }

    // MARKS INTEGER
    if (!Number.isInteger(Number(marks))) {
      alert("❌ Marks must be a whole number.");
      return;
    }

    // MARKS RANGE
    if (Number(marks) < 0 || Number(marks) >= 100) {
      alert("❌ Marks must be between 0 and 99.");
      return;
    }

    // =================================================
    // POST REQUEST
    // =================================================

    try {
      const response = await fetch(
        "http://localhost:3000/students",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            age: Number(age),
            course: course,
            marks: Number(marks),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Student could not be added");
      }

      // CLEAR FORM
      setName("");
      setAge("");
      setCourse("");
      setMarks("");

      await getStudents();

      alert("✅ Student added successfully!");

    } catch (error) {
      console.error(error);
      alert("❌ Error while adding student.");
    }
  };

  // =================================================
  // START EDIT
  // =================================================

  const startEdit = (student) => {
    setEditingId(student._id);

    setEditAge(student.age);

    setEditCourse(
      student.course || student.branch || ""
    );

    setEditMarks(
      student.marks ?? student.cgpa ?? ""
    );
  };

  // =================================================
  // CANCEL EDIT
  // =================================================

  const cancelEdit = () => {
    setEditingId(null);

    setEditAge("");
    setEditCourse("");
    setEditMarks("");
  };

  // =================================================
  // UPDATE STUDENT - PUT
  // =================================================

  const updateStudent = async (studentName) => {

    // ---------------- AGE ----------------

    if (editAge === "") {
      alert("⚠️ Age is required.");
      return;
    }

    if (!Number.isInteger(Number(editAge))) {
      alert("❌ Age must be a whole number.");
      return;
    }

    if (
      Number(editAge) < 1 ||
      Number(editAge) >= 70
    ) {
      alert("❌ Age must be between 1 and 69.");
      return;
    }

    // ---------------- COURSE ----------------

    if (editCourse === "") {
      alert("⚠️ Please select a course.");
      return;
    }

    // Check valid course
    if (!courses.includes(editCourse)) {
      alert("❌ Please select a valid engineering course.");
      return;
    }

    // ---------------- MARKS ----------------

    if (editMarks === "") {
      alert("⚠️ Marks are required.");
      return;
    }

    if (!Number.isInteger(Number(editMarks))) {
      alert("❌ Marks must be a whole number.");
      return;
    }

    if (
      Number(editMarks) < 0 ||
      Number(editMarks) >= 100
    ) {
      alert("❌ Marks must be between 0 and 99.");
      return;
    }

    // =================================================
    // PUT REQUEST
    // =================================================

    try {
      const response = await fetch(
        `http://localhost:3000/students/${encodeURIComponent(
          studentName
        )}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            age: Number(editAge),
            course: editCourse,
            marks: Number(editMarks),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      setEditingId(null);

      setEditAge("");
      setEditCourse("");
      setEditMarks("");

      await getStudents();

      alert("✅ Student updated successfully!");

    } catch (error) {
      console.error(error);
      alert("❌ Error while updating student.");
    }
  };

  // =================================================
  // DELETE STUDENT
  // =================================================

  const deleteStudent = async (studentName) => {

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${studentName}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/students/${encodeURIComponent(
          studentName
        )}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      await getStudents();

      alert("✅ Student deleted successfully!");

    } catch (error) {
      console.error(error);
      alert("❌ Error while deleting student.");
    }
  };

  // =================================================
  // FRONTEND UI
  // =================================================

  return (
    <div
      style={{
        fontFamily: "Arial",
        textAlign: "center",
        padding: "20px",
      }}
    >

      {/* =================================================
          TITLE
      ================================================= */}

      <h1
        style={{
          fontSize: "48px",
          marginBottom: "10px",
        }}
      >
        Student Management System
      </h1>

      {/* =================================================
          ADD STUDENT
      ================================================= */}

      <h2>Add Student</h2>

      <div
        style={{
          marginBottom: "30px",
        }}
      >

        {/* NAME */}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          maxLength="30"
          style={{
            padding: "7px",
            margin: "4px",
          }}
        />

        {/* AGE */}

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) =>
            setAge(e.target.value)
          }
          min="1"
          max="69"
          step="1"
          style={{
            padding: "7px",
            margin: "4px",
          }}
        />

        {/* COURSE DROPDOWN */}

        <select
          value={course}
          onChange={(e) =>
            setCourse(e.target.value)
          }
          style={{
            padding: "7px",
            margin: "4px",
          }}
        >

          <option value="">
            Select Course
          </option>

          {courses.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}

        </select>

        {/* MARKS */}

        <input
          type="number"
          placeholder="Marks"
          value={marks}
          onChange={(e) =>
            setMarks(e.target.value)
          }
          min="0"
          max="99"
          step="1"
          style={{
            padding: "7px",
            margin: "4px",
          }}
        />

        {/* ADD BUTTON */}

        <button
          onClick={addStudent}
          style={{
            padding: "7px 12px",
            margin: "4px",
          }}
        >
          Add Student
        </button>

      </div>

      {/* =================================================
          STUDENTS TABLE
      ================================================= */}

      <h2>Students</h2>

      <table
        border="1"
        style={{
          margin: "auto",
          borderCollapse: "collapse",
          minWidth: "800px",
        }}
      >

        <thead>

          <tr>

            <th
              style={{
                padding: "10px",
              }}
            >
              Name
            </th>

            <th
              style={{
                padding: "10px",
              }}
            >
              Age
            </th>

            <th
              style={{
                padding: "10px",
              }}
            >
              Course
            </th>

            <th
              style={{
                padding: "10px",
              }}
            >
              Marks
            </th>

            <th
              style={{
                padding: "10px",
              }}
            >
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {students.map((student) => {

            const isEditing =
              editingId === student._id;

            return (
              <tr key={student._id}>

                {/* NAME */}

                <td
                  style={{
                    padding: "8px",
                  }}
                >
                  {student.name}
                </td>

                {/* AGE */}

                <td
                  style={{
                    padding: "8px",
                  }}
                >

                  {isEditing ? (

                    <input
                      type="number"
                      value={editAge}
                      onChange={(e) =>
                        setEditAge(e.target.value)
                      }
                      min="1"
                      max="69"
                      step="1"
                      style={{
                        width: "65px",
                        padding: "5px",
                      }}
                    />

                  ) : (

                    student.age

                  )}

                </td>

                {/* COURSE */}

                <td
                  style={{
                    padding: "8px",
                  }}
                >

                  {isEditing ? (

                    <select
                      value={editCourse}
                      onChange={(e) =>
                        setEditCourse(e.target.value)
                      }
                      style={{
                        padding: "5px",
                      }}
                    >

                      <option value="">
                        Select Course
                      </option>

                      {courses.map((item) => (

                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>

                      ))}

                    </select>

                  ) : (

                    student.course ||
                    student.branch

                  )}

                </td>

                {/* MARKS */}

                <td
                  style={{
                    padding: "8px",
                  }}
                >

                  {isEditing ? (

                    <input
                      type="number"
                      value={editMarks}
                      onChange={(e) =>
                        setEditMarks(e.target.value)
                      }
                      min="0"
                      max="99"
                      step="1"
                      style={{
                        width: "65px",
                        padding: "5px",
                      }}
                    />

                  ) : (

                    student.marks ??
                    student.cgpa

                  )}

                </td>

                {/* ACTIONS */}

                <td
                  style={{
                    padding: "8px",
                  }}
                >

                  {isEditing ? (

                    <>

                      <button
                        onClick={() =>
                          updateStudent(
                            student.name
                          )
                        }
                        style={{
                          padding: "5px 8px",
                          marginRight: "5px",
                        }}
                      >
                        Save
                      </button>

                      <button
                        onClick={cancelEdit}
                        style={{
                          padding: "5px 8px",
                        }}
                      >
                        Cancel
                      </button>

                    </>

                  ) : (

                    <>

                      <button
                        onClick={() =>
                          startEdit(student)
                        }
                        style={{
                          padding: "5px 8px",
                          marginRight: "5px",
                        }}
                      >
                        Update
                      </button>

                      <button
                        onClick={() =>
                          deleteStudent(
                            student.name
                          )
                        }
                        style={{
                          padding: "5px 8px",
                        }}
                      >
                        Delete
                      </button>

                    </>

                  )}

                </td>

              </tr>
            );
          })}

        </tbody>

      </table>

    </div>
  );
}

export default App;