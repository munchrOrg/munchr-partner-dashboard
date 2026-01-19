export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export type HeaderProps = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};
