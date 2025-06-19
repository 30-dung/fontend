// src/App.tsx
import { Route, BrowserRouter, Routes } from "react-router-dom";
import routes from "@/config/routes";
import { LoginPage } from "./pages/client/auth/Login";
import { RegisterPage } from "./pages/client/auth/Register";
import { ForgotPasswordPage } from "./pages/client/auth/Forgot";
import { ResetPasswordPage } from "./pages/client/auth/Reset";
import { ErrorPage } from "./pages/client/error/Error";
import { Layout } from "./layout/Layout";
import { HomePage } from "./pages/client/home/Home";
import { AboutPage } from "./pages/client/about/About";
import { ServiceComBo } from "./pages/client/servicss/ServiceCombo";
import { ComboDetail }  from "./pages/client/servicss/ComboDetail";
import { LocationPage } from "./pages/client/location/Location";
import BookingForm from "./pages/client/booking/BookingForm";
import { BookingHistory } from "./pages/client/booking/BookingHistory";
import { BookingConfirmation } from "./pages/client/booking/BookingConfirmation";
import { ProtectedRoute } from "./ProtectedRoute";
import { ScrollToTop } from "./hooks/useScrollTop";
import { StoreReviewsPage } from "./pages/client/reviews/StoreReviewsPage"; // Import trang reviews mới

import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của react-toastify

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                {/* Auth routes */}
                <Route path={routes.login} element={<LoginPage />} />
                <Route path={routes.register} element={<RegisterPage />} />
                <Route path={routes.forgot} element={<ForgotPasswordPage />} />
                <Route path={routes.reset} element={<ResetPasswordPage />} />
                {/* Public routes */}
                <Route
                    path="/"
                    index
                    element={
                        <Layout>
                            <HomePage />
                        </Layout>
                    }
                />
                <Route
                    path={routes.about}
                    element={
                        <Layout>
                            <AboutPage />
                        </Layout>
                    }
                />
                <Route
                    path={routes.services_combo}
                    element={
                        <Layout>
                            <ServiceComBo />
                        </Layout>
                    }
                />
                <Route
                    path={routes.combo_detail}
                    element={
                        <Layout>
                            <ComboDetail />
                        </Layout>
                    }
                />
                <Route
                    path={routes.location_page}
                    element={
                        <Layout>
                            <LocationPage />
                        </Layout>
                    }
                />
                {/* --- Định tuyến cho trang đánh giá của cửa hàng --- */}
                <Route
                    path={routes.store_reviews}
                    element={
                        <Layout>
                            <StoreReviewsPage />
                        </Layout>
                    }
                />
                <Route path="*" element={<ErrorPage />} />

                {/* Protected routes */}
                <Route
                    element={
                        <ProtectedRoute allowedRoles={["ROLE_CUSTOMER"]} />
                    }
                >
                    <Route
                        path={routes.booking}
                        element={
                            <Layout>
                                <BookingForm />
                            </Layout>
                        }
                    />
                    <Route
                        path={routes.bookingHistorey}
                        element={
                            <Layout>
                                <BookingHistory />
                            </Layout>
                        }
                    />
                    <Route
                        path={routes.bookingConfirmation}
                        element={
                            <Layout>
                                <BookingConfirmation />
                            </Layout>
                        }
                    />
                </Route>
            </Routes>
            
            {/* Đặt ToastContainer ở đây để nó hiển thị trên toàn ứng dụng */}
            <ToastContainer 
                position="top-right" // Vị trí hiển thị (góc trên bên phải)
                autoClose={3000}     // Tự động đóng sau 3 giây (3000ms)
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </BrowserRouter>
    );
}

export default App;