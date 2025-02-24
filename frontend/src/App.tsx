import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import { useState } from "react";

import LoginComponent from "./components/LoginComponent";
import { AuthService } from "./services/authService";
import { DataService } from "./services/dataService";
import CreateSpace from "./components/spaces/CreateSpace";
import Spaces from "./components/spaces/Spaces";

import "./App.css";

const authService = new AuthService();
const dataService = new DataService(authService);

function App() {
  const [userName, setUserName] = useState<string | undefined>(undefined);
  // const { data, loading, error } = useSelector((state: RootState) => state.auth).temporary;
  // const dispatch = useDispatch<AppDispatch>();
  // use effect or on click!

  // if (loading === 'undefined') {
  //   dispatch(generateTemporaryCredentialsThunk());
  // }

  const router = createBrowserRouter([
    {
      element: (
        <>
          <NavBar userName={userName} />
          <Outlet />
        </>
      ),
      children: [
        {
          path: "/",
          element: <div>Hello world!</div>,
        },
        {
          path: "/login",
          element: (
            <LoginComponent
              authService={authService}
              setUserNameCb={setUserName}
            />
          ),
        },
        {
          path: "/profile",
          element: <div>Profile page</div>,
        },
        {
          path: "/createSpace",
          element: <CreateSpace dataService={dataService} />,
        },
        {
          path: "/spaces",
          element: <Spaces dataService={dataService} />,
        },
      ],
    },
  ]);

  return (
    <div className="wrapper">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
