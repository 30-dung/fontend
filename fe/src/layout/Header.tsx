import { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import api from "@/services/api";
import url from "@/services/url";
import routes from "@/config/routes";

export function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<{
        fullName: string;
        topupBalance: number;
    } | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        // Also check for the 'user' object in localStorage to populate the header
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            // Attempt to parse stored user data
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.fullName) {
                    setUser({
                        fullName: parsedUser.fullName,
                        topupBalance: parsedUser.topupBalance || 0, // Ensure topupBalance is handled
                    });
                    setIsLoading(false); // Set loading to false if user is found immediately
                    return; // Exit to prevent re-fetching if data is complete
                }
            } catch (e) {
                console.error("Failed to parse user data from localStorage:", e);
                // If parsing fails, proceed to fetch or clear storage
            }

            const fetchUserData = async () => {
                setIsLoading(true);
                try {
                    const response = await api.get(url.USER.PROFILE, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUser({
                        fullName: response.data.fullName,
                        topupBalance: response.data.topupBalance || 0,
                    });
                    // Update the 'user' item in localStorage as well, if fetched successfully
                    localStorage.setItem("user", JSON.stringify({
                        userId: response.data.userId, // Assuming userId comes from profile API
                        fullName: response.data.fullName,
                        email: response.data.email, // Assuming email comes from profile API
                        topupBalance: response.data.topupBalance || 0,
                    }));
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                    // Clear all related localStorage items on fetch failure
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user_role");
                    localStorage.removeItem("token"); // Keep this if 'token' is used elsewhere
                    localStorage.removeItem("user"); // Remove the user object
                    setUser(null);
                    navigate("/login");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchUserData();
        } else {
            setIsLoading(false); // No token or stored user, so not loading
            setUser(null); // Ensure user state is null if not logged in
        }
    }, []); // Removed 'navigate' from dependencies to prevent re-triggering on navigation

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                event.target instanceof Node &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setIsDropdownOpen(false); // Đóng dropdown khi điều hướng
        setIsMobileMenuOpen(false); // Đóng menu mobile khi điều hướng
    }, [location.pathname]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_role");
        localStorage.removeItem("token"); // Keeping this for now based on your original code, but check if 'token' is truly a separate key from 'access_token'
        localStorage.removeItem("user"); // *** ADDED: Remove the 'user' object from localStorage ***
        setUser(null); // Clear user state in the component
        setIsDropdownOpen(false); // Close dropdown
        navigate("/login", { replace: true }); // Use replace to prevent back button from going to previous logged-in page
        window.location.reload(); // *** ADDED: Force a full page reload to clear all React state ***
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="new-header__container mx-auto max-w-[1200px]">
                <nav className="nav-bar flex items-center justify-between py-2">
                    <div className="nav-bar__logo-main">
                        <NavLink to={routes.home} title="trang chủ">
                            <img src={logo} className="h-full w-full object-fill object-contain " alt="30 Shine Logo" />
                        </NavLink>
                    </div>

                    <button
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle mobile menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>

                    <div
                        className={`nav-bar__menu ${
                            isMobileMenuOpen ? "block" : "hidden"
                        } md:flex flex-1 justify-center`}
                    >
                        <ul className="menu flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                            <li className="menu-item">
                                <NavLink to={routes.home}>
                                    <span className="menu-item-text pointer hover:text-shine-secondary">
                                        Trang chủ
                                    </span>
                                </NavLink>
                            </li>
                            <li className="menu-item">
                                <NavLink to={routes.booking}>
                                    <span className="menu-item-text pointer hover:text-shine-secondary">
                                        Đặt Lịch Nhanh
                                    </span>
                                </NavLink>
                            </li>
                            <li className="menu-item">
                                <NavLink to={routes.about}>
                                    <span className="menu-item-text pointer hover:text-shine-secondary">
                                        Về FourShine
                                    </span>
                                </NavLink>
                            </li>
                            <li className="menu-item">
                                <NavLink to={routes.location_page}>
                                    <span className="menu-item-text pointer hover:text-shine-secondary">
                                        Tìm FourShine gần nhất
                                    </span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className="nav-bar__action relative">
                        {isLoading ? (
                            <div>Đang tải...</div>
                        ) : user ? (
                            <div className="user-menu" ref={dropdownRef}>
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center space-x-2 rounded border border-shine-primary px-4 py-1.5 text-shine-primary hover:bg-shine-primary hover:text-white"
                                    aria-expanded={isDropdownOpen}
                                    aria-label="User menu"
                                >
                                    <span>{user.fullName}</span>
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                                {isDropdownOpen && (
                                    <ul
                                        className="absolute right-0 mt-2 w-48 bg-white text-gray-800 border border-gray-200 rounded-lg shadow-lg z-50"
                                        role="menu"
                                    >
                                        {/* <li
                                            role="menuitem"
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <NavLink
                                                to="/profile"
                                                className="block w-full"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Thông tin tài khoản
                                            </NavLink>
                                        </li> */}
                                        <li
                                            role="menuitem"
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <NavLink
                                                to={routes.bookingHistorey}
                                                className="block w-full"
                                                onClick={() =>
                                                    setIsDropdownOpen(false)
                                                }
                                            >
                                                Lịch sử tạo dáng
                                            </NavLink>
                                        </li>

                                        <li
                                            role="menuitem"
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <button // Changed NavLink to button for logout action
                                                onClick={handleLogout}
                                                className="block w-full text-left" // Style button like NavLink
                                            >
                                                Đăng xuất
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        ) : (
                            <div className="login-button">
                                <NavLink to={routes.login}>
                                    <span className="rounded border border-shine-primary px-4 py-1.5 text-shine-primary hover:bg-shine-primary hover:text-white">
                                        Đăng nhập
                                    </span>
                                </NavLink>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}