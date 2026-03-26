import PageTheme from "../florist/_components/florist-theme";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { UserProvider } from "@/app/contexts/user";

export default async function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <UserProvider>
      <PageTheme>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </PageTheme>
    </UserProvider>
  );
}
