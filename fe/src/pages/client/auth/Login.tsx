import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import api from "@/services/api";
import url from "@/services/url";
import routes from "@/config/routes";
import { toast } from 'react-toastify';

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
    role: string;
    userId?: number;
    fullName?: string;
    message?: string;
}

export function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const returnTo = searchParams.get("returnTo") || "/";

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({
        email: "",
        password: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const role = localStorage.getItem("user_role");
        if (token && role) {
            if (role.includes("ROLE_CUSTOMER")) {
                navigate(returnTo);
            } else {
                navigate("/login");
            }
        }
        setLoading(false);
    }, [navigate, returnTo]);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: "" });
    };

    const validateForm = () => {
        let valid = true;
        const newErrors: FormErrors = { email: "", password: "" };

        if (!formData.email) {
            newErrors.email = "Vui lòng nhập email của bạn.";
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Vui lòng nhập địa chỉ email hợp lệ.";
            valid = false;
        }

        if (!formData.password) {
            newErrors.password = "Vui lòng nhập mật khẩu của bạn.";
            valid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
            valid = false;
        } else if (formData.password.length > 50) {
            newErrors.password = "Mật khẩu phải có ít hơn 50 ký tự.";
            valid = false;
        }

        setFormErrors(newErrors);
        return valid;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            try {
                const response = await api.post<AuthResponse>(
                    url.AUTH.LOGIN,
                    formData
                );
                localStorage.setItem("access_token", response.data.token);
                localStorage.setItem("user_role", response.data.role);

                if (response.data.userId !== undefined && response.data.fullName !== undefined) {
                    localStorage.setItem("user", JSON.stringify({
                        userId: response.data.userId,
                        fullName: response.data.fullName,
                        email: formData.email,
                    }));
                } else {
                    console.warn("Login API did not return userId or fullName.");
                }

                toast.success("Đăng nhập thành công!", { autoClose: 2000 });
                setTimeout(() => {
                    if (response.data.role.includes("ROLE_CUSTOMER")) {
                        navigate(returnTo);
                    } else {
                        navigate("/");
                    }
                }, 0);
            } catch (error) {
                let errorMessage = "Đã xảy ra lỗi trong quá trình đăng nhập";
                if (axios.isAxiosError(error)) {
                    errorMessage =
                        error.response?.data?.message || error.message;
                }
                toast.error(errorMessage, { autoClose: 3000 });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <section className="bg-light-cream"> {/* Thay bg-gray-50 thành bg-light-cream, bỏ dark mode */}
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
               
                <div className="w-full bg-white rounded-lg shadow border border-soft-gray md:mt-0 sm:max-w-md xl:p-0"> {/* Thay dark-bg-gray-800 dark-border-gray-700 thành border-soft-gray */}
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-dark-brown md:text-2xl font-serif"> {/* Thay text-gray-900 dark:text-white thành text-dark-brown, thêm font-serif */}
                            Đăng nhập vào tài khoản của bạn
                        </h1>
                        <form
                            className="space-y-4 md:space-y-6"
                            onSubmit={handleLogin}
                        >
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-dark-brown" 
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-soft-gray border border-soft-gray text-dark-brown rounded-lg focus:ring-accent-gold focus:border-accent-gold block w-full p-2.5" 
                                    placeholder="name@company.com"
                                />
                                {formErrors.email && (
                                    <p className="text-sm text-red-500">
                                        {formErrors.email}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-dark-brown" 
                                >
                                    Mật khẩu
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="bg-soft-gray border border-soft-gray text-dark-brown rounded-lg focus:ring-accent-gold focus:border-accent-gold block w-full p-2.5" 
                                />
                                {formErrors.password && (
                                    <p className="text-sm text-red-500">
                                        {formErrors.password}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="showPassword"
                                    checked={showPassword}
                                    onChange={handleTogglePassword}
                                    className="w-4 h-4 border border-medium-gray rounded bg-soft-gray focus:ring-3 focus:ring-accent-gold" 
                                />
                                <label
                                    htmlFor="showPassword"
                                    className="ml-2 text-sm font-medium text-dark-brown" 
                                >
                                    Hiển thị mật khẩu
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="remember"
                                            aria-describedby="remember"
                                            type="checkbox"
                                            className="w-4 h-4 border border-medium-gray rounded bg-soft-gray focus:ring-3 focus:ring-accent-gold" 
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label
                                            htmlFor="remember"
                                            className="text-medium-gray" 
                                        >
                                            Ghi nhớ tôi
                                        </label>
                                    </div>
                                </div>
                                <Link
                                    to={routes.forgot}
                                    className="text-accent-gold hover:underline" 
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full text-light-cream bg-black-soft hover:bg-dark-brown focus:ring-4 focus:outline-none focus:ring-accent-gold font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50" /* Thay đổi màu nền, hover, focus ring */
                            >
                                {loading ? "Đang tải..." : "Đăng nhập"}
                            </button>
                            <p className="text-sm font-light text-medium-gray text-center"> 
                                Bạn chưa có tài khoản?{" "}
                                <Link
                                    to={routes.register}
                                    className="font-medium text-accent-gold hover:underline" 
                                >
                                    Đăng ký
                                </Link>
                            </p>
                            <p className="text-sm font-light text-medium-gray text-center"> 
                                <Link
                                    to={routes.home}
                                    className="font-medium text-accent-gold hover:underline" 
                                >
                                   Về trang chủ
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}