import { Link } from "react-router-dom";
import {
    FaTiktok,
    FaYoutube,
    FaFacebookF,
    FaInstagram,
    FaPhoneAlt,
    FaClock,
} from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";

export function Footer() {
    return (
        <footer className="bg-shine-background-footer text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFCC33] to-transparent opacity-20"></div>

            <div className="container mx-auto px-6 py-16 relative z-10">
                {/* Main footer content */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Brand column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-6">
                            {/* <div className="w-12 h-12 rounded-full bg-[#FFCC33] flex items-center justify-center mr-4">
                                <span className="text-2xl font-bold text-gray-900">
                                    FS
                                </span>
                            </div> */}
                            <h3 className="text-2xl font-bold tracking-wide">
                                Four SHINE
                            </h3>
                        </div>

                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Hệ thống salon tóc nam tiêu chuẩn 5 sao hàng đầu
                            Việt Nam. Nơi kiến tạo phong cách đẳng cấp dành cho
                            nam giới hiện đại.
                        </p>

                        <div className="flex space-x-5">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-[#FFCC33] transition-all duration-300 flex items-center justify-center group"
                            >
                                <FaFacebookF className="group-hover:text-gray-900 transition-colors" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-[#FFCC33] transition-all duration-300 flex items-center justify-center group"
                            >
                                <FaYoutube className="group-hover:text-gray-900 transition-colors" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-[#FFCC33] transition-all duration-300 flex items-center justify-center group"
                            >
                                <FaTiktok className="group-hover:text-gray-900 transition-colors" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-[#FFCC33] transition-all duration-300 flex items-center justify-center group"
                            >
                                <FaInstagram className="group-hover:text-gray-900 transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* Services column */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 pb-2 border-b border-white-700 flex items-center">
                            <RiCustomerService2Fill className="mr-2 text-[#FFCC33]" />
                            Dịch vụ
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    to="/haircut"
                                    className="text-gray-300 hover:text-[#FFCC33] transition-colors flex items-center group"
                                >
                                    <span className="w-2 h-2 bg-[#FFCC33] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    <span>Cắt tóc nam</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/shaving"
                                    className="text-gray-300 hover:text-[#FFCC33] transition-colors flex items-center group"
                                >
                                    <span className="w-2 h-2 bg-[#FFCC33] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    <span>Cạo mặt</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/coloring"
                                    className="text-gray-300 hover:text-[#FFCC33] transition-colors flex items-center group"
                                >
                                    <span className="w-2 h-2 bg-[#FFCC33] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    <span>Nhuộm tóc</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/spa"
                                    className="text-gray-300 hover:text-[#FFCC33] transition-colors flex items-center group"
                                >
                                    <span className="w-2 h-2 bg-[#FFCC33] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    <span>Chăm sóc da mặt</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact column */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 pb-2 border-b border-white-700">
                            Liên hệ
                        </h4>
                        <ul className="space-y-5">
                            <li className="flex items-start">
                                <MdLocationOn
                                    className="text-[#FFCC33] mt-1 mr-3 flex-shrink-0"
                                    size={20}
                                />
                                <span className="text-gray-300">
                                    100+ chi nhánh trên toàn quốc
                                </span>
                            </li>
                            <li className="flex items-start">
                                <FaPhoneAlt className="text-[#FFCC33] mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-300 text-sm">
                                        Hotline
                                    </p>
                                    <a
                                        href="tel:1900272703"
                                        className="text-white hover:text-[#FFCC33] transition-colors font-medium"
                                    >
                                        1900.27.27.03
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <MdEmail
                                    className="text-[#FFCC33] mt-1 mr-3 flex-shrink-0"
                                    size={20}
                                />
                                <div>
                                    <p className="text-gray-300 text-sm">
                                        Email
                                    </p>
                                    <a
                                        href="mailto:info@30shine.com"
                                        className="text-white hover:text-[#FFCC33] transition-colors font-medium"
                                    >
                                        info@fourshine.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <FaClock className="text-[#FFCC33] mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-300 text-sm">
                                        Giờ mở cửa
                                    </p>
                                    <p className="text-white font-medium">
                                        7:00 - 23:00 hàng ngày
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Policies column */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 pb-2 border-b border-white-700">
                            Thông tin
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    to="/about"
                                    className="text-gray-300 hover:text-[#FFCC33] transition-colors flex items-center group"
                                >
                                    <span className="w-2 h-2 bg-[#FFCC33] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    <span>Về chúng tôi</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/recruitment"
                                    className="text-gray-300 hover:text-[#FFCC33] transition-colors flex items-center group"
                                >
                                    <span className="w-2 h-2 bg-[#FFCC33] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    <span>Tuyển dụng</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/franchise"
                                    className="text-gray-300 hover:text-[#FFCC33] transition-colors flex items-center group"
                                >
                                    <span className="w-2 h-2 bg-[#FFCC33] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    <span>Nhượng quyền</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blog"
                                    className="text-gray-300 hover:text-[#FFCC33] transition-colors flex items-center group"
                                >
                                    <span className="w-2 h-2 bg-[#FFCC33] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    <span>Blog làm đẹp</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="mt-16 pt-8 border-t border-white-800">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        

                        <div className="">
                            <p className="text-gray-400 text-sm mb-2">
                                © {new Date().getFullYear()} FPT Aptech
                                semester 4 project.
                            </p>
                            <div className="flex justify-center md:justify-end space-x-4 text-xs">
                                <Link
                                    to="/privacy"
                                    className="text-gray-500 hover:text-[#FFCC33] transition-colors"
                                >
                                    Chính sách bảo mật
                                </Link>
                                <Link
                                    to="/terms"
                                    className="text-gray-500 hover:text-[#FFCC33] transition-colors"
                                >
                                    Điều khoản dịch vụ
                                </Link>
                                <Link
                                    to="/faq"
                                    className="text-gray-500 hover:text-[#FFCC33] transition-colors"
                                >
                                    Câu hỏi thường gặp
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
