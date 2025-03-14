import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function SurveyDetails() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null); 
  const [message, setMessage] = useState(""); 

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/api/survey/${id}`
        );
        setSurvey(response.data.survey);
      } catch (error) {
        console.error("Błąd podczas pobierania ankiety:", error);
        setMessage("Wystąpił błąd podczas ładowania ankiety.");
      }
    };
    fetchSurvey();
  }, [id]);

  if (!survey) {
    return <div>Ładowanie ankiety...</div>;
  }

  return (
    <div className="container">
      <h1>{survey.title}</h1>
      <p>{survey.description}</p>

      <div style={{ position: "relative" }}>
        <table border="1"
        style={{margin: "0 auto", borderCollapse: "collapse", marginBottom: "20px"}}>
          <thead>
            <tr>
              <th></th>
              {survey.grid.columnHeadings.map((heading, colIndex) => (
                <th key={colIndex}>
                  <strong>{heading}</strong>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {survey.grid.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>
                  <strong>{row.rowHeading}</strong>
                </td>
                {row.cells.map((cell, cellIndex) => (
                  <td key={cellIndex}>
                    <span style={{ color: "gray" }}>{cell.type}</span>
                    <div>{cell.value}</div> 
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to={`/surveys/edit/${id}`} className="btn btn-warning">
        Edytuj ankietę
      </Link>
      <Link to="/" className="btn btn-secondary ms-2">
        Powrót do listy
      </Link>
    </div>
  );
}

export default SurveyDetails;
