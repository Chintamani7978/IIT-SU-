import UserLayoutWrapper from "@/components/UserLayoutWrapper";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserLayoutWrapper>
      {children}
    </UserLayoutWrapper>
  );
}
