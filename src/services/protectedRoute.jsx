import { useNavigate } from "react-router";

const protectedRoute = ({ children }) => {
  // const Navigate = useNavigate();
  // const store = localStorage.getItem("user");
  // const authentication = store ? true : false;
  // if (authentication === true) {
  //   return Navigate("/");
  // }
  // if (!authentication) {
  //   Navigate("/login");
  // }
  // return <Navigate to="/login" state={{ from: location }} replace />;
};

export default protectedRoute;
