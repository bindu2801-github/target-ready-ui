import { Route, Routes } from "react-router-dom";
import Student from "./Student";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import NotFound from "./NotFound";
import Calendar from "./Calendar";
import TimeTable from "./TimeTable/index";

const PageRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/about" element={<About />} />
      <Route exact path="/contact" element={<Contact />} />
      <Route exact path="/student" element={<Student />} />
      <Route exact path="/calendar" element={<Calendar />} />
      <Route exact path="/timetable" element={<TimeTable />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
export default PageRoutes;
