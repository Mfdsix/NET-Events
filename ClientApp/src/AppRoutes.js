import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { Home } from "./components/Home";
import { Event } from "./components/Event";
import { EventDetail } from "./components/EventDetail";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
      path: '/events',
      element: <Event />
    },
    {
        path: '/events/:id',
        element: <EventDetail/>
    },
  ...ApiAuthorzationRoutes
];

export default AppRoutes;
