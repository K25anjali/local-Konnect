import React from 'react';

// Chakra imports
import { Flex, useColorModeValue, Image, Text, Box } from '@chakra-ui/react';

// Custom components
import { HSeparator } from 'components/separator/Separator';

// Import the logo image
import Logo from '../../../assets/img/layout/Logo.png';

export function SidebarBrand() {
  // Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');

  return (
    <Box>
      {/* Logo and Text Centered */}
      <Flex align="center" direction="row" my="32px">
        <Image src={Logo} alt="Local Konnect Logo" h="40px" w="40px" mb="8px" />
        <Text
          fontSize="xl"
          fontWeight="bold"
          color={logoColor}
          lineHeight="1"
          marginLeft="12px"
        >
          Local <br />{' '}
          <Text fontSize="2xl" fontWeight="bold" color={logoColor}>
            Konnect
          </Text>
        </Text>
      </Flex>

      {/* Line Separator Below, outside of the Flex */}
      <HSeparator mt="20px" />
    </Box>
  );
}

export default SidebarBrand;
