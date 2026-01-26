import { useParams, Link } from 'react-router-dom';
import styles from './EmployeeDetails.module.css';

interface RowData {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  startDate: string;
  status: string;
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

function getEmployeeById(id: number): RowData | null {
  if (id < 1 || id > 4000) return null;

  const random = seededRandom(id);
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

  return {
    id,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@example.com`,
    department,
    role,
    salary,
    startDate: `${year}-${month}-${day}`,
    status,
  };
}

function EmployeeDetails() {
  const { id } = useParams<{ id: string }>();
  const employeeId = parseInt(id || '0', 10);
  const employee = getEmployeeById(employeeId);

  if (!employee) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Employee Not Found</h1>
          <p className={styles.notFound}>No employee found with ID: {id}</p>
          <Link to="/grid" className={styles.backLink}>Back to Employee Grid</Link>
        </div>
      </div>
    );
  }

  const getStatusClass = (status: string) => {
    if (status === 'Active') return styles.statusActive;
    if (status === 'On Leave') return styles.statusOnLeave;
    return styles.statusInactive;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{employee.name}</h1>
          <span className={`${styles.status} ${getStatusClass(employee.status)}`}>
            {employee.status}
          </span>
        </div>

        <div className={styles.details}>
          <div className={styles.row}>
            <span className={styles.label}>Employee ID</span>
            <span className={styles.value}>{employee.id}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{employee.email}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Department</span>
            <span className={styles.value}>{employee.department}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Role</span>
            <span className={styles.value}>{employee.role}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Salary</span>
            <span className={styles.value}>${employee.salary.toLocaleString()}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Start Date</span>
            <span className={styles.value}>{employee.startDate}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Link to="/grid" className={styles.backLink}>Back to Employee Grid</Link>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetails;
