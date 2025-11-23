import ReactDom from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import Page1 from './pages/Page1.jsx';
import App from './app.jsx';
import Blogs from './components/Blogs';
import Services from './components/Services';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Page1 /> },
      { path: 'page1', element: <Page1 /> },
      { path: 'blogs', element: <Blogs /> },
      { path: 'services', element: <Services />}, 
    ]
  }
]);

ReactDom.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
