import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
const SurveyForm = () => {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [grid, setGrid] = useState(null);
  const [answerId, setAnswerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveyAndInitDraft = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5050/api/survey/${surveyId}`
        );
        const surveyData = data.survey;
        setSurvey(surveyData);

        const emptyGrid = surveyData.grid.rows.map((row) => ({
          cells: row.cells.map((cell) => ({
            type: cell.type,
            value: cell.type === "checkbox" ? false : "",
          })),
        }));

        const { data: answer } = await axios.post(
          "http://localhost:5050/api/answersOfSurvey/create",
          {
            surveyId,
            grid: { rows: emptyGrid },
            editable: true,
          }
        );

        setAnswerId(answer._id);
        setGrid(answer.grid);
        setLoading(false);
      } catch (err) {
        console.error("Błąd ładowania ankiety lub tworzenia draftu", err);
      }
    };

    fetchSurveyAndInitDraft();
  }, [surveyId]);

  const handleChange = (rowIdx, colIdx, value) => {
    const updatedGrid = JSON.parse(JSON.stringify(grid));
    updatedGrid.rows[rowIdx].cells[colIdx].value = value;
    setGrid(updatedGrid);
    debouncedSaveDraft(updatedGrid);
  };

  const debouncedSaveDraft = debounce(async (gridToSave) => {
    try {
      await axios.put(`http://localhost:5050/api/answersOfSurvey/${answerId}`, {
        grid: gridToSave,
        editable: true,
      });
    } catch (err) {
      console.error("Błąd zapisu wersji roboczej", err);
    }
  }, 1000);

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5050/api/answersOfSurvey/${answerId}`, {
        grid,
        editable: false,
      });
      alert("Odpowiedź została wysłana.");
    } catch (err) {
      console.error("Błąd wysyłania odpowiedzi", err);
    }
  };

  if (loading || !survey || !grid) return <p>Ładowanie...</p>;

  return (
    // <div className="container mt-4 animate__animated animate__fadeIn">
    <div className="container mt-4">
      <button
        className="btn btn-outline-secondary mb-3 d-flex align-items-center gap-2"
        onClick={() => {
          if (
            isDirty &&
            !window.confirm(
              "Masz niezapisane zmiany. Czy na pewno chcesz opuścić formularz?"
            )
          )
            return;
          navigate("/");
        }}
      >
        <i className="bi bi-arrow-left"></i>
        Powrót do listy ankiet
      </button>
      <h3>{survey.title}</h3>
      <p>{survey.description}</p>
      <form onSubmit={(e) => e.preventDefault()}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th></th>
              {survey.grid.columnHeadings.map((col, colIdx) => (
                <th key={colIdx}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {survey.grid.rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <th>{row.rowHeading}</th>
                {row.cells.map((cell, colIdx) => {
                  const isEditable = true;
                  const answerCell = grid.rows[rowIdx].cells[colIdx];
                  return (
                    <td key={colIdx}>
                      {renderInput(answerCell, isEditable, (val) =>
                        handleChange(rowIdx, colIdx, val)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="d-flex gap-2">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => debouncedSaveDraft.flush()}
          >
            Zapisz wersję roboczą
          </button>
          <button
            className="btn btn-primary"
            type="submit"
            onClick={handleSubmit}
          >
            Wyślij
          </button>
        </div>
      </form>
    </div>
  );
};

const renderInput = (cell, editable, onChange) => {
  if (!editable) return <span>{cell.value}</span>;

  switch (cell.type) {
    case "text":
      return (
        <input
          type="text"
          className="form-control"
          value={cell.value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "textarea":
      return (
        <textarea
          className="form-control"
          value={cell.value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "checkbox":
      return (
        <input
          type="checkbox"
          className="form-check-input"
          checked={cell.value}
          onChange={(e) => onChange(e.target.checked)}
        />
      );
    default:
      return <span className="text-danger">Nieznany typ</span>;
  }
};

export default SurveyForm;
