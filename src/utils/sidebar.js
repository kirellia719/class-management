import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import CottageRoundedIcon from '@mui/icons-material/CottageRounded';

import Courses from "../pages/Courses"
import ExamPage from "../pages/ExamPage"
import Dashboard from '../pages/Dashboad';
import Course from '../pages/Course';

const sidebar = [
    {
        label: 'Trang chủ',
        icon: CottageRoundedIcon,
        link: '/',
        element: Dashboard,
        isSidebar: true,
    },
    {
        label: 'Khoá học',
        icon: PeopleAltRoundedIcon,
        link: '/courses/:courseId',
        element: Course,
        isSidebar: false,
    },
    {
        label: 'Khoá học',
        icon: PeopleAltRoundedIcon,
        link: '/courses',
        element: Courses,
        isSidebar: true,
    },
    {
        label: 'Đề thi',
        icon: MenuBookRoundedIcon,
        link: '/exams',
        element: ExamPage,
        isSidebar: true,
    }
]

export default sidebar;