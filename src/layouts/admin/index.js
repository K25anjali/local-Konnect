import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import routes from 'routes.js';

export default function Dashboard(props) {
  const { ...rest } = props;
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const { onOpen } = useDisclosure();

  const getRoutes = (routes) => {
    return routes.flatMap((route, key) => {
      let routeElements = [];

      if (route.component) {
        routeElements.push(<Route path={route.path} element={route.component} key={key} />);
      }

      if (route.collapse && route.items) {
        routeElements.push(
          ...route.items.map((item, index) => (
            item.component ? <Route path={item.path} element={item.component} key={`${key}-${index}`} /> : null
          ))
        );
      }

      return routeElements;
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
            <Navbar onOpen={onOpen} fixed={fixed} {...rest} />
          </Portal>

          <Box mx="auto" p={{ base: '20px', md: '30px' }} pe="20px" minH="100vh" pt="50px">
            <Routes>
              {getRoutes(routes)}
            </Routes>
          </Box>
          <Footer />
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
