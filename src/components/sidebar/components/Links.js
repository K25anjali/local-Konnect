/* eslint-disable */
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Box, Flex, HStack, Text, useColorModeValue, IconButton } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';

export function SidebarLinks({ routes }) {
  let location = useLocation();
  let activeColor = useColorModeValue('gray.700', 'white');
  let inactiveColor = useColorModeValue('secondaryGray.600', 'secondaryGray.600');
  let activeIcon = useColorModeValue('brand.500', 'white');
  let textColor = useColorModeValue('secondaryGray.500', 'white');
  let brandColor = useColorModeValue('brand.500', 'brand.400');

  const activeRoute = (routePath) => location.pathname.includes(routePath);

  // State to track expanded menu items
  const [openMenus, setOpenMenus] = useState({});

  // Toggle function for nested menus
  const toggleMenu = (index) => {
    setOpenMenus((prev) => {
      console.log("Before Toggle:", prev); // Debugging
      const newState = { ...prev, [index]: !prev[index] };
      console.log("After Toggle:", newState); // Debugging
      return newState;
    });
  };

  const createLinks = (routes, parentIndex = '') => {
    return routes.map((route, index) => {
      let currentIndex = `${parentIndex}-${index}`;
      let isActive = activeRoute(route.path);

      if (route.collapse) {
        return (
          <Box key={currentIndex}>
            <Flex
              align="center"
              cursor="pointer"
              onClick={() => toggleMenu(currentIndex)}
              py="5px"
              ps="10px"
              color={isActive ? activeColor : textColor} // ✅ Only text color changes
            >
              {route.icon && (
                <Box me="18px" color={isActive ? activeIcon : textColor}>
                  {route.icon}
                </Box>
              )}
              <Text fontWeight="bold">{route.name}</Text>
              <IconButton
                icon={openMenus[currentIndex] ? <ChevronDownIcon /> : <ChevronRightIcon />}
                size="xs"
                variant="ghost"
                ml="auto"
              />
            </Flex>

            {/* ✅ Submenu Items Render Fix */}
            {openMenus[currentIndex] && route.items && route.items.length > 0 && (
              <Box pl="20px" borderLeft="2px solid gray" mt="2">
                {route.items.map((subRoute, subIndex) => {
                  let isSubActive = activeRoute(subRoute.path);
                  return (
                    <NavLink key={`${currentIndex}-${subIndex}`} to={route.layout + subRoute.path}>
                      <Box py="3px" ps="10px" color={isSubActive ? activeColor : textColor}>
                        <Text>{subRoute.name}</Text>
                      </Box>
                    </NavLink>
                  );
                })}
              </Box>
            )}
          </Box>
        );
      } else {
        return (
          <NavLink key={currentIndex} to={route.layout + route.path}>
            <Box>
              <HStack
                spacing="22px"
                py="5px"
                ps="10px"
                color={isActive ? activeColor : textColor} // ✅ Only text & icon color change
              >
                {route.icon && (
                  <Box me="18px" color={isActive ? activeIcon : textColor}>
                    {route.icon}
                  </Box>
                )}
                <Text fontWeight="normal">{route.name}</Text>
              </HStack>
            </Box>
          </NavLink>
        );
      }
    });
  };

  return <Box>{createLinks(routes)}</Box>;
}

export default SidebarLinks;
