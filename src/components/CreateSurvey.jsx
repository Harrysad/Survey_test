import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GridSelect from "./GridSelect";
import axios from "axios";

function CreateSurvey() {
  const [grid, setGrid] = useState({
    columnHeadings: [""],
    rows: [{ rowHeading: "", cells: [{ type: "text", value: "" }] }],
  });

  const [selectedCell, setSelectedCell] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const surveyData = {
      title,
      description,
      grid,
    };

    try {
      const response = await axios.post(
        "http://localhost:5050/api/survey/create",
        surveyData
      );
      if (response.status === 201) {
        setMessage("Ankieta zapisana!");
        setTimeout(() => {
          setMessage("");
          navigate("/");
        }, 2000);

        setTitle("");
        setDescription("");
        setGrid({
          columnHeadings: [""],
          rows: [{ rowHeading: "", cells: [{ type: "text", value: "" }] }],
        });
      }
    } catch (error) {
      console.error("Błąd podczas zapisywania ankiety:", error);
      setMessage("Wystąpił błąd podczas zapisu. Spróbuj ponownie.");
    }
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

  const removeColumn = () => {
    setGrid((prev) => {
      if (prev.columnHeadings.length > 1) {
        const newColumnHeadings = prev.columnHeadings.slice(0, -1);
        const newRows = prev.rows.map((row) => ({
          ...row,
          cells: row.cells.slice(0, -1),
        }));
        return {
          columnHeadings: newColumnHeadings,
          rows: newRows,
        };
      }
      return prev;
    });
  };

  const removeRow = () => {
    setGrid((prev) => {
      if (prev.rows.length > 1) {
        const newRows = prev.rows.slice(0, -1);
        return { ...prev, rows: newRows };
      }
      return prev;
    });
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

  const handleCellClick = (rowIndex, cellIndex) => {
    setSelectedCell({ rowIndex, cellIndex });
    setShowDropdown(true);
  };

  const changeCellType = (type) => {
    if (!selectedCell) return;

    const { rowIndex, cellIndex } = selectedCell;
    const newRows = [...grid.rows];
    newRows[rowIndex].cells[cellIndex].type = type;
    setGrid((prev) => ({ ...prev, rows: newRows }));

    setShowDropdown(false);
    setSelectedCell(null);
  };

  return (
    <div className="container">
      <h1>Stwórz nową ankietę</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Tytuł
          </label>
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
          <label htmlFor="description" className="form-label">
            Opis
          </label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">
          Zapisz ankietę
        </button>
        <Link to="/" className="btn btn-secondary ms-2">
          Powrót do listy
        </Link>
      </form>

      <div style={{ position: "relative" }}>
        <button onClick={addRow} className="btn btn-secondary">
          Dodaj wiersz
        </button>
        <button onClick={addColumn} className="btn btn-secondary m-2">
          Dodaj kolumnę
        </button>
        <button onClick={removeRow} className="btn btn-danger m-2">
          Usuń wiersz
        </button>
        <button onClick={removeColumn} className="btn btn-danger m-2">
          Usuń kolumnę
        </button>

        <table border="1">
          <thead>
            <tr>
              <th></th>
              {grid.columnHeadings.map((heading, colIndex) => (
                <th key={colIndex}>
                  <input
                    type="text"
                    value={heading}
                    onChange={(e) =>
                      handleColumnHeadingChange(colIndex, e.target.value)
                    }
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
                    onChange={(e) =>
                      handleRowHeadingChange(rowIndex, e.target.value)
                    }
                  />
                </td>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    onClick={() => handleCellClick(rowIndex, cellIndex)}
                  >
                    {!(
                      selectedCell &&
                      selectedCell.rowIndex === rowIndex &&
                      selectedCell.cellIndex === cellIndex
                    ) && <span style={{ color: "gray" }}>{cell.type}</span>}

                    {selectedCell &&
                      selectedCell.rowIndex === rowIndex &&
                      selectedCell.cellIndex === cellIndex && (
                        <GridSelect onSelect={changeCellType} />
                      )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CreateSurvey;
