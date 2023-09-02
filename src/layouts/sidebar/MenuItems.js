const Menuitems = [
  {
    title: "Home",
    icon: "home",
    href: "/",
  },
  {
    title: "Conventions",
    icon: "users",
    href: "/conventions",
  },
  {
    title: "Engagements",
    icon: "",
    href: "/commitments",
  },
  {
    title: "Factures",
    icon: "file-text",
    href: "/invoices",
  },
  {
    title: "Paramétrage",
    icon: "settings",
    items: [
      {
        title: "Bailleurs",
        href: "/funders",
      },
      {
        title: "Emprunteurs",
        href: "/borrowers",
      },
      {
        title: "Prestateurs",
        href: "/contractors",
      },
      {
        title: "Types de catégorie",
        href: "/categorie_type",
      },
      {
        title: "Devise",
        href: "/currencies",
      },
      {
        title: "Type de décaissement",
        href: "/disbursementtypes",
      },
      {
        title: "Type de dépense",
        href: "/spendings_type",
      },
      {
        title: "Type de statut",
        href: "/status_type",
      }
    ]
  },
  
];

export default Menuitems;
