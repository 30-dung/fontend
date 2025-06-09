import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import url from "../../../services/url";

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
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
    setApiError(null);
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
      newErrors.fullName = "Please enter your full name.";
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = "Please enter your email address.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password.";
      valid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password = "Password must include uppercase, lowercase, number, and special character.";
      valid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
      valid = false;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Please enter your phone number.";
      valid = false;
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits.";
      valid = false;
    }

    if (!formData.membershipType || !["REGULAR", "PREMIUM", "VIP"].includes(formData.membershipType)) {
      newErrors.membershipType = "Please select a valid membership type.";
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError(null);
    setSuccess(null);

    try {
      console.log("Sending request with data:", formData);
      const response = await api.post<AuthResponse>(url.AUTH.REGISTER, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("API response:", response.data);

      if (response.status === 201 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setApiError("Registration failed. Unexpected response.");
      }
    } catch (err: any) {
      console.error("API error:", err);
      setApiError(err.response?.data?.role || "Registration failed. Please check your network or CORS settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl px-6 py-8 mx-auto">
        <a
          href="#"
          className="flex items-center justify-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Flowbite
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-2xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Create an account
            </h1>
            {apiError && <p className="text-sm text-red-600 text-center">{apiError}</p>}
            {success && <p className="text-sm text-green-600 text-center">{success}</p>}
            {loading && <p className="text-sm text-gray-600 text-center">Loading...</p>}
            <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Full Name
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
                    <p className="text-sm text-red-600">{formErrors.fullName}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
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
                    <p className="text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {formErrors.password && (
                    <p className="text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {formErrors.confirmPassword && (
                    <p className="text-sm text-red-600">{formErrors.confirmPassword}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone Number
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
                    <p className="text-sm text-red-600">{formErrors.phoneNumber}</p>
                  )}
                </div>
                {/* <div>
                  <label
                    htmlFor="membershipType"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Membership Type
                  </label>
                  <select
                    name="membershipType"
                    id="membershipType"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={formData.membershipType}
                    onChange={handleChange}
                  >
                    <option value="REGULAR">Regular</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="VIP">VIP</option>
                  </select>
                  {formErrors.membershipType && (
                    <p className="text-sm text-red-600">{formErrors.membershipType}</p>
                  )}
                </div> */}
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
                  Show password
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
                    I accept the{" "}
                    <a
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-gray-400"
              >
                Create an account
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}