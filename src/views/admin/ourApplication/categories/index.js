import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Select,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";

export default function CategoriesCRUD() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({ title: "Name is required", status: "warning", duration: 2000 });
      return;
    }

    if (editId) {
      setCategories((prev) =>
        prev.map((cat) => (cat.id === editId ? { id: editId, name, status } : cat))
      );
      toast({ title: "Category updated", status: "success", duration: 2000 });
    } else {
      setCategories((prev) => [...prev, { id: Date.now(), name, status }]);
      toast({ title: "Category added", status: "success", duration: 2000 });
    }

    setName("");
    setStatus("Active");
    setEditId(null);
    onClose();
  };

  const handleEdit = (id) => {
    const category = categories.find((cat) => cat.id === id);
    setName(category.name);
    setStatus(category.status);
    setEditId(id);
    onOpen();
  };

  const handleDelete = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    toast({ title: "Category deleted", status: "error", duration: 2000 });
  };

  return (
    <Box p={4} mt="20">
      <Flex justifyContent="space-between" mb={4}>
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          width="40%"
        />
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
          Add Category
        </Button>
      </Flex>

      {filteredCategories.length === 0 ? (
        <Text textAlign="center" fontSize="lg" fontWeight="bold" mt={4}>
          No categories available. Please add a category.
        </Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredCategories.map((cat) => (
              <Tr key={cat.id}>
                <Td>{cat.id}</Td>
                <Td>{cat.name}</Td>
                <Td>{cat.status}</Td>
                <Td>
                  <IconButton icon={<EditIcon />} mr={2} onClick={() => handleEdit(cat.id)} aria-label="Edit" />
                  <IconButton icon={<DeleteIcon />} colorScheme="red" onClick={() => handleDelete(cat.id)} aria-label="Delete" />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* Modal for Add/Edit Category */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
  <ModalContent>
    <ModalHeader>{editId ? "Edit Category" : "Add Category"}</ModalHeader>
    <ModalBody>
      <FormControl mb={3}>
        <FormLabel>Category Name</FormLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Status</FormLabel>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </Select>
      </FormControl>
    </ModalBody>
    <ModalFooter>
      <Button onClick={handleSubmit} colorScheme="blue">
        {editId ? "Update" : "Add"}
      </Button>
      <Button onClick={onClose} ml={3}>
        Cancel
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

    </Box>
  );
}
