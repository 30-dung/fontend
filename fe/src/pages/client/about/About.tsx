import routes from "@/config/routes";
import { motion } from "framer-motion";
import {
    FaRocket,
    FaCut,
    FaFire,
    FaStar,
    FaDumbbell,
    FaRegHandshake,
    FaPhoneAlt,
} from "react-icons/fa"; // Import icons
import { Link } from "react-router-dom";

export function AboutPage() {
    return (
        <div className="bg-gradient-to-b from-[#f6f8fc] to-[#eaf0fa] min-h-screen text-shine-text-primary">
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center h-[450px] md:h-[550px] flex items-center justify-center text-white overflow-hidden"
                style={{
                    backgroundImage: `url("https://png.pngtree.com/thumb_back/fh260/background/20241116/pngtree-luxurious-modern-barber-shop-with-sleek-interior-design-image_16612337.jpg")`, // Ảnh Hero mới: Luxurious modern barber shop
                }}
            >
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-7xl font-extrabold mb-4 leading-tight drop-shadow-lg animate-fade-in-down">
                        Barber Shop - Nơi Khởi Tạo Phong Thái Đàn Ông
                    </h1>
                    <p className="text-lg md:text-2xl italic font-light max-w-3xl mx-auto animate-fade-in-up">
                        "Hãy cho tôi một điểm tựa, tôi sẽ nâng cả thế giới." -
                        Archimedes. Chúng tôi là điểm tựa vững chắc cho mọi quý
                        ông trên hành trình chinh phục những mục tiêu lớn.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Section 1 - Barber Shop - Điểm Tựa Cho Việc Lớn (Detailed) */}
                    <section className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border-l-8 border-shine-blue-light flex flex-col justify-between animate-slide-in-left">
                        <div>
                            <h2 className="uppercase font-bold text-2xl md:text-3xl text-shine-blue flex items-center gap-3 mb-5">
                                {/* Kích thước icon điều chỉnh theo font chữ */}
                                <FaRocket className="text-current text-[inherit]" />{" "}
                                Barber Shop - Điểm Tựa Cho Việc Lớn
                            </h2>
                            <div className="text-base md:text-lg text-shine-blue flex flex-col gap-4 leading-relaxed">
                                <div>
                                    Mỗi người đàn ông đều có một hành trình
                                    riêng, một thế giới muốn chinh phục. Từ
                                    những mục tiêu nhỏ nhất đến những ước mơ vĩ
                                    đại, mỗi bước đi đều cần sự tự tin và bản
                                    lĩnh.
                                </div>
                                <div>
                                    Có người đang tiến về đích với quyết tâm cao
                                    độ, có người vẫn đang tìm hướng đi cho con
                                    đường riêng của mình. Có người biết chính
                                    xác điều mình muốn và đang nỗ lực hết mình,
                                    có người đang từng bước khám phá tiềm năng
                                    và định hình tương lai.
                                </div>
                                <div className="font-semibold text-xl text-shine-blue-dark">
                                    Dù anh đang ở đâu trên hành trình ấy – bản
                                    lĩnh và sự tự tin luôn có trong chính anh,
                                    chờ được khơi dậy.
                                </div>
                                <div>
                                    Barber Shop không tạo ra chúng.{" "}
                                    <span className="font-bold text-shine-blue-dark">
                                        Chúng tôi là điểm tựa vững chắc
                                    </span>
                                    , một không gian lý tưởng giúp anh thể hiện
                                    trọn vẹn phong thái, khí chất và sẵn sàng
                                    cho những điều quan trọng phía trước, cho
                                    mọi cuộc gặp gỡ, mọi quyết định.
                                </div>
                            </div>
                        </div>
                        <img
                            src="https://chamsua.vn/wp-content/uploads/2024/12/99-hinh-anh-tho-cat-toc-chat-anh-barber-dep-va-chat-nhat-1-1.jpg" // Ảnh 1
                            alt="Thợ cắt tóc chuyên nghiệp tại Barber Shop"
                            className="mt-8 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300 w-full object-cover h-72" // Tăng chiều cao ảnh
                        />
                    </section>

                    {/* Section 2 - Kiểu Tóc Đẹp Không Phải Đích Đến – Mà Là Điểm Khởi Đầu */}
                    <section className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border-l-8 border-[#7ea7e7] flex flex-col justify-between animate-slide-in-right">
                        <div>
                            <h2 className="uppercase font-bold text-2xl md:text-3xl text-shine-blue flex items-center gap-3 mb-5">
                                {/* Kích thước icon điều chỉnh theo font chữ */}
                                <FaCut className="text-current text-[inherit]" />{" "}
                                Kiểu Tóc Đẹp Không Phải Đích Đến – Mà Là Điểm
                                Khởi Đầu
                            </h2>
                            <div className="text-base md:text-lg text-shine-blue flex flex-col gap-4 leading-relaxed">
                                <div>
                                    Một kiểu tóc đẹp{" "}
                                    <span className="font-bold text-shine-blue-dark">
                                        không chỉ để ngắm nhìn trong gương – mà
                                        còn để cảm nhận trọn vẹn từng khoảnh
                                        khắc:
                                    </span>
                                </div>
                                <div>
                                    Cảm nhận sự{" "}
                                    <span className="font-bold text-shine-blue-dark">
                                        thoải mái tối đa, tự tin tỏa sáng
                                    </span>
                                    trong mọi tình huống, và luôn sẵn sàng đối
                                    mặt với mọi thử thách.
                                </div>
                                <div>
                                    Cảm nhận một phiên bản{" "}
                                    <span className="font-bold text-shine-blue-dark">
                                        tốt hơn, chỉn chu hơn của chính mình
                                    </span>
                                    , một diện mạo mới mẻ tiếp thêm năng lượng.
                                </div>
                                <div>
                                    Với gần{" "}
                                    <span className="font-bold text-shine-blue-dark">
                                        150 salon trên toàn quốc
                                    </span>
                                    , được trang bị công nghệ hiện đại và đội
                                    ngũ thợ tận tâm, chuyên nghiệp, Barber Shop
                                    không chỉ mang đến một diện mạo mới mẻ cho
                                    anh.{" "}
                                    <span className="font-bold text-shine-blue-dark">
                                        Chúng tôi giúp anh luôn trong trạng thái
                                        tốt nhất về cả tinh thần và ngoại hình –
                                        để đón nhận bất kỳ điều gì đang chờ phía
                                        trước với sự tự tin cao nhất.
                                    </span>
                                </div>
                            </div>
                        </div>
                        <img
                            src="https://classic.vn/wp-content/uploads/2022/11/van-hoa-barber-va-nghe-thuat-rau-toc-cho-quy-ong.jpg" // Ảnh 2
                            alt="Khách hàng được chăm sóc tại barbershop"
                            className="mt-8 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300 w-full object-cover h-72" // Tăng chiều cao ảnh
                        />
                    </section>

                    {/* Section 3 - WILLS – Văn Hoá Tinh Thần Của Những Người Dám Tiến Lên */}
                    <section className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border-l-8 border-[#f9c846] flex flex-col justify-between lg:col-span-2 animate-slide-in-up">
                        <div>
                            <h2 className="uppercase font-bold text-2xl md:text-3xl text-shine-blue flex items-center gap-3 mb-5">
                                {/* Kích thước icon điều chỉnh theo font chữ */}
                                <FaFire className="text-current text-[inherit]" />{" "}
                                WILLS – Văn Hoá Tinh Thần Của Những Người Dám
                                Tiến Lên
                            </h2>
                            <div className="text-base md:text-lg text-shine-blue flex flex-col gap-4 leading-relaxed">
                                <div>
                                    Ở Barber Shop, chúng tôi không chỉ tạo ra
                                    diện mạo tuyệt vời – chúng tôi phục vụ những
                                    người đàn ông có tinh thần cầu tiến, luôn
                                    muốn tốt hơn mỗi ngày, dám bứt phá khỏi giới
                                    hạn.
                                </div>
                                <div>
                                    Dù anh đang{" "}
                                    <span className="font-bold text-shine-blue-dark">
                                        bắt đầu xây dựng sự nghiệp, bứt phá khỏi
                                        vùng an toàn hay khẳng định chính mình
                                    </span>
                                    trên đỉnh cao, tinh thần
                                    <span className="font-bold text-shine-blue-dark">
                                        {" "}
                                        WILLS
                                    </span>{" "}
                                    luôn đồng hành, là kim chỉ nam cho mọi hành
                                    động của chúng tôi:
                                </div>
                                <ul className="list-disc pl-8 mb-4 space-y-2 text-lg">
                                    <li>
                                        <span className="font-bold text-shine-blue-dark">
                                            W - Warrior
                                        </span>{" "}
                                        (Chiến binh) – Kiên cường, dũng cảm,
                                        không lùi bước trước mọi thử thách, luôn
                                        tìm cách vượt qua khó khăn.
                                    </li>
                                    <li>
                                        <span className="font-bold text-shine-blue-dark">
                                            I - Intervention
                                        </span>{" "}
                                        (Can thiệp) – Chủ động hành động, không
                                        đợi thời điểm hoàn hảo, mà tạo ra nó,
                                        nắm bắt cơ hội.
                                    </li>
                                    <li>
                                        <span className="font-bold text-shine-blue-dark">
                                            L - Learning
                                        </span>{" "}
                                        (Ham học hỏi) – Phát triển không giới
                                        hạn, không ngừng nâng cấp bản thân, luôn
                                        tìm tòi kiến thức mới.
                                    </li>
                                    <li>
                                        <span className="font-bold text-shine-blue-dark">
                                            L - Leadership
                                        </span>{" "}
                                        (Đổi mới) – Luôn sáng tạo, tiên phong,
                                        chủ động dẫn đầu sự thay đổi, không
                                        ngừng cải tiến.
                                    </li>
                                    <li>
                                        <span className="font-bold text-shine-blue-dark">
                                            S - Sincerity
                                        </span>{" "}
                                        (Chân thành) – Minh bạch, đáng tin cậy,
                                        xây dựng mối quan hệ bền vững dựa trên
                                        sự thật và trách nhiệm.
                                    </li>
                                </ul>
                                <div className="font-bold text-xl text-shine-blue-dark mt-4">
                                    Không có đúng hay sai – chỉ có phiên bản tốt
                                    nhất của chính mình, và Barber Shop ở đây để
                                    giúp anh tự tin thể hiện điều đó, tự tin tỏa
                                    sáng.
                                </div>
                            </div>
                        </div>
                        <img
                            src="https://top3.vn/uploads/source//skd1040/ca-canh/barbershop-6.jpg" // Ảnh 3 - Ảnh này sẽ được tăng chiều cao để đỡ bị méo
                            alt="Không gian làm việc chuyên nghiệp tại Barber Shop"
                            className="mt-8 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300 w-full object-cover h-80" // Tăng chiều cao ảnh cụ thể này
                        />
                    </section>

                    {/* Section 4 - Sứ Mệnh – Tôn Vinh Đôi Bàn Tay Tài Hoa Người Thợ Việt */}
                    <section className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border-l-8 border-[#4fd1c5] flex flex-col justify-between animate-slide-in-left">
                        <div>
                            <h2 className="uppercase font-bold text-2xl md:text-3xl text-shine-blue flex items-center gap-3 mb-5">
                                {/* Kích thước icon điều chỉnh theo font chữ */}
                                <FaRegHandshake className="text-current text-[inherit]" />{" "}
                                Sứ Mệnh – Tôn Vinh Đôi Bàn Tay Tài Hoa Người Thợ
                                Việt
                            </h2>
                            <div className="text-base md:text-lg text-shine-blue flex flex-col gap-4 leading-relaxed">
                                <div>
                                    Barber Shop không chỉ là điểm tựa giúp đàn
                                    ông thể hiện phong độ, mà còn mang trong
                                    mình một sứ mệnh cao cả hơn:
                                </div>
                                <div className="font-bold text-xl text-shine-blue-dark">
                                    Tôn vinh và nâng tầm đôi bàn tay tài hoa của
                                    người thợ Việt trên bản đồ ngành tóc thế
                                    giới.
                                </div>
                                <div>
                                    Chúng tôi tin rằng tay nghề con người Việt
                                    Nam không chỉ giỏi – mà có thể vươn xa, sánh
                                    ngang với các chuyên gia tóc hàng đầu quốc
                                    tế.
                                </div>
                                <div>
                                    Bằng việc không ngừng đổi mới công nghệ,
                                    nâng cao chất lượng dịch vụ và xây dựng môi
                                    trường phát triển chuyên nghiệp, công bằng,
                                    Barber Shop giúp người thợ Việt phát triển
                                    bản thân, nâng cao tay nghề, khẳng định giá
                                    trị nghề nghiệp và vị thế trong ngành tóc
                                    toàn cầu.
                                </div>
                                <div className="font-bold text-xl text-shine-blue-dark">
                                    Từ bàn tay Việt – vươn tới những tầm cao
                                    mới, mang lại sự tự hào cho đất nước.
                                </div>
                            </div>
                        </div>
                        <img
                            src="https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg" // Ảnh 4
                            alt="Thợ cắt tóc thể hiện tài năng"
                            className="mt-8 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300 w-full object-cover h-72" // Tăng chiều cao ảnh
                        />
                    </section>

                    {/* Section 5 - Ai Cũng Có Việc Lớn Của Riêng Mình – Chỉ Cần Một Điểm Tựa */}
                    <section className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border-l-8 border-[#b794f4] flex flex-col justify-between animate-slide-in-right">
                        <div>
                            <h2 className="uppercase font-bold text-2xl md:text-3xl text-shine-blue flex items-center gap-3 mb-5">
                                {/* Kích thước icon điều chỉnh theo font chữ */}
                                <FaStar className="text-current text-[inherit]" />{" "}
                                Ai Cũng Có Việc Lớn Của Riêng Mình – Chỉ Cần Một
                                Điểm Tựa
                            </h2>
                            <div className="text-base md:text-lg text-shine-blue flex flex-col gap-4 leading-relaxed">
                                <div>
                                    Trong cuộc đời, không có lộ trình nào giống
                                    nhau hoàn toàn. Mỗi người đều có con đường,
                                    những thử thách và cơ hội riêng.
                                </div>
                                <div>
                                    Không có đích đến nào là duy nhất. Mục tiêu
                                    của anh hôm nay có thể là một khởi đầu mới
                                    cho ngày mai, và Barber Shop hiểu điều đó.
                                </div>
                                <div className="font-bold text-xl text-shine-blue-dark">
                                    Mỗi hành trình là độc nhất, và Barber Shop
                                    luôn sẵn sàng đồng hành cùng anh, lắng nghe
                                    và hỗ trợ để anh tự tin theo đuổi mọi ước
                                    mơ, dù lớn lao hay giản dị.
                                </div>
                                <div>
                                    Chúng tôi tin rằng, với sự chuẩn bị tốt nhất
                                    về ngoại hình và tinh thần, anh sẽ luôn tự
                                    tin vượt qua mọi giới hạn và chinh phục
                                    thành công.
                                </div>
                            </div>
                        </div>
                        <img
                            src="https://chamsua.vn/wp-content/uploads/2024/12/99-hinh-anh-tho-cat-toc-chat-anh-barber-dep-va-chat-nhat-1-1.jpg" // Lặp lại ảnh 1 cho section này hoặc tìm ảnh khác
                            alt="Hành trình cá nhân và sự hỗ trợ"
                            className="mt-8 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300 w-full object-cover h-72" // Tăng chiều cao ảnh
                        />
                    </section>

                    {/* Section 6 - Barber Shop – Điểm Tựa Cho Việc Lớn (Conclusion) */}
                    <section className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border-l-8 border-shine-blue-light lg:col-span-2 animate-fade-in-up">
                        <h2 className="uppercase font-bold text-2xl md:text-3xl text-shine-blue flex items-center gap-3 mb-5">
                            {/* Kích thước icon điều chỉnh theo font chữ */}
                            <FaDumbbell className="text-current text-[inherit]" />{" "}
                            Barber Shop – Điểm Tựa Cho Việc Lớn
                        </h2>
                        <div className="text-base md:text-lg text-shine-blue flex flex-col gap-4 leading-relaxed text-center">
                            <div className="font-extrabold text-2xl md:text-3xl text-shine-blue-dark">
                                Dù anh đang ở đâu trên hành trình – chỉ cần sẵn
                                sàng, thế giới này là của anh!
                            </div>
                            <div>
                                Hãy để Barber Shop là người bạn đồng hành tin
                                cậy, một nơi anh có thể tìm thấy sự chăm sóc
                                chuyên nghiệp, đẳng cấp và một không gian thư
                                giãn để tái tạo năng lượng. Chúng tôi giúp anh
                                luôn tự tin tiến bước trên con đường chinh phục
                                những điều lớn lao, tự tin đối diện với mọi thử
                                thách và cơ hội mới.
                            </div>
                            <div className="font-semibold text-xl text-shine-blue-dark mt-4">
                                Khám phá Barber Shop ngay hôm nay để bắt đầu
                                hành trình tỏa sáng của riêng anh!
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Nút CTA cố định */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <Link
                    to={routes.booking}
                    className="flex items-center bg-black-soft text-light-cream font-bold py-3 px-7 rounded-full shadow-xl hover:bg-dark-brown transition-all duration-300" /* Đổi màu sắc nút CTA */
                >
                    <FaPhoneAlt className="mr-2" />
                    Đặt lịch ngay
                </Link>
            </motion.div>
        </div>
    );
}
