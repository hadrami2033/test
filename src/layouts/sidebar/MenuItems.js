const Menuitems = [
  {
    title: "Home",
    icon: "home",
    href: "/",
  },
  {
    title: "Dettes",
    href: "/dettes",
  },
  {
    title: "Conventions",
    icon: "users",
    href: "/conventions",
  },
  {
    title: "Utilisateurs",
    icon: "users",
    href: "/users",
  },
 /*  {
    title: "Engagements",
    icon: "",
    href: "/commitments",
  },
  {
    title: "Factures",
    icon: "file-text",
    href: "/invoices",
  }, */
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
        title: "Monnaie de référence",
        href: "/reference_money",
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
        title: "Statut de décaissement",
        href: "/status_type",
      },
      {
        title: "Statut de remboursement",
        href: "/payment_status_type",
      }
    ]
  },
  
];

export default Menuitems;
