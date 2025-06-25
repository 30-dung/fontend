// src/pages/client/contact/MapEmbed.tsx
import React from 'react';

interface MapEmbedProps {
  address: string; // Có thể truyền địa chỉ để hiển thị
}

const MapEmbed: React.FC<MapEmbedProps> = ({ address }) => {
  // Thay thế URL này bằng iframe URL bạn sao chép từ Google Maps
  // Ví dụ cho "99 Xuân Thủy, Cầu Giấy, Hà Nội"
  // Bạn có thể tạo URL nhúng từ Google Maps: Tìm địa điểm -> Chia sẻ -> Nhúng bản đồ -> Sao chép HTML
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.084799015093!2d105.78018317500582!3d21.02905188062967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4b37d38397%3A0xf67300406089d702!2zOTkgWHXDom4gVGjhu6d5LCBD4bqndSBHaeG6pXksIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1719325983796!5m2!1svi!2s`;

  return (
    <div className="w-full h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <iframe
        src={googleMapsEmbedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Vị trí của ${address}`}
      ></iframe>
    </div>
  );
};

export default MapEmbed;