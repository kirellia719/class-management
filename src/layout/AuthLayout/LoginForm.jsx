import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/authStore';
import { Button } from '@mui/material';

import api from "api";

const LoginForm = () => {
    const [input, setInput] = useState({ username: '', password: '' });

    const [error, setError] = useState("")

    const { setToken } = useAuthStore();

    const loginMutation = useMutation(
        async (user) => {
            const response = await api.post(`/auth/login`, user);
            return response;
        },
        {
            onSuccess: (response) => {
                const { message, data } = response;
                toast.success(message, { autoClose: 1000, position: 'top-center' });
                setToken(data);
            },
            onError: (error) => {
                console.error(error);
                setError(error.response?.data?.message || "Không thể đăng nhập");
            }
        }
    )

    const handleChange = (e) => {
        setError("");
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation.mutate(input);
    };
    return (
        <div className="login-form">
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <h1>Đăng nhập</h1>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Tài khoản"
                            required
                            value={input.username}
                            onChange={handleChange}
                            name="username"
                            disabled={loginMutation.isLoading}
                        />
                        <PersonIcon className='icon' />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={input.password}
                            onChange={handleChange}
                            name='password'
                            required
                            disabled={loginMutation.isLoading}
                        />
                        <LockIcon className='icon' />
                    </div>

                    {error && ( // Hiển thị lỗi nếu có
                        <div className='error-container'>
                            ~ {error || 'Đăng nhập thất bại. Vui lòng thử lại.'} ~
                        </div>
                    )}

                    <Button type="submit" className='submit-btn' loading={loginMutation.isLoading}>Vào</Button>

                    {/* <div className="register-link">
                        <p>Chưa có tài khoản? <a href="#">Đăng kí</a></p>
                    </div> */}

                    <div className="remember-forgot">
                        {/* <label htmlFor="check"><input type="checkbox" name="" id="check" /> Remember me</label> */}
                        <p>Quên mật khẩu?</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
