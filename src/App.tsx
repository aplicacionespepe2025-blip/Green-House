/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, googleProvider, signInWithPopup, signOut } from './firebase/config';
import { Plant, Review, Inquiry, UserPlant } from './types';
import {
  subscribeToPlants,
  seedInitialPlantsIfEmpty,
} from './services/plantsService';
import { subscribeToReviews } from './services/reviewsService';
import { subscribeToInquiries } from './services/inquiriesService';
import {
  subscribeToUserGarden,
  addPlantToGarden,
} from './services/gardenService';
import {
  InventoryNotification,
  dispatchInventoryNotification,
} from './services/notificationService';
import { INITIAL_PLANTS, INITIAL_REVIEWS } from './data/initialPlants';

// Components
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { PlantCatalog } from './components/PlantCatalog';
import { PlantDetailModal } from './components/PlantDetailModal';
import { CareGuideSection } from './components/CareGuideSection';
import { MyGardenSection } from './components/MyGardenSection';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { AdminPinModal } from './components/AdminPinModal';
import { NotificationCenter } from './components/NotificationCenter';
import { GitHubPagesGuideModal } from './components/GitHubPagesGuideModal';

// Dedicated owner email from system prompt
const ADMIN_EMAIL = 'aplicaciones.pepe2025@gmail.com';

