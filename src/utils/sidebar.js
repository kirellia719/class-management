import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import CottageRoundedIcon from '@mui/icons-material/CottageRounded';

import CoursePage from "../pages/CoursePage"
import ExamPage from "../pages/ExamPage"
import Dashboard from '../pages/Dashboad';

const sidebar = [
    {
        id: 0,
        label: 'Trang chủ',
        icon: CottageRoundedIcon,
        link: '/',
        element: Dashboard,
    },
    {
        id: 1,
        label: 'Khoá học',
        icon: PeopleAltRoundedIcon,
        link: '/course',
        element: CoursePage,
    },
    {
        id: 2,
        label: 'Đề thi',
        icon: MenuBookRoundedIcon,
        link: '/exam',
        element: ExamPage,
    }
]

export default sidebar;