'use client';
/* eslint-disable */

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
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'; // Import Delete icon
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import { _fetch, _update, _delete } from 'components/utils/apiUtils';
import CreateRoleForm from './components/CreateRoleForm';

const columnHelper = createColumnHelper();

export default function Settings() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [roles, setRoles] = useState([]);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editedRole, setEditedRole] = useState({});
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await _fetch('/api/roles/');
        setRoles(response.roles);
      } catch (error) {}
    };

    fetchRoles();
  }, []);

  // Handle delete role
  const handleDeleteRole = async (roleId) => {
    try {
      await _delete('/api/roles/:id', roleId);
      setRoles((prevRoles) => prevRoles.filter((role) => role._id !== roleId));
    } catch (error) {
      console.error('Error deleting role:', error);
      alert('Failed to delete role. Please try again.');
    }
  };

  const handleEditClick = (role) => {
    setEditedRole(role); // Set the role for editing
    setEditingRoleId(role._id); // Track which role is being edited
    onOpen(); // Open the modal
  };

  const columns = [
    columnHelper.accessor('title', {
      id: 'title',
      header: () => (
        <Text fontSize="12px" color="gray.400">
          TITLE
        </Text>
      ),
      cell: (info) => {
        const role = info.row.original;
        return editingRoleId === role.id ? (
          <Input
            name="title"
            value={editedRole.title || ''}
            onChange={handleInputChange}
          />
        ) : (
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        );
      },
    }),
    columnHelper.accessor('description', {
      id: 'description',
      header: () => (
        <Text fontSize="12px" color="gray.400">
          DESCRIPTION
        </Text>
      ),
      cell: (info) => {
        const role = info.row.original;
        return editingRoleId === role.id ? (
          <Input
            name="description"
            value={editedRole.description || ''}
            onChange={handleInputChange}
          />
        ) : (
          <Text color={textColor} fontSize="sm">
            {info.getValue()}
          </Text>
        );
      },
    }),
    columnHelper.accessor('userPermissions', {
      id: 'permissions',
      header: () => (
        <Text fontSize="12px" color="gray.400">
          Permissions
        </Text>
      ),
      cell: (info) => {
        const permissions = info.getValue();
        return (
          <Flex wrap="wrap">
            {permissions.map((permission, index) => (
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
        );
      },
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

  // Handle input change during editing
  const handleInputChange = (e) => {
    setEditedRole({ ...editedRole, [e.target.name]: e.target.value });
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Input placeholder="Search..." width="300px" />
        <Button colorScheme="blue" onClick={onOpen}>
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
            {/* TABLE HEADER */}
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
            {/* TABLE BODY */}
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

      <CreateRoleForm
        isOpen={isOpen}
        onClose={onClose}
        editedRole={editedRole}
        setEditedRole={setEditedRole}
        setRoles={roles}
      />
    </Box>
  );
}
