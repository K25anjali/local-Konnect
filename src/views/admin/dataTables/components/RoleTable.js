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
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import { _fetch, _update, _delete } from 'components/utils/apiUtils';

const columnHelper = createColumnHelper();

export default function RoleTable() {
  const [roles, setRoles] = useState([]);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editedRole, setEditedRole] = useState({});
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const { isOpen, onClose } = useDisclosure(); // Removed onOpen to fix eslint error

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        await _fetch('/api/roles/'); // Fixed response handling
        if (response && Array.isArray(response.data)) {
          setRoles(response.data);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  // Handle edit button click
  const handleEditClick = (role) => {
    setEditingRoleId(role.id);
    setEditedRole({ ...role });
  };

  // Handle input change
  const handleInputChange = (e) => {
    setEditedRole({ ...editedRole, [e.target.name]: e.target.value });
  };

  // Handle update role
  const handleUpdateRole = async () => {
    try {
      await _update(`/api/roles/${editingRoleId}/`, editedRole);
      setRoles((prevRoles) =>
        prevRoles.map((role) =>
          role.id === editingRoleId ? { ...role, ...editedRole } : role,
        ),
      );
      setEditingRoleId(null);
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role. Please try again.');
    }
  };

  const columns = [
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <Text fontSize="12px" color="gray.400">
          NAME
        </Text>
      ),
      cell: (info) => {
        const role = info.row.original;
        return editingRoleId === role.id ? (
          <Input
            name="name"
            value={editedRole.name || ''}
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
    columnHelper.accessor('permissions', {
      id: 'permissions',
      header: () => (
        <Text fontSize="12px" color="gray.400">
          Permissions
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm">
          {new Date(info.getValue()).toLocaleDateString()}
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
        const role = info.row.original;
        return editingRoleId === role.id ? (
          <>
            <Button colorScheme="green" size="sm" onClick={handleUpdateRole}>
              Save
            </Button>
            <Button
              colorScheme="gray"
              size="sm"
              ml={2}
              onClick={() => setEditingRoleId(null)}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => handleEditClick(role)}
          >
            Edit
          </Button>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}
