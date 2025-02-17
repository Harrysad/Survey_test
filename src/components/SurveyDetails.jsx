import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function SurveyDetails() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/surveys/${id}`);
        setSurvey(response.data.survey);
      } catch (error) {
        console.error('Error fetching survey:', error);
      }
    };

    fetchSurvey();
  }, [id]);

  if (!survey) return <div>Ładowanie ankiety...</div>;

  return (
    <div className="container">
      <h1>{survey.title}</h1>
      <p>{survey.description}</p>

      <div>
        <h3>Pytań: </h3>
        {survey.questions.map((question, index) => (
          <div key={index}>
            <p>{question.questionType}</p>
            {/* Możesz dodać wyświetlanie pytań w zależności od typu */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SurveyDetails;