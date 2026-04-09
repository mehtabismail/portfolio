import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="font" href="/assets/fonts/NeueMontreal-Regular.otf" type="font/otf" crossOrigin="anonymous" />
        <link href="/assets/css/normalize.css" rel="stylesheet" />
        <link href="/assets/css/locomotive-scroll.css" rel="stylesheet" />
        <link href="/assets/css/styleguide.css" rel="stylesheet" />
        <link href="/assets/css/components.css" rel="stylesheet" />
        <link href="/assets/css/style-new.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
