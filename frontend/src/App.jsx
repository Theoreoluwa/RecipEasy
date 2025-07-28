import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from "./layouts/Header"
import Authenticated from './layouts/protection/authenticated';
import NotAuthenticated from './layouts/protection/not-authenticated';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ForgotPassword/ResetPassword';
import RecipeDetails from './pages/RecipeDetails/RecipeDetails';
import { Toaster } from 'react-hot-toast';
import CreateRecipe from './pages/CreateRecipe/CreateRecipe';
import CheckAuth from './layouts/protection/check-auth';
import Logout from './pages/Logout/Logout';
import EditRecipe from './pages/EditRecipe/EditRecipe';
import UserProfile from './pages/UserProfile/UserProfile';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route
          element={
            <CheckAuth>
              <Outlet />
            </CheckAuth>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/RecipeDetails/:id" element={<RecipeDetails />} />

          {/* Routes That Can Only Be Accessed When Not Authorized */}
          <Route
            element={
              <NotAuthenticated>
                <Outlet />
              </NotAuthenticated>
            }
          >
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword/:id/:token" element={<ResetPassword />} />
          </Route>

          {/* Authenticated Required Routes Go Through Here */}
          <Route
            element={
              <Authenticated>
                <Outlet />
              </Authenticated>
            }
          >
            <Route path="/logout" element={<Logout />} />
            <Route path="/create" element={<CreateRecipe />} />
            <Route path="/RecipeDetails/:id/edit" element={<EditRecipe />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
