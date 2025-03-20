import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from '../shop/shop-components/CartSidebar';

const Layouts: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Layouts;