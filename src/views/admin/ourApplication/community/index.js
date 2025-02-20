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
  Input,
  Select,
} from "@chakra-ui/react";
import { FaBan, FaCheck, FaFilter } from "react-icons/fa";
import { useState } from "react";

const CommunityDashboard = () => {
  const [users, setUsers] = useState([
    { id: 6587787, name: "Akash Kumar", mobile: "9876543210", type: "Service Provider", location: "Delhi", posts: 12, views: 500, reactions: { like: 50, dislike: 5 }, content: "Article", contentType: "Blog", isVerified: true },
    { id: 65677867, name: "Ravi Sharma", mobile: "7896541230", type: "Service Provider", location: "Mumbai", posts: 8, views: 350, reactions: { like: 30, dislike: 2 }, content: "Video", contentType: "Tutorial", isVerified: false },
    { id: 658678867, name: "Neha Singh", mobile: "8956231470", type: "Service Provider", location: "Bangalore", posts: 15, views: 800, reactions: { like: 100, dislike: 10 }, content: "Podcast", contentType: "Interview", isVerified: true },
  ]);

  const toggleBlock = (id) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, isBlocked: !user.isBlocked } : user)));
  };

  return (
    <Box p={5}  mt={50}bg={useColorModeValue("gray.50", "gray.800")}>
      <Heading size="lg" mb={4}>Community</Heading>

      {/* Filters */}
      <Flex gap={2} mb={4}>
        <Input placeholder="Search by Keywords" />
        <Select placeholder="Filter by Location">
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Bangalore">Bangalore</option>
        </Select>
        <Select placeholder="Filter by Verification">
          <option value="true">Verified</option>
          <option value="false">Not Verified</option>
        </Select>
        <IconButton icon={<FaFilter />} colorScheme="blue" aria-label="Apply Filters" />
      </Flex>

      <Table variant="simple" bg="white" boxShadow="md" borderRadius="md">
        <Thead>
          <Tr>
            <Th>UserID</Th>
            <Th>User Name</Th>
            <Th>Mobile Number</Th>
            <Th>User Type</Th>
            <Th>Location</Th>
            <Th>Total Posts</Th>
            <Th>Total Views</Th>
            <Th>Reactions (Like/Dislike)</Th>
            <Th>Content</Th>
            <Th>Content Type</Th>
            <Th>Verified</Th>
            <Th>Actions (Block/Unblock User)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.id}</Td>
                <Td>{user.name}</Td>
                <Td>{user.mobile}</Td>
                <Td>{user.type}</Td>
                <Td>{user.location}</Td>
                <Td>{user.posts}</Td>
                <Td>{user.views}</Td>
                <Td>{user.reactions.like} / {user.reactions.dislike}</Td>
                <Td>{user.content}</Td>
                <Td>{user.contentType}</Td>
                <Td>{user.isVerified ? "Yes" : "No"}</Td>
                <Td>
                  <IconButton
                    icon={user.isBlocked ? <FaCheck /> : <FaBan />}
                    colorScheme={user.isBlocked ? "green" : "red"}
                    size="sm"
                    aria-label={user.isBlocked ? "Unblock User" : "Block User"}
                    onClick={() => toggleBlock(user.id)}
                  />
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={12} textAlign="center">No Users Found</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default CommunityDashboard;
