import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import GridSelect from "./GridSelect"; 

function EditSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedCell, setSelectedCell] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/api/survey/${id}`);
        setSurvey(response.data.survey);
      } catch (error) {
        console.error('Error fetching survey:', error);
      }
    };

    fetchSurvey();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:5050/api/survey/${id}`, survey);
      if (response.status === 200) {
        setMessage("Ankieta zaktualizowana!");
        setTimeout(() => {
          setMessage("");
          navigate(`/surveys/${id}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Błąd podczas aktualizacji ankiety:", error);
      setMessage("Wystąpił błąd podczas zapisu. Spróbuj ponownie.");
    }
  };

  const handleColumnHeadingChange = (index, value) => {
    const newHeadings = [...survey.grid.columnHeadings];
    newHeadings[index] = value;
    setSurvey((prev) => ({ ...prev, grid: { ...prev.grid, columnHeadings: newHeadings } }));
  };

  const handleRowHeadingChange = (index, value) => {
    const newRows = [...survey.grid.rows];
    newRows[index].rowHeading = value;
    setSurvey((prev) => ({ ...prev, grid: { ...prev.grid, rows: newRows } }));
  };

  const handleCellClick = (rowIndex, cellIndex) => {
    setSelectedCell({ rowIndex, cellIndex });
    setShowDropdown(true);
  };

  const changeCellType = (type) => {
    if (!selectedCell) return;

    const { rowIndex, cellIndex } = selectedCell;
    const newRows = [...survey.grid.rows];
    newRows[rowIndex].cells[cellIndex].type = type;
    setSurvey((prev) => ({ ...prev, grid: { ...prev.grid, rows: newRows } }));

    setShowDropdown(false);
    setSelectedCell(null);
  };

  const removeLastRow = () => {
    if (survey.grid.rows.length > 1) {
      const newRows = [...survey.grid.rows];
      newRows.pop();
      setSurvey((prev) => ({ ...prev, grid: { ...prev.grid, rows: newRows } }));
    }
  };

  const removeLastColumn = () => {
    if (survey.grid.columnHeadings.length > 1) {
      const newColumnHeadings = [...survey.grid.columnHeadings];
      newColumnHeadings.pop();

      const newRows = survey.grid.rows.map(row => ({
        ...row,
        cells: row.cells.slice(0, -1),
      }));

      setSurvey((prev) => ({
        ...prev,
        grid: {
          columnHeadings: newColumnHeadings,
          rows: newRows,
        },
      }));
    }
  };

  if (!survey) return <div>Ładowanie ankiety...</div>;

  return (
    <div className="container">
      <h1>Edytuj ankietę</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Tytuł
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={survey.title}
            onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
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
            value={survey.description}
            onChange={(e) => setSurvey({ ...survey, description: e.target.value })}
            rows="3"
            required
          ></textarea>
        </div>

        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => {
              setSurvey((prev) => ({
                ...prev,
                grid: {
                  ...prev.grid,
                  rows: [...prev.grid.rows, { rowHeading: "", cells: prev.grid.columnHeadings.map(() => ({ type: "text", value: "" })) }]
                }
              }));
            }}
            className="btn btn-secondary"
          >
            Dodaj wiersz
          </button>
          <button
            type="button"
            onClick={() => {
              setSurvey((prev) => ({
                ...prev,
                grid: {
                  ...prev.grid,
                  columnHeadings: [...prev.grid.columnHeadings, ""],
                  rows: prev.grid.rows.map((row) => ({
                    ...row,
                    cells: [...row.cells, { type: "text", value: "" }]
                  }))
                }
              }));
            }}
            className="btn btn-secondary m-2"
          >
            Dodaj kolumnę
          </button>

          <button
            type="button"
            onClick={removeLastRow}
            className="btn btn-danger m-2"
          >
            Usuń wiersz
          </button>
          <button
            type="button"
            onClick={removeLastColumn}
            className="btn btn-danger m-2"
          >
            Usuń kolumnę
          </button>

          <table border="1">
            <thead>
              <tr>
                <th></th>
                {survey.grid.columnHeadings.map((heading, colIndex) => (
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
              {survey.grid.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>
                    <input
                      type="text"
                      value={row.rowHeading}
                      onChange={(e) => handleRowHeadingChange(rowIndex, e.target.value)}
                    />
                  </td>
                  {row.cells.map((cell, cellIndex) => (
                    <td key={cellIndex} onClick={() => handleCellClick(rowIndex, cellIndex)}>
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

        <button type="submit" className="btn btn-primary mt-3">
          Zapisz zmiany
        </button>
        <p>{message}</p>
      </form>
    </div>
  );
}

export default EditSurvey;
