import Navbar from './Navbar';
import Footer from './Footer';

const Layouts: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layouts;