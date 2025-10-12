import MainLayout from './layouts/MainLayout'
import ClientsModule from './modules/clients/ClientsModule'
import ProjectsModule from './modules/projects/ProjectsModule'
import TasksModule from './modules/tasks/TasksModule'
import TimeRecordsModule from './modules/time-records/TimeRecordsModule'
import StatisticsModule from './modules/statistics/StatisticsModule'
import BillingModule from './modules/billing/BillingModule'
import ReportsModule from './modules/reports/ReportsModule'

const routes = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <TasksModule />, // Módulo por defecto
            },
            {
                path: 'clients',
                element: <ClientsModule />,
            },
            {
                path: 'projects',
                element: <ProjectsModule />,
            },
            {
                path: 'tasks',
                element: <TasksModule />,
            },
            {
                path: 'time-records',
                element: <TimeRecordsModule />,
            },
            {
                path: 'statistics',
                element: <StatisticsModule />,
            },
            {
                path: 'billing',
                element: <BillingModule />,
            },
            {
                path: 'reports',
                element: <ReportsModule />,
            },
        ],
    },
]

export default routes