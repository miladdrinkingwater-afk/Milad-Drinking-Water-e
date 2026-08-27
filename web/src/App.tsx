import React, { useState, useEffect } from 'react';
import { Language, ProductId, ServiceType, FirestoreOrder, AdminUser } from './types';
import { orderService } from './services/orderService';
import { authService } from './services/authService';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { Products } from './components/Products';
import { Services } from './components/Services';
import { QualitySection } from './components/QualitySection';
import { AboutSection } from './components/AboutSection';
import { EventBanner } from './components/EventBanner';
import { OrderProcess } from './components/OrderProcess';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { OrderModal } from './components/OrderModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { FloatingActions } from './components/FloatingActions';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

type ViewMode = 'public' | 'track-order' | 'admin-login' | 'admin-dashboard';

export function App() {
  const [lang, setLang] = useState<Language>('bn');
  const [currentView, setCurrentView] = useState<ViewMode>('public');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<ProductId>('jar_20l');
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType>('home_delivery');
  const [savedOrders, setSavedOrders] = useState<FirestoreOrder[]>([]);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Sync hash routing and auth state
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash || '';
      const path = window.location.pathname || '';

      if (path === '/admin' || hash === '#/admin' || hash === '#admin') {
        if (adminUser) {
          setCurrentView('admin-dashboard');
        } else {
          setCurrentView('admin-login');
        }
      } else if (path === '/track-order' || hash === '#/track-order' || hash === '#track-order') {
        setCurrentView('track-order');
      } else {
        setCurrentView('public');
      }
    };

    handleLocationChange();
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    // Initial auth listener
    const unsubscribeAuth = authService.onAuthChange((user) => {
      setAdminUser(user);
      const hash = window.location.hash || '';
      const path = window.location.pathname || '';
      if ((path === '/admin' || hash.includes('admin')) && user) {
        setCurrentView('admin-dashboard');
      }
    });

    // Load customer order cache
    const initialOrders = orderService.getLocalOrders();
    setSavedOrders(initialOrders);

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
      unsubscribeAuth();
    };
  }, [adminUser]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  const handleOpenOrderModal = (productId: ProductId = 'jar_20l', serviceType: ServiceType = 'home_delivery') => {
    setSelectedProductId(productId);
    setSelectedServiceType(serviceType);
    setIsOrderModalOpen(true);
  };

  const handleSaveOrder = (order: FirestoreOrder) => {
    const updated = [order, ...savedOrders.filter(o => o.orderId !== order.orderId)];
    setSavedOrders(updated);
  };

  const handleClearOrders = () => {
    orderService.clearLocalOrders();
    setSavedOrders([]);
  };

  const navigateToView = (view: ViewMode) => {
    setCurrentView(view);
    if (view === 'admin-login' || view === 'admin-dashboard') {
      window.location.hash = '#/admin';
    } else if (view === 'track-order') {
      window.location.hash = '#/track-order';
    } else {
      window.location.hash = '';
    }
  };

  // View: Admin Dashboard
  if (currentView === 'admin-dashboard' && adminUser) {
    return (
      <AdminDashboardPage
        adminUser={adminUser}
        lang={lang}
        onLogout={async () => {
          await authService.logout();
          setAdminUser(null);
          navigateToView('admin-login');
        }}
        onNavigateHome={() => navigateToView('public')}
      />
    );
  }

  // View: Admin Login
  if (currentView === 'admin-login') {
    return (
      <AdminLoginPage
        lang={lang}
        onLoginSuccess={(user) => {
          setAdminUser(user);
          navigateToView('admin-dashboard');
        }}
        onBackToWebsite={() => navigateToView('public')}
      />
    );
  }

  // View: Track Order
  if (currentView === 'track-order') {
    return (
      <TrackOrderPage
        lang={lang}
        onBackToHome={() => navigateToView('public')}
        onOpenOrderModal={() => handleOpenOrderModal()}
      />
    );
  }

  // View: Public Customer-Facing Website
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
        onOpenOrderModal={() => handleOpenOrderModal('jar_20l', 'home_delivery')}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        onNavigateTrackOrder={() => navigateToView('track-order')}
        orderCount={savedOrders.length}
      />

      {/* Main Content Sections */}
      <main className="flex-grow pt-16">
        <Hero
          lang={lang}
          onOpenOrderModal={handleOpenOrderModal}
        />

        <TrustBar lang={lang} />

        <Products
          lang={lang}
          onOpenOrderModalWithProduct={(productId) => handleOpenOrderModal(productId, 'home_delivery')}
        />

        <Services
          lang={lang}
          onOpenOrderModalWithService={(serviceType) => handleOpenOrderModal('jar_20l', serviceType)}
        />

        <QualitySection lang={lang} />

        <AboutSection
          lang={lang}
        />

        <EventBanner
          lang={lang}
          onOpenEventOrder={() => handleOpenOrderModal('both', 'event_bulk_supply')}
        />

        <OrderProcess lang={lang} />

        <ContactSection lang={lang} />
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onSelectProduct={(pId) => handleOpenOrderModal(pId, 'home_delivery')}
        onSelectService={(sId) => handleOpenOrderModal('jar_20l', sId)}
        onNavigateTrackOrder={() => navigateToView('track-order')}
        onNavigateAdmin={() => navigateToView('admin-login')}
      />

      {/* Modals & Floating CTA */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        lang={lang}
        initialProductId={selectedProductId}
        initialServiceType={selectedServiceType}
        onSaveOrder={handleSaveOrder}
      />

      <OrderHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        lang={lang}
        orders={savedOrders}
        onClearOrders={handleClearOrders}
        onRepeatOrder={(order: FirestoreOrder) => {
          setIsHistoryModalOpen(false);
          handleOpenOrderModal(
            order.jar20Qty > 0 && order.bottle5Qty > 0 ? 'both' : order.jar20Qty > 0 ? 'jar_20l' : 'bottle_5l',
            order.deliveryType === 'OFFICE' ? 'office_delivery' : order.deliveryType === 'EVENT_BULK' ? 'event_bulk_supply' : 'home_delivery'
          );
        }}
      />

      <FloatingActions
        lang={lang}
        onOpenOrderModal={() => handleOpenOrderModal('jar_20l', 'home_delivery')}
      />
    </div>
  );
}

export default App;
