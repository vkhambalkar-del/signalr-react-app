import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setSearchText, type Employee } from '../store/slices/employeesSlice';
import styles from './Grid.module.css';

ModuleRegistry.registerModules([AllCommunityModule]);

function Grid() {
  const dispatch = useAppDispatch();
  const employees = useAppSelector((state) => state.employees.data);
  const searchText = useAppSelector((state) => state.employees.searchText);

  const columnDefs = useMemo<ColDef<Employee>[]>(() => [
    { field: 'id', headerName: 'ID', width: 80, filter: 'agNumberColumnFilter' },
    {
      field: 'name',
      headerName: 'Name',
      filter: 'agTextColumnFilter',
      minWidth: 150,
      cellRenderer: (params: ICellRendererParams<Employee>) => {
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchText(e.target.value));
  };

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
          value={searchText}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.gridWrapper}>
        <AgGridReact
          rowData={employees}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={searchText}
        />
      </div>

      <div className={styles.info}>
        <p>Showing {employees.length} employees. Use column filters or global search to filter data.</p>
      </div>
    </div>
  );
}

export default Grid;
