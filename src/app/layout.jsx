import './globals.css';

export const metadata = {
  title: 'Partidos ABC - Reserva tu cupo',
  description: 'Reserva tu cupo para el proximo partido de futbol',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
