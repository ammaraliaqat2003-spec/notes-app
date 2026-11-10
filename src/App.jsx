
import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {

  // Get saved notes from localStorage
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  // Input fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Track editing note
  const [editingId, setEditingId] = useState(null);

  // Reference for title input
  const inputRef = useRef(null);

  // Focus input when app loads
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Save notes whenever notes change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Add or update note
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter title and content!");
      return;
    }

    if (editingId !== null) {

      // Update existing note
      setNotes(
        notes.map((note) =>
          note.id === editingId
            ? { ...note, title, content }
            : note
        )
      );

      setEditingId(null);

    } else {

      // Create new note
      const newNote = {
        id: Date.now(),
        title: title,
        content: content
      };

      setNotes([...notes, newNote]);
    }

    // Clear fields
    setTitle("");
    setContent("");

    inputRef.current.focus();
  };

  // Edit note
  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);

    inputRef.current.focus();
  };

  // Delete note
  const handleDelete = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="app">

      <h1>My Notes</h1>
      <p className="subtitle">
        Write your thoughts and ideas
      </p>

      <form className="note-form" onSubmit={handleSubmit}>

        <input
          ref={inputRef}
          type="text"
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button type="submit">
          {editingId !== null ? "Update Note" : "Add Note"}
        </button>

      </form>

      <h2>Your Notes ({notes.length})</h2>

      <div className="notes-container">

        {notes.length === 0 ? (

          <p className="empty">
            No notes yet. Add your first note!
          </p>

        ) : (

          notes.map((note) => (

            <div className="note-card" key={note.id}>

              <h3>{note.title}</h3>

              <p>{note.content}</p>

              <div className="actions">

                <button
                  className="edit-btn"
                  onClick={() => handleEdit(note)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(note.id)}
                >
                  Delete
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default App;
