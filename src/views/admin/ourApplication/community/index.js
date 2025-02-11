import {
    Box,
    Button,
    Flex,
    Heading,
    IconButton,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useColorModeValue,
  } from "@chakra-ui/react";
  import { FaTrash, FaEdit, FaUserShield } from "react-icons/fa";
  import { useState } from "react";
  
  const CommunityDashboard = () => {
    const [users, setUsers] = useState([
      { id: 1, name: "Akash Kumar", role: "User", posts: 12 },
      { id: 2, name: "Ravi Sharma", role: "Moderator", posts: 8 },
      { id: 3, name: "Neha Singh", role: "Admin", posts: 15 },
    ]);
  
    const handleDelete = (id) => {
      setUsers(users.filter((user) => user.id !== id));
    };
  
    return (
      <Box p={5} bg={useColorModeValue("gray.50", "gray.800")}>
        <Heading size="lg" mb={4}>Community Dashboard</Heading>
        <Table variant="simple" bg="white" boxShadow="md" borderRadius="md">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Role</Th>
              <Th>Posts</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.name}</Td>
                  <Td>{user.role}</Td>
                  <Td>{user.posts}</Td>
                  <Td>
                    <Flex gap={2}>
                      <IconButton
                        icon={<FaEdit />}
                        colorScheme="blue"
                        size="sm"
                        aria-label="Edit User"
                      />
                      <IconButton
                        icon={<FaUserShield />}
                        colorScheme="green"
                        size="sm"
                        aria-label="Promote User"
                      />
                      <IconButton
                        icon={<FaTrash />}
                        colorScheme="red"
                        size="sm"
                        aria-label="Delete User"
                        onClick={() => handleDelete(user.id)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5} textAlign="center">No Users Found</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    );
  };
  
  export default CommunityDashboard;
  