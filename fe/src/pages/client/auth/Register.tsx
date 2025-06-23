import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/services/api";
import url from "@/services/url";
import { toast } from 'react-toastify'; // Import toast
import routes from "@/config/routes";

interface FormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    membershipType: string;
}

interface FormErrors {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    membershipType: string;
}

interface AuthResponse {
    token: string | null;
    role: string | null;
}

export function RegisterPage() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        membershipType: "REGULAR",
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        membershipType: "",
    });

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: "" });
    };

    const validateForm = () => {
        let valid = true;
        const newErrors: FormErrors = {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phoneNumber: "",
            membershipType: "",
        };

        if (!formData.fullName) {
            newErrors.fullName = "Vui lòng nhập họ và tên của bạn.";
            valid = false;
        }

        if (!formData.email) {
            newErrors.email = "Vui lòng nhập địa chỉ email của bạn.";
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Địa chỉ email không hợp lệ.";
            valid = false;
        }

        if (!formData.password) {
            newErrors.password = "Vui lòng nhập mật khẩu của bạn.";
            valid = false;
        } else if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                formData.password
            )
        ) {
            newErrors.password =
                "Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";
            valid = false;
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu của bạn.";
            valid = false;
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Mật khẩu không khớp.";
            valid = false;
        }

        if (!formData.phoneNumber) {
            newErrors.phoneNumber = "Vui lòng nhập số điện thoại của bạn.";
            valid = false;
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Số điện thoại phải có 10 chữ số.";
            valid = false;
        }

        if (
            !formData.membershipType ||
            !["REGULAR", "PREMIUM", "VIP"].includes(formData.membershipType)
        ) {
            newErrors.membershipType =
                "Vui lòng chọn loại hình thành viên hợp lệ.";
            valid = false;
        }

        setFormErrors(newErrors);
        return valid;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            console.log("Sending request with data:", formData);
            const response = await api.post<AuthResponse>(
                url.AUTH.REGISTER,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("API response:", response.data);

            if (response.status === 201 && response.data.token) {
                localStorage.setItem("token", response.data.token);
                toast.success("Đăng ký thành công! Đang chuyển đến trang đăng nhập...", { autoClose: 2000 }); // Success toast
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            } else {
                toast.error("Đăng ký không thành công. Phản hồi không mong đợi.", { autoClose: 3000 }); // Error toast
            }
        } catch (err: any) {
            console.error("API error:", err);
            const errorMessage = err.response?.data?.role || "Đăng ký không thành công. Vui lòng kiểm tra mạng hoặc cài đặt CORS.";
            toast.error(errorMessage, { autoClose: 3000 }); // Error toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-2xl px-6 py-8 mx-auto">
                
                <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-2xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                            Tạo tài khoản
                        </h1>
                        {loading && (
                            <p className="text-sm text-gray-600 text-center">
                                Đang tải...
                            </p>
                        )}
                        <form
                            className="space-y-4 md:space-y-6"
                            onSubmit={handleRegister}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="fullName"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Họ và tên
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        id="fullName"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                    {formErrors.fullName && (
                                        <p className="text-sm text-red-600">
                                            {formErrors.fullName}
                                        </p>
                                    )}
                                </div>
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
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="name@company.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {formErrors.email && (
                                        <p className="text-sm text-red-600">
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
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    {formErrors.password && (
                                        <p className="text-sm text-red-600">
                                            {formErrors.password}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Xác nhận mật khẩu
                                    </label>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    {formErrors.confirmPassword && (
                                        <p className="text-sm text-red-600">
                                            {formErrors.confirmPassword}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="phoneNumber"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="1234567890"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                    />
                                    {formErrors.phoneNumber && (
                                        <p className="text-sm text-red-600">
                                            {formErrors.phoneNumber}
                                        </p>
                                    )}
                                </div>
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
                                    Hiện mật khẩu
                                </label>
                            </div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        aria-describedby="terms"
                                        type="checkbox"
                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                        required
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label
                                        htmlFor="terms"
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
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-gray-400"
                            >
                                Tạo tài khoản
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                                Bạn đã có tài khoản?{" "}
                                <Link
                                    to={routes.login}
                                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                >
                                    Đăng nhập tại đây
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}