import "./style.scss";

import LoginForm from "./LoginForm";
import useAuthStore from "../../store/authStore";
import { Navigate } from "react-router-dom";

const AuthLayout = () => {
   const { token } = useAuthStore();
   if (token) {
      return <Navigate to="/" />;
   }
   else return (
      <div className="AuthLayout">
         <LoginForm />
      </div>
   );
};

export default AuthLayout;
