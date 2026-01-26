import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectEmployee, clearSelectedEmployee } from '../store/slices/employeesSlice';
import styles from './EmployeeDetails.module.css';

function EmployeeDetails() {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const employeeId = parseInt(id || '0', 10);

  const employee = useAppSelector((state) =>
    state.employees.data.find(emp => emp.id === employeeId)
  );

  useEffect(() => {
    if (employeeId) {
      dispatch(selectEmployee(employeeId));
    }
    return () => {
      dispatch(clearSelectedEmployee());
    };
  }, [dispatch, employeeId]);

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
