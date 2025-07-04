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
import { StoreReviewsPage } from "./pages/client/reviews/StoreReviewsPage";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Import trang ContactPage mới ---
import ContactPage from "@/pages/client/contact/ContactPage";

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
                <Route
                    path={routes.store_reviews}
                    element={
                        <Layout>
                            <StoreReviewsPage />
                        </Layout>
                    }
                />
                {/* --- Thêm route cho trang ContactPage --- */}
                <Route
                    path={routes.contact_feedback}
                    element={
                        <Layout>
                            <ContactPage />
                        </Layout>
                    }
                />
                <Route path="*" element={<ErrorPage />} />

                {/* Protected routes (giữ nguyên cho các tính năng khác của bạn) */}
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
            
            <ToastContainer
                position="top-right"
                autoClose={3000}
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