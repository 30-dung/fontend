import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import api from "@/services/api";
import url from "@/services/url";
import { toast } from 'react-toastify';
import routes from "@/config/routes";

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: "" });
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
                toast.success(response.data, { autoClose: 2000 });
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } catch (error) {
                let errorMessage =
                    "Đã xảy ra lỗi trong quá trình đặt lại mật khẩu của bạn";
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
                                htmlFor="otp"
                                className="block mb-2 text-sm font-medium text-dark-brown" 
                            >
                                Mã OTP
                            </label>
                            <input
                                type="text"
                                name="otp"
                                id="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                className="bg-soft-gray border border-soft-gray text-dark-brown text-sm rounded-lg focus:ring-accent-gold focus:border-accent-gold block w-full p-2.5" 
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
                                className="block mb-2 text-sm font-medium text-dark-brown" 
                            >
                                Mật khẩu mới
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="bg-soft-gray border border-soft-gray text-dark-brown text-sm rounded-lg focus:ring-accent-gold focus:border-accent-gold block w-full p-2.5" 
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
                                className="block mb-2 text-sm font-medium text-dark-brown" 
                            >
                                Xác nhận mật khẩu
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirm-password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="bg-soft-gray border border-soft-gray text-dark-brown text-sm rounded-lg focus:ring-accent-gold focus:border-accent-gold block w-full p-2.5" 
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
                            Đặt lại mật khẩu
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