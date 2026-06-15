import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/header";
import { LandingPage } from "@/pages/landing";
import { SignupPage } from "@/pages/signup";
import { ProcessingPage } from "@/pages/processing";
import { DashboardPage } from "@/pages/dashboard";
import { LandlordStubPage } from "@/pages/landlord-stub";

export function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding/processing" element={<ProcessingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/landlord-stub" element={<LandlordStubPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
