import './App.css'
import { Route, Routes } from 'react-router-dom'
import SurveyList from './components/SurveyList'
import CreateSurvey from './components/CreateSurvey'
import SurveyDetails from './components/SurveyDetails'
import EditSurvey from './components/EditSurvey'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SurveyList />} />
        <Route path="/surveys/create" element={<CreateSurvey />} />
        <Route path="/surveys/:id" element={<SurveyDetails />} />
        <Route path="/surveys/edit/:id" element={<EditSurvey />} />
      </Routes>
    </>
  )
}

export default App