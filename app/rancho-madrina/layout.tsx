export default function RanchoMadrinaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Rancho Madrina Community Association</title>
        <meta name="description" content="Rancho Madrina is a gated community in San Juan Capistrano featuring 120 homes with easy access to downtown and major highways." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

