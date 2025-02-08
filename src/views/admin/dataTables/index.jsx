import { Box, Button, Input, useDisclosure } from '@chakra-ui/react';
import CreateRoleForm from './components/CreateRoleForm';
import RoleTable from './components/RoleTable';
import React from 'react';

export default function Settings() {
  const { isOpen, onOpen, onClose } = useDisclosure(); // ✅ Fix: use useDisclosure

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Input placeholder="Search..." width="300px" />
        <Button colorScheme="blue" onClick={onOpen}>
          Add Role
        </Button>
      </Box>

      {/* Data Table */}
      <RoleTable />

      {/* Modal Form (Pass onOpen, onClose, and isOpen) */}
      <CreateRoleForm isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
