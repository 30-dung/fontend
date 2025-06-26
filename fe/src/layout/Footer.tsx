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
        <footer className="bg-dark-brown text-light-cream relative overflow-hidden"> {/* Đổi bg-shine-background-footer thành bg-dark-brown, text-white thành text-light-cream */}
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-gold to-transparent opacity-20"></div> {/* Đổi via-[#FFCC33] thành via-accent-gold */}

            <div className="container mx-auto px-6 py-16 relative z-10">
                {/* Main footer content */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Brand column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-6">
                            <h3 className="text-2xl font-bold tracking-wide text-light-cream"> {/* Đảm bảo màu chữ */}
                                Four SHINE
                            </h3>
                        </div>

                        <p className="text-soft-gray mb-6 leading-relaxed"> {/* Đổi text-gray-300 thành text-soft-gray */}
                            Hệ thống salon tóc nam tiêu chuẩn 5 sao hàng đầu
                            Việt Nam. Nơi kiến tạo phong cách đẳng cấp dành cho
                            nam giới hiện đại.
                        </p>

                        <div className="flex space-x-5">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-black-soft hover:bg-accent-gold transition-all duration-300 flex items-center justify-center group" /* Đổi bg-gray-800 thành bg-black-soft, hover:bg-[#FFCC33] thành hover:bg-accent-gold */
                            >
                                <FaFacebookF className="group-hover:text-dark-brown transition-colors" /> {/* Đổi group-hover:text-gray-900 thành group-hover:text-dark-brown */}
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-black-soft hover:bg-accent-gold transition-all duration-300 flex items-center justify-center group" /* Đổi bg-gray-800 thành bg-black-soft, hover:bg-[#FFCC33] thành hover:bg-accent-gold */
                            >
                                <FaYoutube className="group-hover:text-dark-brown transition-colors" /> {/* Đổi group-hover:text-gray-900 thành group-hover:text-dark-brown */}
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-black-soft hover:bg-accent-gold transition-all duration-300 flex items-center justify-center group" /* Đổi bg-gray-800 thành bg-black-soft, hover:bg-[#FFCC33] thành hover:bg-accent-gold */
                            >
                                <FaTiktok className="group-hover:text-dark-brown transition-colors" /> {/* Đổi group-hover:text-gray-900 thành group-hover:text-dark-brown */}
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-black-soft hover:bg-accent-gold transition-all duration-300 flex items-center justify-center group" /* Đổi bg-gray-800 thành bg-black-soft, hover:bg-[#FFCC33] thành hover:bg-accent-gold */
                            >
                                <FaInstagram className="group-hover:text-dark-brown transition-colors" /> {/* Đổi group-hover:text-gray-900 thành group-hover:text-dark-brown */}
                            </a>
                        </div>
                    </div>

                    {/* Services column */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 pb-2 border-b border-soft-gray flex items-center text-light-cream"> {/* Đổi border-white-700 thành border-soft-gray, đảm bảo màu chữ */}
                            <RiCustomerService2Fill className="mr-2 text-accent-gold" /> {/* Đổi text-[#FFCC33] thành text-accent-gold */}
                            Dịch vụ
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    to="/haircut"
                                    className="text-soft-gray hover:text-accent-gold transition-colors flex items-center group" /* Đổi text-gray-300 thành text-soft-gray, hover:text-[#FFCC33] thành hover:text-accent-gold */
                                >
                                    <span className="w-2 h-2 bg-accent-gold rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span> {/* Đổi bg-[#FFCC33] thành bg-accent-gold */}
                                    <span>Cắt tóc nam</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/shaving"
                                    className="text-soft-gray hover:text-accent-gold transition-colors flex items-center group" /* Đổi text-gray-300 thành text-soft-gray, hover:text-[#FFCC33] thành hover:text-accent-gold */
                                >
                                    <span className="w-2 h-2 bg-accent-gold rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span> {/* Đổi bg-[#FFCC33] thành bg-accent-gold */}
                                    <span>Cạo mặt</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/coloring"
                                    className="text-soft-gray hover:text-accent-gold transition-colors flex items-center group" /* Đổi text-gray-300 thành text-soft-gray, hover:text-[#FFCC33] thành hover:text-accent-gold */
                                >
                                    <span className="w-2 h-2 bg-accent-gold rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span> {/* Đổi bg-[#FFCC33] thành bg-accent-gold */}
                                    <span>Nhuộm tóc</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/spa"
                                    className="text-soft-gray hover:text-accent-gold transition-colors flex items-center group" /* Đổi text-gray-300 thành text-soft-gray, hover:text-[#FFCC33] thành hover:text-accent-gold */
                                >
                                    <span className="w-2 h-2 bg-accent-gold rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span> {/* Đổi bg-[#FFCC33] thành bg-accent-gold */}
                                    <span>Chăm sóc da mặt</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact column */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 pb-2 border-b border-soft-gray text-light-cream"> {/* Đổi border-white-700 thành border-soft-gray, đảm bảo màu chữ */}
                            Liên hệ
                        </h4>
                        <ul className="space-y-5">
                            <li className="flex items-start">
                                <MdLocationOn
                                    className="text-accent-gold mt-1 mr-3 flex-shrink-0" /* Đổi text-[#FFCC33] thành text-accent-gold */
                                    size={20}
                                />
                                <span className="text-soft-gray"> {/* Đổi text-gray-300 thành text-soft-gray */}
                                    100+ chi nhánh trên toàn quốc
                                </span>
                            </li>
                            <li className="flex items-start">
                                <FaPhoneAlt className="text-accent-gold mt-1 mr-3 flex-shrink-0" /> {/* Đổi text-[#FFCC33] thành text-accent-gold */}
                                <div>
                                    <p className="text-soft-gray text-sm"> {/* Đổi text-gray-300 thành text-soft-gray */}
                                        Hotline
                                    </p>
                                    <a
                                        href="tel:1900272703"
                                        className="text-light-cream hover:text-accent-gold transition-colors font-medium" /* Đổi text-white thành text-light-cream, hover:text-[#FFCC33] thành hover:text-accent-gold */
                                    >
                                        1900.27.27.03
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <MdEmail
                                    className="text-accent-gold mt-1 mr-3 flex-shrink-0" /* Đổi text-[#FFCC33] thành text-accent-gold */
                                    size={20}
                                />
                                <div>
                                    <p className="text-soft-gray text-sm"> {/* Đổi text-gray-300 thành text-soft-gray */}
                                        Email
                                    </p>
                                    <a
                                        href="mailto:info@30shine.com"
                                        className="text-light-cream hover:text-accent-gold transition-colors font-medium" /* Đổi text-white thành text-light-cream, hover:text-[#FFCC33] thành hover:text-accent-gold */
                                    >
                                        info@fourshine.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <FaClock className="text-accent-gold mt-1 mr-3 flex-shrink-0" /> {/* Đổi text-[#FFCC33] thành text-accent-gold */}
                                <div>
                                    <p className="text-soft-gray text-sm"> {/* Đổi text-gray-300 thành text-soft-gray */}
                                        Giờ mở cửa
                                    </p>
                                    <p className="text-light-cream font-medium"> {/* Đổi text-white thành text-light-cream */}
                                        7:00 - 23:00 hàng ngày
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Policies column */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 pb-2 border-b border-soft-gray text-light-cream"> {/* Đổi border-white-700 thành border-soft-gray, đảm bảo màu chữ */}
                            Thông tin
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    to="/about"
                                    className="text-soft-gray hover:text-accent-gold transition-colors flex items-center group" /* Đổi text-gray-300 thành text-soft-gray, hover:text-[#FFCC33] thành hover:text-accent-gold */
                                >
                                    <span className="w-2 h-2 bg-accent-gold rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span> {/* Đổi bg-[#FFCC33] thành bg-accent-gold */}
                                    <span>Về chúng tôi</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/recruitment"
                                    className="text-soft-gray hover:text-accent-gold transition-colors flex items-center group" /* Đổi text-gray-300 thành text-soft-gray, hover:text-[#FFCC33] thành hover:text-accent-gold */
                                >
                                    <span className="w-2 h-2 bg-accent-gold rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span> {/* Đổi bg-[#FFCC33] thành bg-accent-gold */}
                                    <span>Tuyển dụng</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/franchise"
                                    className="text-soft-gray hover:text-accent-gold transition-colors flex items-center group" /* Đổi text-gray-300 thành text-soft-gray, hover:text-[#FFCC33] thành hover:text-accent-gold */
                                >
                                    <span className="w-2 h-2 bg-accent-gold rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span> {/* Đổi bg-[#FFCC33] thành bg-accent-gold */}
                                    <span>Nhượng quyền</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blog"
                                    className="text-soft-gray hover:text-accent-gold transition-colors flex items-center group" /* Đổi text-gray-300 thành text-soft-gray, hover:text-[#FFCC33] thành hover:text-accent-gold */
                                >
                                    <span className="w-2 h-2 bg-accent-gold rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span> {/* Đổi bg-[#FFCC33] thành bg-accent-gold */}
                                    <span>Blog làm đẹp</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="mt-16 pt-8 border-t border-soft-gray"> {/* Đổi border-white-800 thành border-soft-gray */}
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        

                        <div className="">
                            <p className="text-medium-white text-sm mb-2"> {/* Đổi text-gray-400 thành text-medium-gray */}
                                © {new Date().getFullYear()} FPT Aptech
                                semester 4 project.
                            </p>
                            <div className="flex justify-center md:justify-end space-x-4 text-xs">
                                <Link
                                    to="/privacy"
                                    className="text-medium-white hover:text-accent-gold transition-colors" /* Đổi text-gray-500 thành text-medium-gray, hover:text-[#FFCC33] thành hover:text-accent-gold */
                                >
                                    Chính sách bảo mật
                                </Link>
                                <Link
                                    to="/terms"
                                    className="text-medium-white hover:text-accent-gold transition-colors" /* Đổi text-gray-500 thành text-medium-gray, hover:text-[#FFCC33] thành hover:text-accent-gold */
                                >
                                    Điều khoản dịch vụ
                                </Link>
                                <Link
                                    to="/faq"
                                    className="text-medium-white hover:text-accent-gold transition-colors" /* Đổi text-gray-500 thành text-medium-gray, hover:text-[#FFCC33] thành hover:text-accent-gold */
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