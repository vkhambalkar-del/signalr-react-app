import { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { Link } from 'react-router-dom';
import styles from './Grid.module.css';

ModuleRegistry.registerModules([AllCommunityModule]);

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

function generateData(count: number): RowData[] {
  const data: RowData[] = [];
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const deptRoles = roles[department];
    const role = deptRoles[Math.floor(Math.random() * deptRoles.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const salary = Math.floor(Math.random() * 100000) + 45000;
    const year = 2018 + Math.floor(Math.random() * 7);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

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

const sampleData: RowData[] = generateData(4000);

function Grid() {
  const [rowData] = useState<RowData[]>(sampleData);
  const [quickFilterText, setQuickFilterText] = useState('');

  const columnDefs = useMemo<ColDef<RowData>[]>(() => [
    { field: 'id', headerName: 'ID', width: 80, filter: 'agNumberColumnFilter' },
    {
      field: 'name',
      headerName: 'Name',
      filter: 'agTextColumnFilter',
      minWidth: 150,
      cellRenderer: (params: ICellRendererParams<RowData>) => {
        const id = params.data?.id;
        const name = params.value;
        return (
          <Link to={`/employee/${id}`} className={styles.nameLink}>
            {name}
          </Link>
        );
      },
    },
    { field: 'email', headerName: 'Email', filter: 'agTextColumnFilter', minWidth: 200 },
    { field: 'department', headerName: 'Department', filter: 'agSetColumnFilter', minWidth: 130 },
    { field: 'role', headerName: 'Role', filter: 'agTextColumnFilter', minWidth: 180 },
    {
      field: 'salary',
      headerName: 'Salary',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => params.value ? `$${params.value.toLocaleString()}` : '',
      minWidth: 120
    },
    { field: 'startDate', headerName: 'Start Date', filter: 'agDateColumnFilter', minWidth: 120 },
    {
      field: 'status',
      headerName: 'Status',
      filter: 'agSetColumnFilter',
      cellStyle: (params) => {
        if (params.value === 'Active') return { color: '#22c55e' };
        if (params.value === 'On Leave') return { color: '#f59e0b' };
        if (params.value === 'Inactive') return { color: '#ef4444' };
        return null;
      },
      minWidth: 100
    },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
  }), []);

  return (
    <div className={`${styles.container} fullscreen`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Employee Directory</h1>
        <Link to="/" className={styles.backLink}>Back to SignalR Demo</Link>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search across all columns..."
          value={quickFilterText}
          onChange={(e) => setQuickFilterText(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.gridWrapper}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={quickFilterText}
        />
      </div>

      <div className={styles.info}>
        <p>Showing {rowData.length} employees. Use column filters or global search to filter data.</p>
      </div>
    </div>
  );
}

export default Grid;
