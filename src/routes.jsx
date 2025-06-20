import { Auth } from "./page/auth";
import { Navigate } from "react-router-dom";
import { DashboardPage } from "./page/dashboard/DashboardPage";
import { ProfilePage } from "./page/userProfile/ProfilePage";
import { DepositPage } from "./page/deposit/DepositPage";
import { UsersPage } from "./page/users/UsersPage.jsx";
import { PasswordRecoveryPage } from "./page/recoverPassword";
import { AcceptUsersPage } from "./page/users/AcceptUsersPage.jsx";
import { PrizePage } from "./page/Prize/prizePage.jsx";
import { MovementsPage } from "./page/movements/MovementsPage.jsx";
import { AccountsPage } from "./page/accounts/AccountsPage.jsx"; 
import {RewardPage} from "./page/reward/RewardPage.jsx"
import {DivisaPage} from "./page/divisa/divisaPage.jsx"
import { FavoritesPage } from "./page/favorite/FavoritePage.jsx";



const routes = [
  { path: '/auth', element: <Auth /> },
  { path: '/resetPassword', element: <PasswordRecoveryPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/myProfile', element: <ProfilePage /> },
  { path: '/deposit', element: <DepositPage /> },
  { path: '/users', element: <UsersPage /> },
  { path: '/acceptUsers', element: <AcceptUsersPage /> },
  { path: '/prize', element: <PrizePage /> },
  { path: '/movements', element: <MovementsPage /> },
  { path: '/reward', element: <RewardPage /> },
  { path: '/accounts', element: <AccountsPage /> },
  { path: '/divisa', element: <DivisaPage /> },
  { path: '/favorito', element: <FavoritesPage /> },
  { path: '/', element: <Navigate to={'/auth'} /> }
  
];

export default routes;
