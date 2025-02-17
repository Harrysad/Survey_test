import { useState } from "react";
import { Link } from "react-router-dom";

function GridEditor() {
  const [grid, setGrid] = useState({
    title: "Podaj tytuł ankiety",
    description: "Dodaj opis ankiety", 
    columnHeadings: [""],
    rows: [{ rowHeading: "", cells: [{ type: "text", value: "" }] }],
  });

  const [contextMenu, setContextMenu] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
  };

  const addColumn = () => {
    setGrid((prev) => ({
      columnHeadings: [...prev.columnHeadings, ""],
      rows: prev.rows.map((row) => ({
        ...row,
        cells: [...row.cells, { type: "text", value: "" }],
      })),
    }));
  };

  const addRow = () => {
    setGrid((prev) => ({
      ...prev,
      rows: [
        ...prev.rows,
        {
          rowHeading: "",
          cells: prev.columnHeadings.map(() => ({ type: "text", value: "" })),
        },
      ],
    }));
  };

  const handleColumnHeadingChange = (index, value) => {
    const newHeadings = [...grid.columnHeadings];
    newHeadings[index] = value;
    setGrid((prev) => ({ ...prev, columnHeadings: newHeadings }));
  };

  const handleRowHeadingChange = (index, value) => {
    const newRows = [...grid.rows];
    newRows[index].rowHeading = value;
    setGrid((prev) => ({ ...prev, rows: newRows }));
  };

  const handleRightClick = (e, rowIndex, cellIndex) => {
    e.preventDefault();
    setSelectedCell({ rowIndex, cellIndex });
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const changeCellType = (type) => {
    if (!selectedCell) return;

    const { rowIndex, cellIndex } = selectedCell;
    const newRows = [...grid.rows];
    newRows[rowIndex].cells[cellIndex].type = type;
    setGrid((prev) => ({ ...prev, rows: newRows }));

    setContextMenu(null); 
  };

  return (
    <div className="container">
      <h1>Stwórz nową ankietę</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Tytuł</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Opis</label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">Zapisz ankietę</button>
        <Link to="/" className="btn btn-secondary ms-2">Powrót do listy</Link>
      </form>

    <div style={{ position: "relative" }}>
      <button onClick={addColumn}>Dodaj kolumnę</button>
      <button onClick={addRow}>Dodaj wiersz</button>

      <table border="1">
        <thead>
          <tr>
            <th></th>
            {grid.columnHeadings.map((heading, colIndex) => (
              <th key={colIndex}>
                <input
                  type="text"
                  value={heading}
                  onChange={(e) => handleColumnHeadingChange(colIndex, e.target.value)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>
                <input
                  type="text"
                  value={row.rowHeading}
                  onChange={(e) => handleRowHeadingChange(rowIndex, e.target.value)}
                />
              </td>
              {row.cells.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  onContextMenu={(e) => handleRightClick(e, rowIndex, cellIndex)}
                  style={{ cursor: "context-menu", position: "relative" }}
                >
                  <span style={{ color: "gray" }}>{cell.type}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {contextMenu && (
        <div
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            background: "white",
            border: "1px solid gray",
            padding: "5px",
            zIndex: 1000,
          }}
        >
          <div onClick={() => changeCellType("text")}>Tekst</div>
          <div onClick={() => changeCellType("checkbox")}>Checkbox</div>
          <div onClick={() => changeCellType("textarea")}>Textarea</div>
        </div>
      )}
    </div>
    </div>
  );
}

export default GridEditor;