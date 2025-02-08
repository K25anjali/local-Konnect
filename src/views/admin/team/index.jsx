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
import CreateTeamForm from './CreateTeamForm';

const columnHelper = createColumnHelper();

export default function TeamManagement() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [teamMembers, setTeamMembers] = useState([]);
  const [editedTeamMember, setEditedTeamMember] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const toast = useToast();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await _fetch('/api/roles/users');
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

  const handleDeleteTeamMember = async (teamMemberId) => {
    try {
      await _delete('/api/teamMembers/:id', teamMemberId);
      setTeamMembers((prevTeamMembers) =>
        prevTeamMembers.filter((teamMember) => teamMember._id !== teamMemberId),
      );
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

  const handleEditTeamMember = (teamMember) => {
    onOpen();
    setEditedTeamMember(teamMember);
    setIsEditing(true);
    setIsPreviewing(false);
  };

  const handlePreviewTeamMember = (teamMember) => {
    onOpen();
    setEditedTeamMember(teamMember);
    setIsEditing(false);
    setIsPreviewing(true);
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
      <CreateTeamForm
        isOpen={isOpen}
        onClose={onClose}
        setTeamMembers={setTeamMembers}
        isEditing={isEditing}
        editedTeamMember={editedTeamMember}
        isPreviewing={isPreviewing}
      />
    </Box>
  );
}
