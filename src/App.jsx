import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProcessPage from './pages/ProcessPage';
import AiPlannerPage from './pages/AiPlannerPage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import GuidesPage from './pages/GuidesPage';
import GuideDetailPage from './pages/GuideDetailPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ExperiencesPage from './pages/ExperiencesPage';
import CuisinePage from './pages/CuisinePage';
import Header from './components/Header';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function PlannerShell() {
  return (
    <>
      <Header />
      <main className="vl-main vl-main--planner">
        <AiPlannerPage />
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ai-planner" element={<PlannerShell />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route element={<Layout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="process" element={<ProcessPage />} />
          <Route path="destinations" element={<DestinationsPage />} />
          <Route path="destinations/:slug" element={<DestinationDetailPage />} />
          <Route path="guides" element={<GuidesPage />} />
          <Route path="guides/:id" element={<GuideDetailPage />} />
          <Route path="book/:guideId" element={<BookingPage />} />
          <Route path="bookings/:id/pay" element={<PaymentPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogDetailPage />} />
          <Route path="experiences" element={<ExperiencesPage />} />
          <Route path="cuisine" element={<CuisinePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
