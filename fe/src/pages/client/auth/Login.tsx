import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import api from "@/services/api";
import url from "@/services/url";
import routes from "@/config/routes";
import { toast } from 'react-toastify'; // Import toast

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

                toast.success("Đăng nhập thành công!", { autoClose: 2000 }); // Success toast
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
                toast.error(errorMessage, { autoClose: 3000 }); // Error toast
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
               
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Đăng nhập vào tài khoản của bạn
                        </h1>
                        <form
                            className="space-y-4 md:space-y-6"
                            onSubmit={handleLogin}
                        >
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                />
                                <label
                                    htmlFor="showPassword"
                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
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
                                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label
                                            htmlFor="remember"
                                            className="text-gray-500 dark:text-gray-300"
                                        >
                                            Ghi nhớ tôi
                                        </label>
                                    </div>
                                </div>
                                <Link
                                    to={routes.forgot}
                                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full text-white bg-shine-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50"
                            >
                                {loading ? "Đang tải..." : "Đăng nhập"}
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Bạn chưa có tài khoản?{" "}
                                <Link
                                    to={routes.register}
                                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >
                                    Đăng ký
                                </Link>
                            </p>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                               
                                <Link
                                    to={routes.home}
                                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
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