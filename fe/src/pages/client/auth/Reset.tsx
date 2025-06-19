import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import api from "@/services/api";
import url from "@/services/url";

// Define the shape of formData and formErrors
interface FormData {
    otp: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    otp: string;
    password: string;
    confirmPassword: string;
}

interface Notification {
    message: string;
    isSuccess: boolean;
}

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");

    const [formData, setFormData] = useState<FormData>({
        otp: "",
        password: "",
        confirmPassword: "",
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({
        otp: "",
        password: "",
        confirmPassword: "",
    });
    const [notification, setNotification] = useState<Notification | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: "" });
        setNotification(null);
    };

    const validateForm = () => {
        let valid = true;
        const newErrors: FormErrors = {
            otp: "",
            password: "",
            confirmPassword: "",
        };

        if (!formData.otp) {
            newErrors.otp = "Vui lòng nhập mã OTP.";
            valid = false;
        } else if (!/^\d{6}$/.test(formData.otp)) {
            newErrors.otp = "Mã OTP phải là 6 chữ số.";
            valid = false;
        }

        if (!formData.password) {
            newErrors.password = "Vui lòng nhập mật khẩu mới.";
            valid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
            valid = false;
        }

        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
            valid = false;
        }

        setFormErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await api.post(url.AUTH.RESET_PASSWORD, {
                    token: formData.otp,
                    newPassword: formData.password,
                    email: email,
                });
                setNotification({ message: response.data, isSuccess: true });
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } catch (error) {
                let errorMessage =
                    "Đã xảy ra lỗi trong quá trình đặt lại mật khẩu của bạn";
                if (axios.isAxiosError(error)) {
                    errorMessage = error.response?.data || error.message;
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
                    30Shine
                </a>
                <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
                    <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Đổi mật khẩu
                    </h2>
                    <form
                        className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label
                                htmlFor="otp"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Mã OTP
                            </label>
                            <input
                                type="text"
                                name="otp"
                                id="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Enter 6-digit OTP"
                                required
                            />
                            {formErrors.otp && (
                                <p className="text-sm text-red-500">
                                    {formErrors.otp}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Mật khẩu mới
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="••••••••"
                                required
                            />
                            {formErrors.password && (
                                <p className="text-sm text-red-500">
                                    {formErrors.password}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Xác nhận mật khẩu
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirm-password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="••••••••"
                                required
                            />
                            {formErrors.confirmPassword && (
                                <p className="text-sm text-red-500">
                                    {formErrors.confirmPassword}
                                </p>
                            )}
                        </div>
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="newsletter"
                                    aria-describedby="newsletter"
                                    type="checkbox"
                                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                    required
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label
                                    htmlFor="newsletter"
                                    className="font-light text-gray-500 dark:text-gray-300"
                                >
                                    Tôi chấp nhận{" "}
                                    <a
                                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                        href="#"
                                    >
                                        Điều khoản và điều kiện
                                    </a>
                                </label>
                            </div>
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
                            className="w-full text-white bg-blue-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-900 dark:hover:bg-blue-800 dark:focus:ring-blue-800 disabled:opacity-50"
                        >
                            Đặt lại mật khẩu
                        </button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Quay lại{" "}
                            <Link
                                to="/login"
                                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                            >
                                Đăng nhập
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
}
