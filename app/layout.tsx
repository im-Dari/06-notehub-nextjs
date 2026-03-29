import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import TanStackProvider from '../components/TanStackProvider/TanStackProvider';
import './globals.css';

export const metadata = {
  title: 'NoteHub',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="appContainer">
        <TanStackProvider>
          <Header />
          <main className="appContent">{children}</main>
          <Footer />
          <div id="root"></div>
          <div id="modal-root"></div>
        </TanStackProvider>
      </body>
    </html>
  );
}