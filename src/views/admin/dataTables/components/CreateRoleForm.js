import {
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Checkbox,
  VStack,
  Text,
} from '@chakra-ui/react';

import React, { useState } from 'react';
import { _create } from 'components/utils/apiUtils';

export default function CreateRoleForm({ isOpen, onClose }) {
  // ✅ Fix: Accept props from parent
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const permissions = [
    'create',
    'read',
    'update',
    'delete',
    'block',
    'unblock',
  ];

  // Handle permission checkbox change
  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setSelectedPermissions((prev) =>
      checked ? [...prev, name] : prev.filter((perm) => perm !== name),
    );
  };

  // Handle form submission
  const handleCreateRole = async () => {
    const roleData = {
      name: roleName,
      description,
      permissions: selectedPermissions,
    };

    try {
      const response = await _create('/api/roles', roleData);
      console.log(response);
      alert('Role created successfully!');
      onClose(); // ✅ Fix: Close modal after success
    } catch (error) {
      console.error('Error creating role:', error);
      alert('Failed to create role.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {' '}
      {/* ✅ Fix: Use isOpen */}
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Role</ModalHeader>
        <Text fontSize="sm" color="gray.500" mb={2} px={6}>
          Define a new role and its permissions
        </Text>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Role Name</FormLabel>
            <Input
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Description</FormLabel>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>User Management</FormLabel>
            <VStack align="start">
              {permissions.map((permission) => (
                <Checkbox
                  key={permission}
                  name={permission}
                  isChecked={selectedPermissions.includes(permission)}
                  onChange={handlePermissionChange}
                >
                  {permission}
                </Checkbox>
              ))}
            </VStack>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleCreateRole}>
            Create Role
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
