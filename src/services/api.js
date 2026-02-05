// Simulação de API com dados mockados e localStorage
const MOCK_TEACHERS = [
  { id: 1, name: "Ana Souza", user: "ana.mat", pass: "123456", subject: "Matemática" },
  { id: 2, name: "Carlos Lima", user: "carlos.port", pass: "123456", subject: "Português" },
  { id: 3, name: "Juliana Rocha", user: "juliana.hist", pass: "123456", subject: "História" },
  { id: 4, name: "Marcos Pereira", user: "marcos.cien", pass: "123456", subject: "Ciências" },
  { id: 5, name: "Diogo Nascimento", user: "diogo.info", pass: "123456", subject: "Informática" },
];

export const api = {
  // Simula Login (Professor ou Aluno)
  login: async (emailOrUser, password) => {
    const teacher = MOCK_TEACHERS.find(t => t.user === emailOrUser && t.pass === password);
    if (teacher) return { user: teacher, role: 'teacher' };


    const students = JSON.parse(localStorage.getItem('db_students')) || [];
    const student = students.find(s => s.email === emailOrUser && s.password === password);
    if (student) return { user: student, role: 'student' };

    throw new Error("Credenciais inválidas");
  },

  registerStudent: async (studentData) => {
    const students = JSON.parse(localStorage.getItem('db_students')) || [];
    if(students.find(s => s.matricula === studentData.matricula)) {
        throw new Error("Matrícula já cadastrada");
    }
    const newStudent = { ...studentData, grades: [] }; // Grades inicia vazio
    students.push(newStudent);
    localStorage.setItem('db_students', JSON.stringify(students));
    return newStudent;
  },

  // Buscar Aluno por Matrícula (Para o Professor) 
  getStudentByMatricula: async (matricula) => {
    const students = JSON.parse(localStorage.getItem('db_students')) || [];
    return students.find(s => s.matricula === matricula);
  },

  // Lançar Nota (Professor) [cite: 27, 36]
  updateGrades: async (matricula, subject, newGrades) => {
    const students = JSON.parse(localStorage.getItem('db_students')) || [];
    const index = students.findIndex(s => s.matricula === matricula);
    
    if (index !== -1) {
      const otherGrades = students[index].grades.filter(g => g.subject !== subject);
      students[index].grades = [...otherGrades, { subject, ...newGrades }];
      
      localStorage.setItem('db_students', JSON.stringify(students));
      return true;
    }
    return false;
  }
};