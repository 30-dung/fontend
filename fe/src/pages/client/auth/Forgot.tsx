import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "@/services/api";
import url from "@/services/url";

// Define the shape of formData and formErrors
interface FormData {
    email: string;
}

interface FormErrors {
    email: string;
}

interface Notification {
    message: string;
    isSuccess: boolean;
}

export function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        email: "",
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({
        email: "",
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
        const newErrors: FormErrors = { email: "" };

        if (!formData.email) {
            newErrors.email = "Vui lòng nhập địa chỉ email của bạn.";
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Địa chỉ email không hợp lệ.";
            valid = false;
        }

        setFormErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await api.post(url.AUTH.FORGOT_PASSWORD, {
                    email: formData.email,
                });
                setNotification({ message: response.data, isSuccess: true });
                setTimeout(() => {
                    navigate(`/reset_password?email=${formData.email}`);
                }, 2000);
            } catch (error) {
                let errorMessage =
                    "Đã xảy ra lỗi trong quá trình xử lý yêu cầu của bạn";
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
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Email của bạn
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="name@company.com"
                                required
                            />
                            {formErrors.email && (
                                <p className="text-sm text-red-500">
                                    {formErrors.email}
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
                            Gửi mã đặt lại
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
