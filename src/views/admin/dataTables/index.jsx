'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Input,
  Button,
  Tag,
  TagLabel,
  useColorModeValue,
  useDisclosure,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Checkbox,
  VStack, // <-- Added this import
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import { _fetch, _create, _update, _delete } from 'components/utils/apiUtils';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

const columnHelper = createColumnHelper();

const validationSchema = Yup.object({
  title: Yup.string().required('Role name is required'),
  description: Yup.string().required('Description is required'),
});

export default function Settings() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [roles, setRoles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const toast = useToast();

  const permissions = [
    'create',
    'read',
    'update',
    'delete',
    'block',
    'unblock',
  ];

  // Initial values for creating a new role
  const initialValues = {
    title: '',
    description: '',
    userPermissions: [],
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await _fetch('/api/roles/');
        setRoles(response.roles);
      } catch (error) {
        toast({
          title: 'Failed to fetch roles',
          description:
            'There was an error fetching the roles. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchRoles();
  }, []);

  const handleDeleteRole = async (roleId) => {
    try {
      await _delete('/api/roles/:id', roleId);
      setRoles((prevRoles) => prevRoles.filter((role) => role._id !== roleId));
      toast({
        title: 'Role deleted',
        description: 'The role has been successfully deleted.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to delete role',
        description: 'There was an error deleting the role. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (isPreview) return;

    try {
      if (isEditing) {
        await _update(`/api/roles/${selectedRole._id}`, values);
        setRoles((prevRoles) =>
          prevRoles.map((role) =>
            role._id === selectedRole._id ? { ...role, ...values } : role,
          ),
        );
        toast({
          title: 'Role updated.',
          description: 'The role has been successfully updated.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        const newRole = await _create('/api/roles', values);
        setRoles((prevRoles) => [...prevRoles, newRole.role]);
        toast({
          title: 'Role created.',
          description: 'A new role has been successfully created.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      resetForm();
      onClose();
    } catch (error) {
      toast({
        title: 'Operation failed.',
        description: 'Something went wrong. Try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditClick = (role) => {
    setSelectedRole(role);
    onOpen();
    setIsEditing(true);
    setIsPreview(false);
  };

  const handlePreview = (role) => {
    setSelectedRole(role);
    onOpen();
    setIsEditing(false);
    setIsPreview(true);
  };

  const columns = [
    columnHelper.accessor('title', {
      id: 'title',
      header: () => (
        <Text fontSize="12px" color="gray.400">
          TITLE
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('description', {
      id: 'description',
      header: () => (
        <Text fontSize="12px" color="gray.400">
          DESCRIPTION
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('userPermissions', {
      id: 'permissions',
      header: () => (
        <Text fontSize="12px" color="gray.400">
          Permissions
        </Text>
      ),
      cell: (info) => (
        <Flex wrap="wrap">
          {info.getValue().map((permission, index) => (
            <Tag
              key={index}
              border="1px"
              borderColor="gray.300"
              mr="2"
              size="sm"
              mb="2"
            >
              <TagLabel>{permission}</TagLabel>
            </Tag>
          ))}
        </Flex>
      ),
    }),
    {
      id: 'actions',
      header: () => (
        <Text fontSize="12px" color="gray.400">
          ACTIONS
        </Text>
      ),
      cell: (info) => {
        const role = info.row.original;
        return (
          <Flex>
            <IconButton
              colorScheme="blue"
              icon={<EditIcon />}
              aria-label="Edit"
              size="sm"
              onClick={() => handleEditClick(role)}
            />
            <IconButton
              colorScheme="red"
              icon={<DeleteIcon />}
              aria-label="Delete"
              size="sm"
              ml={2}
              onClick={() => handleDeleteRole(role._id)}
            />
            <IconButton
              colorScheme="green"
              icon={<ViewIcon />}
              aria-label="Preview"
              size="sm"
              ml={2}
              onClick={() => handlePreview(role)}
            />
          </Flex>
        );
      },
    },
  ];

  const table = useReactTable({
    data: roles,
    columns,
    state: {},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Input placeholder="Search..." width="300px" />
        <Button
          colorScheme="blue"
          onClick={() => {
            setSelectedRole(null);
            setIsEditing(false);
            setIsPreview(false);
            onOpen();
          }}
        >
          Add Role
        </Button>
      </Box>
      <Card flexDirection="column" w="100%" px="0px" overflowX="auto">
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Text color={textColor} fontSize="22px" fontWeight="700">
            Role Management
          </Text>
          <Menu />
        </Flex>
        <Box>
          <Table variant="simple" color="gray.500" mb="24px" mt="12px">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th key={header.id} borderColor={borderColor}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id} borderColor="transparent">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isPreview
              ? 'Preview Role'
              : isEditing
              ? 'Edit Role'
              : 'Create New Role'}
          </ModalHeader>
          <Formik
            initialValues={{
              title: selectedRole?.title || '',
              description: selectedRole?.description || '',
              userPermissions: selectedRole?.userPermissions || [],
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true} // <-- This makes sure that Formik will reinitialize when `initialValues` change
          >
            {({ values, setFieldValue, resetForm }) => (
              <Form>
                <ModalBody>
                  <FormControl mb={4}>
                    <FormLabel>Role Name</FormLabel>
                    <Field as={Input} name="title" isReadOnly={isPreview} />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Description</FormLabel>
                    <Field
                      as={Input}
                      name="description"
                      isReadOnly={isPreview}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Permissions</FormLabel>
                    <VStack align="start">
                      {permissions.map((perm) => (
                        <Checkbox
                          key={perm}
                          value={perm}
                          isChecked={values.userPermissions.includes(perm)}
                          onChange={() => {
                            if (isPreview) return;
                            const newPermissions =
                              values.userPermissions.includes(perm)
                                ? values.userPermissions.filter(
                                    (p) => p !== perm,
                                  )
                                : [...values.userPermissions, perm];
                            setFieldValue('userPermissions', newPermissions);
                          }}
                          isDisabled={isPreview} 
                        >
                          {perm}
                        </Checkbox>
                      ))}
                    </VStack>
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  {isPreview ? (
                    <Button
                      onClick={() => {
                        resetForm();
                        onClose();
                      }}
                    >
                      Close
                    </Button>
                  ) : (
                    <>
                      <Button colorScheme="blue" type="submit">
                        {isEditing ? 'Update Role' : 'Create Role'}
                      </Button>
                      <Button
                        onClick={() => {
                          resetForm();
                          onClose();
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </Box>
  );
}
