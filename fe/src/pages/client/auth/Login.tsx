import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import api from "../../../services/api";
import url from "../../../services/url";
import routes from "../../../config/routes";

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
    message?: string;
}

export function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); // NEW: Lấy query parameters
    const returnTo = searchParams.get("returnTo") || "/"; // NEW: Lấy returnTo, mặc định là "/"

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
    const [notification, setNotification] = useState<{
        message: string;
        isSuccess: boolean;
    } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const role = localStorage.getItem("user_role");
        if (token && role) {
            if (role.includes("ROLE_CUSTOMER")) {
                navigate(returnTo);
                // NEW: Chuyển hướng về returnTo
            } else {
                navigate("/login");
            }
        }
        setLoading(false);
    }, [navigate, returnTo]); // NEW: Thêm returnTo vào dependencies

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: "" });
        setNotification(null);
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
            try {
                const response = await api.post<AuthResponse>(
                    url.AUTH.LOGIN,
                    formData
                );
                localStorage.setItem("access_token", response.data.token);
                localStorage.setItem("user_role", response.data.role);
                setNotification({
                    message: "Đăng nhập thành công!",
                    isSuccess: true,
                });
                setTimeout(() => {
                    if (response.data.role.includes("ROLE_CUSTOMER")) {
                        navigate(returnTo);
                        // NEW: Chuyển hướng về returnTo
                    } else {
                        navigate("/login");
                    }
                }, 1000);
            } catch (error) {
                let errorMessage = "Đã xảy ra lỗi trong quá trình đăng nhập";
                if (axios.isAxiosError(error)) {
                    errorMessage =
                        error.response?.data?.message || error.message;
                }
                setNotification({ message: errorMessage, isSuccess: false });
            }
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a
                    href="#"
                    className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
                >
                    <img
                        className="w-8 h-8 mr-2"
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                        alt="logo"
                    />
                    Flowbite
                </a>
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
                            {notification && (
                                <p
                                    className={`text-sm p-2 rounded ${
                                        notification.isSuccess
                                            ? "text-green-500 bg-green-100"
                                            : "text-red-500 bg-red-100"
                                    }`}
                                >
                                    {notification.message}
                                </p>
                            )}
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
                                    to="/register"
                                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >
                                    Đăng ký
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
