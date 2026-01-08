const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, type: "spring", staggerChildren: 0.1 },
  },
  exit: { opacity: 0, y: 30, transition: { duration: 0.3 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const DashboardcardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      type: "spring",
    },
  }),
};
const GroupVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, type: "spring", staggerChildren: 0.1 },
  },
  exit: { opacity: 0, y: 30, transition: { duration: 0.3 } },
};
const groupCardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};
const ExpenseVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring" } },
  exit: { opacity: 0, y: 30, transition: { duration: 0.2 } },
};

const filterBtnVariants = {
  hover: { scale: 1.07, backgroundColor: "#38bdf8", color: "#fff" },
  tap: { scale: 0.97 },
};
const navBar = ["Dashboard.png", "Contact.png", "Group.png", "Bills.png", "Budgets.png"];
const landingPage = [
  {
    title: "One-Tap Expense Logging",
    desc: "Add expenses in seconds. Categorize, split, and move on with life."
  },
  {
    title: "Fair Bill Splitting",
    desc: "Split equally or unequally. Perfect for rent, trips, food, and utilities."
  },
  {
    title: "Clear Insights",
    desc: "Visual summaries that show where your money actually goes."
  }
]
const landingPage_cards=[
  { step: "01", title: "Create a Group", desc: "Flatmates, friends, family, or trips." },
  { step: "02", title: "Add Expenses", desc: "Log who paid and how to split it." },
  { step: "03", title: "Settle Easily", desc: "See balances clearly. No awkward talks." }
]


export {
  containerVariants,
  cardVariants,
  DashboardcardVariants,
  GroupVariants,
  groupCardVariants,
  filterBtnVariants,
  ExpenseVariants,
  navBar,
  landingPage,
  landingPage_cards
};
