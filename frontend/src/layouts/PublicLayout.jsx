import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import WhatsAppButton from '../components/common/WhatsAppButton';

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px' }}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton variant="floating" />
    </>
  );
};

export default PublicLayout;
