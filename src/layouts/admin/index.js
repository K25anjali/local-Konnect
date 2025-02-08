// Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import React, { useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import routes from 'routes.js';

export default function Dashboard(props) {
  const { ...rest } = props;
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const location = useLocation();
  const { onOpen } = useDisclosure();

  const getActiveRoute = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].items);
        if (collapseActiveRoute) return collapseActiveRoute;
      } else if (routes[i].category) {
        let categoryActiveRoute = getActiveRoute(routes[i].items);
        if (categoryActiveRoute) return categoryActiveRoute;
      } else {
        if (location.pathname === routes[i].layout + routes[i].path) {
          return routes[i].name;
        }
      }
    }
    return 'Default Brand Text';
  };

  const getActiveNavbarText = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveNavbar = getActiveNavbarText(routes[i].items);
        if (collapseActiveNavbar) return collapseActiveNavbar;
      } else if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbarText(routes[i].items);
        if (categoryActiveNavbar) return categoryActiveNavbar;
      } else {
        if (location.pathname === routes[i].layout + routes[i].path) {
          return routes[i].messageNavbar || '';
        }
      }
    }
    return '';
  };

  const getRoutes = (routes) => {
    return routes.map((route, key) => {
      if (route.layout === '/admin') {
        return <Route path={route.path} element={route.component} key={key} />;
      }
      if (route.collapse) {
        return getRoutes(route.items);
      }
      return null;
    });
  };

  return (
    <Box>
      <SidebarContext.Provider value={{ toggleSidebar, setToggleSidebar }}>
        <Sidebar routes={routes} display="none" {...rest} />
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
          maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
        >
          <Portal>
            <Navbar
              onOpen={onOpen}
              logoText={'Horizon UI Dashboard PRO'}
              brandText={getActiveRoute(routes)}
              message={getActiveNavbarText(routes)}
              fixed={fixed}
              {...rest}
            />
          </Portal>

          <Box mx="auto" p={{ base: '20px', md: '30px' }} pe="20px" minH="100vh" pt="50px">
            <Routes>
              {getRoutes(routes)}
              <Route path="/" element={<Navigate to="/admin/default" replace />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
