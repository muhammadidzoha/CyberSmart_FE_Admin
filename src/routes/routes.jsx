import News from "../views/Informasi/News";
import Dashboard from "../views/Dashboard/Dashboard";
import Pengumuman from "../views/Informasi/Pengumuman";
import User from "../views/User/User";
import { MdDashboard, MdAnnouncement, MdAlternateEmail } from "react-icons/md";
import { PiUsersFourFill } from "react-icons/pi";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { SiAuthelia } from "react-icons/si";
import Destinasi from "../views/Destinasi/Destinasi";
import Keuangan from "../views/Keuangan/Keuangan";
import Surat from "../views/Surat/Surat";
import Masuk from "../views/Auth/Masuk";

const routes = [
  {
    id: 1,
    name: "Dashboard",
    layout: "/admin",
    path: "dashboard",
    component: <Dashboard />,
    icon: <MdDashboard className="h-6 w-6" />,
  },
  {
    id: 2,
    name: "User",
    layout: "/admin",
    path: "user",
    component: <User />,
    icon: <PiUsersFourFill className="h-6 w-6" />,
  },
  {
    id: 3,
    name: "Surat",
    layout: "/admin",
    path: "surat",
    component: <Surat />,
    icon: <MdAlternateEmail className="h-6 w-6" />,
  },
  {
    id: 5,
    name: "Manajemen Informasi",
    layout: "/admin",
    path: "manajemen-informasi",
    component: "",
    icon: <MdAnnouncement className="h-6 w-6" />,
    subRoutes: [
      {
        id: 1,
        name: "Berita",
        path: "berita",
        component: <News />,
      },
      {
        id: 2,
        name: "Pengumuman",
        path: "pengumuman",
        component: <Pengumuman />,
      },
      {
        id: 3,
        name: "Destinasi",
        path: "destinasi",
        component: <Destinasi />,
      },
    ],
  },
  {
    id: 6,
    name: "Keuangan",
    layout: "/admin",
    path: "keuangan",
    component: <Keuangan />,
    icon: <FaMoneyCheckAlt className="h-6 w-6" />,
  },
  {
    name: "Masuk",
    layout: "/auth",
    path: "masuk",
    component: <Masuk />,
    icon: <SiAuthelia className="h-6 w-6" />,
  },
];

export default routes;
