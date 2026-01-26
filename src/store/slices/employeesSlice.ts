import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  startDate: string;
  status: string;
}

interface EmployeesState {
  data: Employee[];
  searchText: string;
  selectedEmployee: Employee | null;
}

const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Lisa', 'James', 'Jennifer', 'Robert', 'Amanda', 'Christopher', 'Jessica', 'Daniel', 'Michelle', 'Kevin', 'Ashley', 'Matthew', 'Stephanie', 'Andrew', 'Nicole', 'Joshua', 'Elizabeth', 'Ryan', 'Megan', 'Brandon', 'Lauren', 'Justin', 'Rachel', 'William', 'Samantha', 'Anthony', 'Katherine', 'Brian', 'Heather', 'Eric', 'Rebecca', 'Steven', 'Amy', 'Timothy', 'Melissa'];
const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Martinez', 'Garcia', 'Lee', 'White', 'Thomas', 'Harris', 'Clark', 'Robinson', 'Lewis', 'Walker', 'Hall', 'Young', 'King', 'Wright', 'Scott', 'Green', 'Adams', 'Baker', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Morris', 'Murphy'];
const departments = ['Engineering', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations', 'IT', 'Legal', 'Customer Support', 'Product'];
const roles: Record<string, string[]> = {
  'Engineering': ['Senior Developer', 'Junior Developer', 'Tech Lead', 'DevOps Engineer', 'QA Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Software Architect', 'Principal Engineer'],
  'Marketing': ['Marketing Manager', 'Content Writer', 'SEO Specialist', 'Social Media Manager', 'Brand Strategist', 'Marketing Analyst', 'Campaign Manager', 'Creative Director'],
  'HR': ['HR Specialist', 'HR Manager', 'Recruiter', 'Training Coordinator', 'Compensation Analyst', 'HR Business Partner', 'Talent Acquisition Lead'],
  'Finance': ['Financial Analyst', 'Accountant', 'Controller', 'Finance Manager', 'Auditor', 'Budget Analyst', 'Treasury Analyst', 'CFO'],
  'Sales': ['Sales Representative', 'Sales Manager', 'Account Executive', 'Business Development Rep', 'Sales Director', 'Regional Sales Manager', 'Inside Sales Rep'],
  'Operations': ['Operations Manager', 'Project Manager', 'Business Analyst', 'Operations Coordinator', 'Supply Chain Manager', 'Logistics Specialist'],
  'IT': ['System Administrator', 'Network Engineer', 'IT Support Specialist', 'Security Analyst', 'Database Administrator', 'IT Manager', 'Help Desk Technician'],
  'Legal': ['Legal Counsel', 'Paralegal', 'Compliance Officer', 'Contract Manager', 'Legal Assistant', 'General Counsel'],
  'Customer Support': ['Support Specialist', 'Customer Success Manager', 'Support Team Lead', 'Technical Support Engineer', 'Account Manager'],
  'Product': ['Product Manager', 'Product Owner', 'UX Designer', 'UI Designer', 'Product Analyst', 'Scrum Master']
};
const statuses = ['Active', 'Active', 'Active', 'Active', 'Active', 'Active', 'Active', 'Active', 'On Leave', 'Inactive'];

function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function generateEmployees(count: number): Employee[] {
  const data: Employee[] = [];
  for (let i = 1; i <= count; i++) {
    const random = seededRandom(i);
    const firstName = firstNames[Math.floor(random() * firstNames.length)];
    const lastName = lastNames[Math.floor(random() * lastNames.length)];
    const department = departments[Math.floor(random() * departments.length)];
    const deptRoles = roles[department];
    const role = deptRoles[Math.floor(random() * deptRoles.length)];
    const status = statuses[Math.floor(random() * statuses.length)];
    const salary = Math.floor(random() * 100000) + 45000;
    const year = 2018 + Math.floor(random() * 7);
    const month = String(Math.floor(random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(random() * 28) + 1).padStart(2, '0');

    data.push({
      id: i,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      department,
      role,
      salary,
      startDate: `${year}-${month}-${day}`,
      status,
    });
  }
  return data;
}

const initialState: EmployeesState = {
  data: generateEmployees(4000),
  searchText: '',
  selectedEmployee: null,
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    selectEmployee: (state, action: PayloadAction<number>) => {
      state.selectedEmployee = state.data.find(emp => emp.id === action.payload) || null;
    },
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
    },
  },
});

export const { setSearchText, selectEmployee, clearSelectedEmployee } = employeesSlice.actions;
export default employeesSlice.reducer;
