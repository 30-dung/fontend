import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "@/services/api";
import url from "@/services/url";
import { toast } from 'react-toastify';
import routes from "@/config/routes";

// Define the shape of formData and formErrors
interface FormData {
    email: string;
}

interface FormErrors {
    email: string;
}

export function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        email: "",
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({
        email: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: "" });
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
                toast.success(response.data, { autoClose: 2000 });
                setTimeout(() => {
                    navigate(`/reset_password?email=${formData.email}`);
                }, 2000);
            } catch (error) {
                let errorMessage =
                    "Đã xảy ra lỗi trong quá trình xử lý yêu cầu của bạn";
                if (axios.isAxiosError(error)) {
                    errorMessage = error.response?.data || error.message;
                }
                toast.error(errorMessage, { autoClose: 3000 });
            }
        }
    };

    return (
        <section className="bg-light-cream"> {/* Thay bg-gray-50 thành bg-light-cream, bỏ dark mode */}
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
               
                <div className="w-full p-6 bg-white rounded-lg shadow border border-soft-gray md:mt-0 sm:max-w-md"> {/* Thay dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8 thành border-soft-gray */}
                    <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-dark-brown md:text-2xl font-serif"> {/* Thay text-gray-900 dark:text-white thành text-dark-brown, thêm font-serif */}
                        Đổi mật khẩu
                    </h2>
                    <form
                        className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-dark-brown" 
                            >
                                Email của bạn
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-soft-gray border border-soft-gray text-dark-brown text-sm rounded-lg focus:ring-accent-gold focus:border-accent-gold block w-full p-2.5" 
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
                                    className="w-4 h-4 border border-medium-gray rounded bg-soft-gray focus:ring-3 focus:ring-accent-gold" 
                                    required
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label
                                    htmlFor="newsletter"
                                    className="font-light text-medium-gray" 
                                >
                                    Tôi chấp nhận{" "}
                                    <a
                                        className="font-medium text-accent-gold hover:underline" 
                                        href="#"
                                    >
                                        Điều khoản và điều kiện
                                    </a>
                                </label>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full text-light-cream bg-black-soft hover:bg-dark-brown focus:ring-4 focus:outline-none focus:ring-accent-gold font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50" /* Thay đổi màu nền, hover, focus ring */
                        >
                            Gửi mã đặt lại
                        </button>
                        <p className="text-sm font-light text-medium-gray text-center"> 
                            Quay lại{" "}
                            <Link
                                to={routes.login}
                                className="font-medium text-accent-gold hover:underline" 
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