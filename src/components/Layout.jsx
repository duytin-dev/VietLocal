import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ showFooter = true, headerVariant }) {
  return (
    <div className="vl-app">
      <Header variant={headerVariant} />
      <main className="vl-main">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