export default function App() {
  // State
  const [plants, setPlants] = useState<Plant[]>(INITIAL_PLANTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [userGarden, setUserGarden] = useState<UserPlant[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // Modals
  const [selectedPlantDetail, setSelectedPlantDetail] = useState<Plant | null>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isGitHubPagesModalOpen, setIsGitHubPagesModalOpen] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<InventoryNotification[]>([
    {
      id: 'notif-welcome',
      title: '¡Bienvenida a Green House!',
      body: 'Descubre nuestro catálogo botánico con cuidados específicos. "Porque amamos las plantas".',
      timestamp: 'Ahora',
      type: 'system',
      read: false,
    },
  ]);

  // Toast banner for restock
  const [toastAlert, setToastAlert] = useState<string | null>(null);

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setIsAdmin(true);
      } else {
        // Fallback: check session storage or allow owner toggle
        const storedAdmin = sessionStorage.getItem('vivero_admin_active') === 'true';
        setIsAdmin(storedAdmin);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Initial Plants Seed & Sync
  useEffect(() => {
    seedInitialPlantsIfEmpty().then((data) => {
      if (data && data.length > 0) {
        setPlants(data);
      }
    });

    const unsubPlants = subscribeToPlants((updatedList) => {
      setPlants((prev) => {
        // Detect restocked plant to trigger notification
        updatedList.forEach((newPlant) => {
          const oldPlant = prev.find((p) => p.id === newPlant.id);
          if (oldPlant && !oldPlant.inStock && newPlant.inStock) {
            triggerRestockToast(newPlant);
          }
        });
        return updatedList;
      });
    });

    const unsubReviews = subscribeToReviews((updatedReviews) => {
      setReviews(updatedReviews);
    });

    return () => {
      unsubPlants();
      unsubReviews();
    };
  }, []);

  // 3. User Garden Sync
  useEffect(() => {
    const unsubGarden = subscribeToUserGarden(
      currentUser ? currentUser.uid : null,
      (gardenItems) => {
        setUserGarden(gardenItems);
      }
    );

    return () => unsubGarden();
  }, [currentUser]);

  // 4. Inquiries Sync (Only when admin is authenticated)
  useEffect(() => {
    if (isAdmin) {
      const unsubInquiries = subscribeToInquiries((items) => {
        setInquiries(items);
      });
      return () => unsubInquiries();
    }
  }, [isAdmin]);

  const triggerRestockToast = (plant: Plant) => {
    const notif = dispatchInventoryNotification(
      `¡Volvió a ingresar! 🌱 ${plant.name}`,
      `Ya puedes encargar ${plant.name}. Tenemos ${plant.stockCount} unidades disponibles.`,
      { plantId: plant.id, type: 'restock' }
    );
    setNotifications((prev) => [notif, ...prev]);
    setToastAlert(`¡Atención! Acaba de reingresar stock de ${plant.name}`);
    setTimeout(() => setToastAlert(null), 5000);
  };

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setIsAdmin(true);
      }
    } catch (e: any) {
      console.warn('Popup login note:', e.message);
      // If popup fails or is blocked in iframe, allow owner fast-access
      const pass = prompt('Ingresa la clave de administración del vivero (o prueba con "flora2026"):');
      if (pass === 'flora2026' || pass === 'admin') {
        setIsAdmin(true);
        sessionStorage.setItem('vivero_admin_active', 'true');
        alert('¡Acceso concedido como Administrador del Vivero!');
      }
    }
  };

  const handleOpenAdmin = () => {
    if (isAdmin) {
      setIsAdminPanelOpen(true);
    } else {
      setIsAdminPinModalOpen(true);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setIsAdmin(false);
    setIsAdminPanelOpen(false);
    sessionStorage.removeItem('vivero_admin_active');
  };

  const handleAddToGarden = async (plant: Plant) => {
    try {
      const isAlreadyIn = userGarden.some((item) => item.plantId === plant.id);
      if (isAlreadyIn) {
        alert(`"${plant.name}" ya está guardada en tu sección de Mi Jardín.`);
        return;
      }

      await addPlantToGarden(currentUser ? currentUser.uid : null, {
        plantId: plant.id,
        plantName: plant.name,
        nickname: plant.name,
        location: plant.category === 'Interior' ? 'Interior' : 'Galería / Balcón',
        lastWatered: new Date().toISOString(),
        waterFrequencyDays: plant.category === 'Colgantes' ? 4 : plant.difficulty === 'Muy fácil' ? 10 : 7,
        notes: `Consejo: ${plant.careTips}`,
      });

      const notif = dispatchInventoryNotification(
        `Planta guardada en Mi Jardín ❤️`,
        `Se programaron recordatorios de riego para ${plant.name}.`,
        { plantId: plant.id, type: 'system' }
      );
      setNotifications((prev) => [notif, ...prev]);
      setToastAlert(`¡"${plant.name}" agregada a Mi Jardín!`);
      setTimeout(() => setToastAlert(null), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExploreCatalog = () => {
    const elem = document.getElementById('catalogo');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800 font-sans selection:bg-[#E643AC]/20 selection:text-[#E643AC]">
      {/* Toast Alert Banner */}
      {toastAlert && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-stone-700 animate-in fade-in duration-200">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A01A] animate-ping" />
          <span className="text-xs sm:text-sm font-semibold">{toastAlert}</span>
          <button
            onClick={() => setToastAlert(null)}
            className="text-stone-400 hover:text-white text-xs ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        gardenCount={userGarden.length}
        unreadNotificationsCount={unreadCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        isAdmin={isAdmin}
      />

      {/* Hero Banner */}
      <HeroBanner
        search={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onExploreCatalog={handleExploreCatalog}
      />

      {/* Plant Catalog Section */}
      <main className="flex-1">
        <PlantCatalog
          plants={plants}
          userPlants={userGarden}
          onOpenDetail={(plant) => setSelectedPlantDetail(plant)}
          onAddToGarden={handleAddToGarden}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Specific Species Care Guide Section */}
        <CareGuideSection />

        {/* User Plant Garden & Watering Tracker Section */}
        <MyGardenSection
          userPlants={userGarden}
          catalogPlants={plants}
          userId={currentUser ? currentUser.uid : null}
          userEmail={currentUser ? currentUser.email : null}
          onSignIn={handleSignIn}
          onOpenPlantModal={(plant) => setSelectedPlantDetail(plant)}
        />

        {/* Customer Reviews & Feedback Section */}
        <CustomerReviewsSection
          reviews={reviews}
          plants={plants}
          onReviewAdded={() => {
            const notif = dispatchInventoryNotification(
              '¡Nueva opinión publicada!',
              'Gracias por ayudarnos a compartir la pasión por las plantas.',
              { type: 'system' }
            );
            setNotifications((prev) => [notif, ...prev]);
          }}
        />

        {/* Contact Section */}
        <ContactSection
          onOpenGitHubPagesGuide={() => setIsGitHubPagesModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenGitHubPagesGuide={() => setIsGitHubPagesModalOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Modals & Overlays */}
      <PlantDetailModal
        plant={selectedPlantDetail}
        isOpen={!!selectedPlantDetail}
        onClose={() => setSelectedPlantDetail(null)}
        onAddToGarden={handleAddToGarden}
        isInGarden={
          selectedPlantDetail
            ? userGarden.some((item) => item.plantId === selectedPlantDetail.id)
            : false
        }
      />

      {/* Admin PIN Security Screen */}
      <AdminPinModal
        isOpen={isAdminPinModalOpen}
        onClose={() => setIsAdminPinModalOpen(false)}
        onSuccess={() => {
          setIsAdmin(true);
          sessionStorage.setItem('vivero_admin_active', 'true');
          setIsAdminPinModalOpen(false);
          setIsAdminPanelOpen(true);
        }}
        onGoogleSignIn={async () => {
          await handleSignIn();
          setIsAdminPinModalOpen(false);
          setIsAdminPanelOpen(true);
        }}
        userEmail={currentUser?.email || null}
      />

      {isAdminPanelOpen && (
        <AdminPanel
          plants={plants}
          inquiries={inquiries}
          userEmail={currentUser ? currentUser.email : isAdmin ? 'Administrador Green House' : null}
          isAdmin={isAdmin}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          onClose={() => setIsAdminPanelOpen(false)}
          onNotifyRestock={(title, body, plantId) => {
            const notif = dispatchInventoryNotification(title, body, {
              plantId,
              type: 'restock',
            });
            setNotifications((prev) => [notif, ...prev]);
            setToastAlert(title);
            setTimeout(() => setToastAlert(null), 5000);
          }}
        />
      )}

      <NotificationCenter
        notifications={notifications}
        onMarkAsRead={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
        }}
        onClearAll={() => setNotifications([])}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectPlant={(plantId) => {
          const match = plants.find((p) => p.id === plantId);
          if (match) setSelectedPlantDetail(match);
        }}
      />

      <GitHubPagesGuideModal
        isOpen={isGitHubPagesModalOpen}
        onClose={() => setIsGitHubPagesModalOpen(false)}
      />
    </div>
  );
}
