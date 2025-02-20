import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
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
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";

const CategorySchema = Yup.object().shape({
  name: Yup.string().required("Category name is required"),
  description: Yup.string().required("Description is required"),
  images: Yup.mixed().required("At least one image is required"),
  specification: Yup.string().required("Specification is required"),
  revenue: Yup.string().required("Revenue is required"),
  location: Yup.string().required("Location is required"),
  status: Yup.string().required("Status is required"),
  faq: Yup.string().required("FAQ is required"),
  terms: Yup.string().required("Terms & Conditions are required"),
});

export default function CategoriesCRUD() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "" || cat.status === statusFilter) &&
      (locationFilter === "" || cat.location.includes(locationFilter))
  );

  return (
    <Box p={4} mt="20">
      <Flex justifyContent="space-between" mb={4} wrap="wrap" gap={2}>
        <Input
          placeholder="Search by name..."
          width="30%"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select placeholder="Filter by Status" width="20%" onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </Select>
        <Input
          placeholder="Filter by Location"
          width="20%"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen} ml="auto">
          Add Category
        </Button>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Images</Th>
            <Th>Specification</Th>
            <Th>Revenue</Th>
            <Th>Location</Th>
            <Th>Status</Th>
            <Th>FAQ</Th>
            <Th>Terms & Conditions</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredCategories.map((cat) => (
            <Tr key={cat.id}>
              <Td>{cat.id}</Td>
              <Td>{cat.name}</Td>
              <Td>{cat.description}</Td>
              <Td>{cat.images.length} Images</Td>
              <Td>{cat.specification}</Td>
              <Td>{cat.revenue}</Td>
              <Td>{cat.location}</Td>
              <Td>{cat.status}</Td>
              <Td>{cat.faq}</Td>
              <Td>{cat.terms}</Td>
              <Td>
                <IconButton icon={<EditIcon />} mr={2} aria-label="Edit" />
                <IconButton icon={<DeleteIcon />} colorScheme="red" aria-label="Delete" />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} size="full" closeOnOverlayClick={false}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>Add Category</ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                name: "",
                description: "",
                images: [],
                specification: "",
                revenue: "",
                location: "",
                status: "Active",
                faq: "",
                terms: "",
              }}
              validationSchema={CategorySchema}
              onSubmit={(values) => {
                toast({ title: "Category saved", status: "success", duration: 2000 });
                onClose();
              }}
            >
              {({ setFieldValue }) => (
                <Form>
                <Flex wrap="wrap" gap={4}>
                  <FormControl>
                    <FormLabel>Category Name</FormLabel>
                    <Field as={Input} name="name" placeholder="Enter category name" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Field as={Input} name="description" placeholder="Enter description" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Images</FormLabel>
                    <Input type="file" multiple onChange={(e) => setFieldValue("images", e.target.files)} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Specification</FormLabel>
                    <Field as={Input} name="specification" placeholder="Enter specification" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Revenue</FormLabel>
                    <Field as={Input} name="revenue" placeholder="Enter revenue details" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Location</FormLabel>
                    <Field as={Input} name="location" placeholder="Enter location" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Field as={Select} name="status">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </Field>
                  </FormControl>
                  <FormControl>
                    <FormLabel>FAQ</FormLabel>
                    <Field as={Input} name="faq" placeholder="Enter FAQ details" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Terms & Conditions</FormLabel>
                    <Field as={Input} name="terms" placeholder="Enter terms & conditions" />
                  </FormControl>
                </Flex>
                <ModalFooter>
                  <Button type="submit" colorScheme="blue">Save</Button>
                  <Button onClick={onClose} ml={3}>Cancel</Button>
                </ModalFooter>
              </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
