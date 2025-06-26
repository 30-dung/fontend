/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        // 'Merriweather' sẽ là font mặc định cho sans-serif, phù hợp cho nội dung
        sans: ['Merriweather', 'serif'], //
        // 'Playfair Display' sẽ là font cho tiêu đề mang phong cách cổ điển
        serif: ['Playfair Display', 'serif'], //
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Định nghĩa các màu sắc theo phong cách mộc mạc cổ điển, có điểm nhấn đen
        'light-cream': '#F8F7F3', // Nền chính: Trắng kem
        'soft-gray': '#EAEAEA',   // Nền phụ, viền nhẹ: Xám nhạt
        'dark-brown': '#4A3B31',  // Màu chữ đậm, tiêu đề: Nâu đen
        'medium-gray': '#6B7280', // Màu chữ phụ: Xám trung bình
        'black-soft': '#1A1A1A',  // Màu đen mềm mại làm điểm nhấn
        'accent-gold': '#B8860B', // Vàng đồng/vàng cổ điển làm điểm nhấn
        'accent-terracotta': '#A0522D', // Nâu đất nung làm điểm nhấn thứ cấp
        'text-on-accent': '#FFFFFF', // Màu chữ trên các nền điểm nhấn
         'accent-gold': '#B8860B', // Vàng đồng/vàng cổ điển
    'accent-gold-rgb': '184, 134, 11', // Dạng RGB cho việc dùng opacity

        // Cập nhật các biến gốc của shadcn/ui hoặc các thư viện khác để phù hợp với theme mới
        background: "var(--light-cream)", //
        foreground: "var(--dark-brown)", //
        card: {
          DEFAULT: "#FFFFFF", // Giữ card là trắng tinh nếu muốn độ tương phản cao
          foreground: "var(--dark-brown)", //
        },
        popover: {
          DEFAULT: "#FFFFFF", //
          foreground: "var(--dark-brown)", //
        },
        primary: {
          DEFAULT: "var(--black-soft)", // Các nút hành động chính, tiêu đề quan trọng
          foreground: "var(--light-cream)", // Chữ trên nền primary
        },
        secondary: {
          DEFAULT: "var(--soft-gray)", // Nền các khối phụ, hover nhẹ
          foreground: "var(--dark-brown)", // Chữ trên nền secondary
        },
        muted: {
          DEFAULT: "var(--soft-gray)", //
          foreground: "var(--medium-gray)", //
        },
        accent: {
          DEFAULT: "var(--accent-gold)", // Màu điểm nhấn chính
          foreground: "var(--text-on-accent)", //
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)", // Giữ nguyên màu đỏ cảnh báo nếu cần
          foreground: "hsl(0 0% 98%)", //
        },
        border: "var(--soft-gray)", // Màu border
        input: "var(--soft-gray)", //
        ring: "var(--accent-gold)", // Màu ring focus cho input
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};