
export const sideBarItems = [
  {
    label: "Dashboard",
    routeTo: "/dashboard",
    icon: "ic:outline-space-dashboard",
    permission: "DASHBOARD"
  },

  {
    label: "Book Categories",
    routeTo: "/dashboard/book-categories",
    icon: "ic:outline-library-books",
    permission:Actions.READ_BOOK_CATEGORY
  },
  {
    label: "Books",
    routeTo: "/dashboard/books",
    icon: "ic:outline-menu-book",
    permission:Actions.READ_BOOK
  },
  {
    label: "Languages",
    routeTo: "/dashboard/languages",
    icon: "ic:outline-language",
    permission: Actions.READ_LANGUAGE
  },
  {
    label: "Pages",
    routeTo: "/dashboard/pages",
    icon: "ic:outline-insert-page-break",
    permission:Actions.READ_PAGE
  },
  {
    label: "Video Categories",
    routeTo: "/dashboard/video-categories",
    icon: "ic:outline-perm-media",
    permission:Actions.READ_VIDEO_CATEGORY
  },
  {
    label: "Videos",
    routeTo: "/dashboard/videos",
    icon: "ic:outline-ondemand-video",
    permission:Actions.READ_VIDEO
  },
  // {
  //   label: "Reports",
  //   routeTo: "/dashboard/reports",
  //   icon: "ic:outline-document-scanner",
  // },
  {
    label: "Users",
    routeTo: "/dashboard/users",
    icon: "ic:outline-person",
    permission:Actions.READ_USER
  },
];
