import CottageRoundedIcon from '@mui/icons-material/CottageRounded';

import Dashboard from './pages/Dashboard';
import CoursePage from './pages/CoursePage';
import ExamPage from './pages/ExamPage';
import SubmissionPage from './pages/SubmissionPage';

const studentSidebar = [
    {
        label: '',
        icon: CottageRoundedIcon,
        link: '/submit/:submissionId',
        element: SubmissionPage,
        isSidebar: false,
    },
    {
        label: '',
        icon: CottageRoundedIcon,
        link: '/exam/:examId',
        element: ExamPage,
        isSidebar: false,
    },
    {
        label: '',
        icon: CottageRoundedIcon,
        link: '/:courseId',
        element: CoursePage,
        isSidebar: false,
    },
    {
        label: 'Trang chủ',
        icon: CottageRoundedIcon,
        link: '/',
        element: Dashboard,
        isSidebar: true,
    },

];


export default studentSidebar;