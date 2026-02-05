import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

import Login from './pages/Login';
import Register from './pages/Register';

import TeacherHome from './pages/Teacher/Home';
import TeacherGrades from './pages/Teacher/Grades';
import StudentBoletim from './pages/Student/Boletim';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/teacher" element={
            <ProtectedRoute allowedRole="teacher">
              <MainLayout>
                <Routes>
                  <Route path="/" element={<TeacherHome />} />
                  <Route path="/grades" element={<TeacherGrades />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />

           <Route path="/teacher/*" element={
             <ProtectedRoute allowedRole="teacher">
               <MainLayout>
                  <Routes>
                    <Route path="/" element={<TeacherHome />} />
                    <Route path="grades" element={<TeacherGrades />} />
                  </Routes>
               </MainLayout>
             </ProtectedRoute>
           } />

          <Route path="/student/*" element={
            <ProtectedRoute allowedRole="student">
              <MainLayout>
                <Routes>
                  <Route path="/" element={<StudentBoletim />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}