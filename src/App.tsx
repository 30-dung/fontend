import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./components/pages/client/home/Home";
import { AboutPage } from "./components/pages/client/about/About";
import { BookingPage } from "./components/pages/client/booking/Booking";
import { LoginPage } from "./components/pages/client/auth/Login";
import { ForgotPasswordPage } from "./components/pages/client/auth/Forgot";
import { RegisterPage } from "./components/pages/client/auth/Register";
import { ShopPage } from "./components/pages/client/shop/shop_product";
import { ServiceComBo } from "./components/pages/client/servicss/ServiceCombo";
import { ComboDetail } from "./components/pages/client/servicss/ComboDetail";
import { ErrorPage } from "./components/pages/client/error/Error";
import { Profile } from "./components/pages/client/profile";
import { UpdateProfile } from "./components/pages/client/profile/updateProfile";
import { LocationPage } from "./components/pages/client/location/Location";
import { Header } from "./components/layout/layoutpr/Header";
import routes from "./config/routes";
import { ResetPasswordPage } from "./components/pages/client/auth/Reset";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" index element={<Layout><HomePage /></Layout>} />
        <Route path={routes.about} element={<Layout><AboutPage /></Layout>} />
        <Route path={routes.booking} element={<Layout><BookingPage /></Layout>} />
        <Route path={routes.login} element={<LoginPage />} />
        <Route path={routes.register} element={<RegisterPage />} />
        <Route path={routes.forgot} element={<ForgotPasswordPage />} />
        <Route path={routes.reset} element={<ResetPasswordPage />} />
        <Route path={routes.shop} element={<Layout><ShopPage /></Layout>} />
        <Route path={routes.services_combo} element={<Layout><ServiceComBo /></Layout>} />
        <Route path={routes.combo_detail} element={<Layout><ComboDetail /></Layout>} />
        <Route path="*" element={<ErrorPage />} />
        <Route path={routes.profile.index} element={<Layout><Header /></Layout>}>
          <Route path="/profile" index element={<Profile />} />
          <Route path={routes.profile.updateProfile} element={<UpdateProfile />} />
        </Route>
        <Route path={routes.location_page} element={<Layout><LocationPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;