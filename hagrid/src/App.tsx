import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  ProjectSearch  from './../src/pages/home';
import  IndexMe  from './../src/pages/indexme';
import  Search  from './../src/pages/searchresult';
import './App.css';


function App() {
  return (
    <Router>
       <Routes>
        <Route path="/" element={<ProjectSearch />} />
        <Route path="/index" element={<IndexMe />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;