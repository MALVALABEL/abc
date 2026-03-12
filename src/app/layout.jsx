import './globals.css';

export const metadata = {
  title: 'Partidos ABC',
  description: 'Reserva tu cupo para el proximo partido',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
