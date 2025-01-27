import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { useMutation } from 'react-query';
import useAuthStore from '../../store/authStore';

import api from 'api';
import LoadingPage from "../../components/LoadingPage";
import TeacherLayout from './TeacherLayout';
import StudentLayout from './StudentLayout';



const MainLayout = () => {

   const { token, setUser, logout, user } = useAuthStore();


   const mutation = useMutation(
      async () => {
         const response = await api.get('/auth/me');
         return response;
      },
      {
         retry: 1, // Thử lại tối đa 3 lần khi gặp lỗi
         onSuccess: ({ data }) => {
            data && setUser(data);
         },
         onError: (error) => {
            console.log(error);
            logout();
         },
      }
   )

   useEffect(() => {
      mutation.mutate();
   }, []);

   if (!token) return <Navigate to="/auth" />
   else return (
      <>
         {mutation.isLoading
            ? <LoadingPage />
            : <>
               {user?.career == 1 ? <TeacherLayout /> : <StudentLayout />}
            </>
         }
      </>

   );
}


export default MainLayout;
