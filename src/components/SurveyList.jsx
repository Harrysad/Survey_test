import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function SurveyList() {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/survey");
        setSurveys(response.data.surveys);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    };

    fetchSurveys();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Na pewno chcesz usunąć tę ankietę?")) {
      try {
        await axios.delete(`http://localhost:5050/api/survey/${id}`);
        setSurveys(surveys.filter((survey) => survey._id !== id));
      } catch (error) {
        console.error("Error deleting survey:", error);
      }
    }
  };

  return (
    <div className="container">
      <h1>Lista Ankiet</h1>
      <Link to="/surveys/create" className="btn btn-primary mb-3">
        Utwórz ankietę{" "}
      </Link>
      <ul>
        {surveys.map((survey) => (
          <li key={survey._id}>
            <h4>{survey.title}</h4>
            <p>{survey.description}</p>

            <Link to={`/surveys/${survey._id}`} className="btn btn-info">
              Zobacz szczegóły
            </Link>

            <Link
              to={`/answers/fill/${survey._id}`}
              className="btn btn-success ms-2"
            >
              Wypełnij
            </Link>

            <button
              className="btn btn-danger ms-2"
              onClick={() => handleDelete(survey._id)}
            >
              Usuń
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SurveyList;
