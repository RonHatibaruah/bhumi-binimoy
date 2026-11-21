import React, { useState, useMemo, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { CadastralMapViewer } from './components/CadastralMapViewer';
import { BuyerDealRoom } from './components/BuyerDealRoom';
import { SellerListingPortal } from './components/SellerListingPortal';
import { WorkflowTracker } from './components/WorkflowTracker';
import { AdminConsole } from './components/AdminConsole';
import { TutorialModal } from './components/TutorialModal';
import { Footer } from './components/Footer';
import { initialLandMarketplaceListings } from './data/mockAssamLandData';
import { LandMarketplaceListing, BuyerOffer } from './types/landRecords';

export function App() {
  const [listings, setListings] = useState<LandMarketplaceListing[]>(initialLandMarketplaceListings);
  const [activeTab, setActiveTab] = useState<ActiveTab>('marketplace');
  const [selectedCircle, setSelectedCircle] = useState<string>('ALL');
  const [selectedListing, setSelectedListing] = useState<LandMarketplaceListing>(initialLandMarketplaceListings[0]);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);

  // Sync hash with active tab for deep-linking
  useEffect(() => {
    const syncTabFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'marketplace' || hash === 'gis-map') setActiveTab('marketplace');
      else if (hash === 'deal-room') setActiveTab('deal-room');
      else if (hash === 'seller-portal' || hash === 'sell-land') setActiveTab('seller-portal');
      else if (hash === 'workflow-tracker' || hash === 'pipeline') setActiveTab('workflow-tracker');
      else if (hash === 'admin-console' || hash === 'admin') setActiveTab('admin-console');
      else if (hash === 'tutorial') setIsTutorialOpen(true);
    };

    syncTabFromHash();
    window.addEventListener('hashchange', syncTabFromHash);
    return () => window.removeEventListener('hashchange', syncTabFromHash);
  }, []);

  const handleTabSelect = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (window.location.hash !== `#${tab}`) {
      window.history.pushState(null, '', `#${tab}`);
    }
    // Scroll to top when changing tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter listings by selected circle
  const filteredListings = useMemo(() => {
    if (selectedCircle === 'ALL') return listings;
    return listings.filter(l => l.circle.toLowerCase() === selectedCircle.toLowerCase());
  }, [listings, selectedCircle]);

  // Open deal room for a specific listing
  const handleOpenDealRoom = (listing: LandMarketplaceListing) => {
    setSelectedListing(listing);
    handleTabSelect('deal-room');
  };

  // Submit an offer/EOI for a listing
  const handleSubmitOffer = (listingId: string, offer: BuyerOffer) => {
    setListings(prev => prev.map(item => {
      if (item.id === listingId) {
        return {
          ...item,
          stage: 'EOI_SUBMITTED',
          offers: [offer, ...item.offers]
        };
      }
      return item;
    }));
  };

  // When a seller creates a voluntary listing
  const handleListingCreated = (newListing: LandMarketplaceListing) => {
    setListings(prev => [newListing, ...prev]);
    setSelectedListing(newListing);
  };

  // Admin moderation status updater
  const handleUpdateListingStatus = (listingId: string, newStage: any) => {
    setListings(prev => prev.map(item => {
      if (item.id === listingId) {
        return {
          ...item,
          stage: newStage
        };
      }
      return item;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabSelect}
        selectedCircle={selectedCircle}
        setSelectedCircle={setSelectedCircle}
        listings={filteredListings}
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'marketplace' && (
          <CadastralMapViewer
            listings={filteredListings}
            onSelectListing={(listing) => setSelectedListing(listing)}
            onOpenDealRoom={handleOpenDealRoom}
            selectedListingId={selectedListing.id}
          />
        )}

        {activeTab === 'deal-room' && (
          <BuyerDealRoom
            listing={selectedListing}
            onBackToMap={() => handleTabSelect('marketplace')}
            onSubmitOffer={handleSubmitOffer}
          />
        )}

        {activeTab === 'seller-portal' && (
          <SellerListingPortal
            onListingCreated={handleListingCreated}
            onNavigateToMarketplace={() => handleTabSelect('marketplace')}
          />
        )}

        {activeTab === 'workflow-tracker' && (
          <WorkflowTracker
            listings={listings}
            onSelectListing={(listing) => setSelectedListing(listing)}
          />
        )}

        {activeTab === 'admin-console' && (
          <AdminConsole 
            listings={listings} 
            onUpdateListingStatus={handleUpdateListingStatus}
          />
        )}
      </main>

      {/* Global Application Footer */}
      <Footer onNavigateTab={handleTabSelect} />

      {/* Interactive Guide / Tutorial Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onNavigateTab={(tab) => {
          handleTabSelect(tab);
          setIsTutorialOpen(false);
        }}
      />
    </div>
  );
}

export default App;
