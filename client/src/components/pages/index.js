// Import 404 page
import Page404 from './NotFound';
// Import the pages
import Home from './Home';
import RoomSelect from './RoomSelect';
import Simulation from './Simulation';

const Pages = Object.freeze({
  Home,
  RoomSelect,
  Simulation,
});

export const NotFound = Page404;
export default Pages;
