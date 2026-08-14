import Link from "next/link";

interface HeaderProps {
  currentUser: any; // You can strongly type this later based on your user schema
}

export default function Header({ currentUser }: HeaderProps) {
  // A clever array trick to dynamically generate navigation links
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig) // Filters out the 'false' values
    .map(({ label, href }: any) => (
      <li key={href}>
        <Link
          href={href}
          className="text-sm font-medium hover:text-gray-600 transition-colors"
        >
          {label}
        </Link>
      </li>
    ));

  return (
    <nav className="border-b px-8 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold tracking-tight">
        GitTix
      </Link>

      <div className="flex items-center space-x-6">
        <ul className="flex items-center space-x-4">{links}</ul>
      </div>
    </nav>
  );
}
