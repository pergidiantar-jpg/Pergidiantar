/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { NotificationCenter } from './components/common/NotificationCenter';
import { Footer } from './components/common/Footer';
import { PublicLandingPage } from './components/customer/PublicLandingPage';
import { HeroSection } from './components/customer/HeroSection';
import { DestinationSlideshow } from './components/customer/DestinationSlideshow';
import { PackageCatalog } from './components/customer/PackageCatalog';
import { InclusionsSection } from './components/customer/InclusionsSection';
import { OrderTracker } from './components/customer/OrderTracker';
import { PackageDetailModal } from './components/customer/PackageDetailModal';
import { BookingModal } from './components/customer/BookingModal';
import { PaymentModal } from './components/customer/PaymentModal';
import { CustomerAuthModal } from './components/common/CustomerAuthModal';
import { EditProfileModal } from './components/common/EditProfileModal';
import { CustomerLiveChat } from './components/customer/CustomerLiveChat';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TourPackage, PackageCategory, DestinationRegion, PackageTier, BookingOrder } from './types/travel';

const MainAppContent: React.FC = () => {
  const { 
    packages, 
    activeTab, 
    currentRole, 
    isLoggedIn,
    isStaffLoggedIn,
    customerUser,
    activeOrderForPayment, 
    setActiveOrderForPayment,
    openAuthModal,
    pendingBooking,
    setPendingBooking,
    isNotifOpen,
    openNotifications,
    closeNotifications
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<PackageCategory | 'all'>('all');
  const [selectedDestination, setSelectedDestination] = useState<DestinationRegion | 'all'>('all');

  // Modals
  const [detailModalPackage, setDetailModalPackage] = useState<TourPackage | null>(null);
  const [bookingPackage, setBookingPackage] = useState<TourPackage | null>(null);
  const [bookingTier, setBookingTier] = useState<PackageTier>('all_in');

  const isCustomer = currentRole === 'customer';

  // Order Gating: Only registered customers can book
  const handleStartBooking = (pkg: TourPackage, tier: PackageTier) => {
    if (!customerUser) {
      setPendingBooking({ pkg, tier });
      openAuthModal('register', 'Order paket wisata hanya dapat dilakukan oleh pelanggan yang sudah teregistrasi di sistem PERGIDIANTAR. Silakan masuk atau buat akun baru terlebih dahulu.');
      return;
    }
    setBookingPackage(pkg);
    setBookingTier(tier);
    setDetailModalPackage(null);
  };

  // If user registers or logs in while having a pending booking intent, automatically open booking modal
  useEffect(() => {
    if (customerUser && pendingBooking) {
      setBookingPackage(pendingBooking.pkg);
      setBookingTier(pendingBooking.tier);
      setDetailModalPackage(null);
      setPendingBooking(null);
    }
  }, [customerUser, pendingBooking, setPendingBooking]);

  const handleProceedToPayment = (order: BookingOrder) => {
    setBookingPackage(null);
    setActiveOrderForPayment(order);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar onOpenNotifications={openNotifications} />

      {/* Main Viewport */}
      <main className="flex-1">
        {!isLoggedIn ? (
          /* Public Landing Page: Only Slideshow Interaktif & Info Menarik Wisata (Jogja, Malang & Bali) + Form Login & Register */
          <PublicLandingPage />
        ) : isCustomer ? (
          /* Logged In Customer Portal */
          activeTab === 'my-orders' ? (
            <OrderTracker />
          ) : (
            <>
              {/* Hero Banner with Inclusions */}
              <HeroSection
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedDestination={selectedDestination}
                onSelectDestination={setSelectedDestination}
                onScrollToCatalog={scrollToCatalog}
              />

              {/* Destination Highlights & Trivia Slideshow: Jogja, Malang, Bali */}
              <DestinationSlideshow
                onSelectDestination={(dest) => {
                  setSelectedDestination(dest);
                  scrollToCatalog();
                }}
                onExplorePackages={scrollToCatalog}
              />

              {/* Package Catalog */}
              <PackageCatalog
                packages={packages}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedDestination={selectedDestination}
                onSelectDestination={setSelectedDestination}
                onOpenDetail={(pkg) => setDetailModalPackage(pkg)}
                onStartBooking={handleStartBooking}
              />

              {/* Mandatory Inclusions, Fleet Showcase & FAQ */}
              <InclusionsSection />
            </>
          )
        ) : isStaffLoggedIn ? (
          /* Admin / Management View (Strictly gated after role login) */
          <AdminDashboard />
        ) : (
          <PublicLandingPage />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Customer Live Chat (Only for logged in users) */}
      {isLoggedIn && isCustomer && <CustomerLiveChat />}

      {/* Real-time Notifications Drawer (Khusus muncul di halaman Super Admin) */}
      {currentRole === 'super_admin' && (
        <NotificationCenter
          isOpen={isNotifOpen}
          onClose={closeNotifications}
        />
      )}

      {/* Customer & Staff Auth Modal */}
      <CustomerAuthModal />

      {/* Edit Profile Modal for ALL User Roles */}
      <EditProfileModal />

      {/* Package Detail & Itinerary Modal */}
      <PackageDetailModal
        packageData={detailModalPackage}
        isOpen={!!detailModalPackage}
        onClose={() => setDetailModalPackage(null)}
        onSelectBooking={handleStartBooking}
      />

      {/* Booking Wizard Modal */}
      <BookingModal
        packageData={bookingPackage}
        initialTier={bookingTier}
        isOpen={!!bookingPackage}
        onClose={() => setBookingPackage(null)}
        onProceedToPayment={handleProceedToPayment}
      />

      {/* Integrated Payment Gateway Modal */}
      <PaymentModal
        order={activeOrderForPayment}
        isOpen={!!activeOrderForPayment}
        onClose={() => setActiveOrderForPayment(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
