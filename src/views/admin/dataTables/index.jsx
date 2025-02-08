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
  useToast, // <-- Added this import
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
import { _fetch, _update, _delete } from 'components/utils/apiUtils';
import CreateRoleForm from './components/CreateRoleForm';

const columnHelper = createColumnHelper();

export default function Settings() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [roles, setRoles] = useState([]);
  const [editedRole, setEditedRole] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const toast = useToast(); // <-- Added toast hook

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

  const handleEditClick = (role) => {
    onOpen();
    setEditedRole(role);
    setIsEditing(true);
    setIsPreview(false);
  };

  const handlePreview = (role) => {
    onOpen();
    setEditedRole(role);
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
            setIsEditing(false);
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
      <CreateRoleForm
        isOpen={isOpen}
        onClose={onClose}
        setRoles={setRoles}
        isEditing={isEditing}
        editedRole={editedRole}
        isPreview={isPreview}
      />
    </Box>
  );
}
