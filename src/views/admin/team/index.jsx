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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Select,
  useColorModeValue,
  useDisclosure,
  IconButton,
  useToast,
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
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { _create, _fetch, _update, _delete } from 'components/utils/apiUtils';

const columnHelper = createColumnHelper();

const validationSchema = Yup.object({
  fullName: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  role: Yup.string().required('User type is required'),
});

export default function TeamManagement() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [roles, setRoles] = useState([]);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const toast = useToast();

  // Initial values for creating a new role
  const initialValues = {
    fullName: '',
    email: '',
    phone: '',
    role: '',
  };

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await _fetch('/api/admin-team/');
        setTeamMembers(response.users);
      } catch (error) {
        toast({
          title: 'Failed to fetch teamMembers',
          description:
            'There was an error fetching the teamMembers. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchTeamMembers();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await _fetch('/api/roles/');
        setRoles(response.roles || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    if (isPreview) return;

    try {
      if (isEditing) {
        await _update(`/api/admin-team/${selectedTeamMember._id}`, values);
        setRoles((prevRoles) =>
          prevRoles.map((role) =>
            role._id === selectedTeamMember._id ? { ...role, ...values } : role,
          ),
        );
        toast({
          title: 'Role updated.',
          description: 'The team member has been successfully updated.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        const newRole = await _create('/api/admin-team/', values);
        setRoles((prevRoles) => [...prevRoles, newRole.role]);
        toast({
          title: 'Team member created.',
          description: 'A new team member has been successfully created.',
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

  const handleDeleteTeamMember = async (teamMemberId) => {
    try {
      await _delete('/api/admin-team/:id', teamMemberId);
      setTeamMembers((prevTeamMembers) =>
        prevTeamMembers.filter((teamMember) => teamMember._id !== teamMemberId),
      );
      toast({
        title: 'Team member deleted',
        description: 'Team member has been successfully deleted.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to delete team member',
        description: 'There was an error deleting the role. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditTeamMember = (teamMember) => {
    onOpen();
    setSelectedTeamMember(teamMember);
    setIsEditing(true);
    setIsPreview(false);
  };

  const handlePreviewTeamMember = (teamMember) => {
    onOpen();
    setSelectedTeamMember(teamMember);
    setIsEditing(false);
    setIsPreview(true);
  };

  const columns = [
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <Text fontSize="12px" color="gray.400">
          Name
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('email', {
      id: 'email',
      header: () => (
        <Text fontSize="12px" color="gray.400">
          Email
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('phoneMember', {
      id: 'phoneMember',
      header: () => (
        <Text fontSize="12px" color="gray.400">
          Phone Member
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('userType', {
      id: 'userType',
      header: () => (
        <Text fontSize="12px" color="gray.400">
          User Type
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm">
          {info.getValue()}
        </Text>
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
        const teamMember = info.row.original;
        return (
          <Flex>
            <IconButton
              colorScheme="blue"
              icon={<EditIcon />}
              aria-label="Edit"
              size="sm"
              onClick={() => handleEditTeamMember(teamMember)}
            />
            <IconButton
              colorScheme="red"
              icon={<DeleteIcon />}
              aria-label="Delete"
              size="sm"
              ml={2}
              onClick={() => handleDeleteTeamMember(teamMember._id)}
            />
            <IconButton
              colorScheme="green"
              icon={<ViewIcon />}
              aria-label="Preview"
              size="sm"
              ml={2}
              onClick={() => handlePreviewTeamMember(teamMember)}
            />
          </Flex>
        );
      },
    },
  ];

  const table = useReactTable({
    data: teamMembers,
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
            setIsEditing(false);
            setIsPreview(false);
            onOpen();
          }}
        >
          Add Team
        </Button>
      </Box>
      <Card flexDirection="column" w="100%" px="0px" overflowX="auto">
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Text color={textColor} fontSize="22px" fontWeight="700">
            Team Management
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
              ? 'Preview Team Member'
              : isEditing
              ? 'Edit Team Member'
              : 'Create New Team'}
          </ModalHeader>
          <Formik
            initialValues={{
              fullName: selectedTeamMember?.fullName || '',
              email: selectedTeamMember?.email || '',
              phone: selectedTeamMember?.phone || '',
              role: selectedTeamMember?.role || '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ resetForm }) => (
              <Form>
                <ModalBody>
                  <FormControl mb={4}>
                    <FormLabel>Full Name</FormLabel>
                    <Field as={Input} name="fullName" isReadOnly={isPreview} />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Email</FormLabel>
                    <Field as={Input} name="email" isReadOnly={isPreview} />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Phone Number</FormLabel>
                    <Field as={Input} name="phone" isReadOnly={isPreview} />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Role</FormLabel>
                    <Field as={Select} name="role" isReadOnly={isPreview}>
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role._id} value={role.name}>
                          {role.title}
                        </option>
                      ))}
                    </Field>
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
                        {isEditing ? 'Update Team' : 'Create Team'}
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
