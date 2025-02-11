// Chakra imports
import {
    Box,
    Button,
    Flex,
    Input,
    Select,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    ButtonGroup,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { CSVLink } from "react-csv";
  
  // Dummy Data
  const dummyData = [
    { id: 1, task: "Task 1", state: "Delhi", city: "New Delhi", locality: "Connaught Place" },
    { id: 2, task: "Task 2", state: "Maharashtra", city: "Mumbai", locality: "Bandra" },
    { id: 3, task: "Task 3", state: "Karnataka", city: "Bangalore", locality: "Indiranagar" },
    { id: 4, task: "Task 4", state: "West Bengal", city: "Kolkata", locality: "Salt Lake" },
    { id: 5, task: "Task 5", state: "Tamil Nadu", city: "Chennai", locality: "T Nagar" },
    { id: 6, task: "Task 6", state: "UP", city: "Lucknow", locality: "Hazratganj" },
    { id: 7, task: "Task 7", state: "Gujarat", city: "Ahmedabad", locality: "Navrangpura" },
    { id: 8, task: "Task 8", state: "Punjab", city: "Chandigarh", locality: "Sector 17" },
    { id: 9, task: "Task 9", state: "Rajasthan", city: "Jaipur", locality: "Malviya Nagar" },
    { id: 10, task: "Task 10", state: "Bihar", city: "Patna", locality: "Kankarbagh" },
  ];
  
  export default function UserReports() {
    const [search, setSearch] = useState("");
    const [stateFilter, setStateFilter] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [localityFilter, setLocalityFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
  
    const filteredData = dummyData.filter((item) =>
      item.task.toLowerCase().includes(search.toLowerCase()) &&
      (stateFilter ? item.state === stateFilter : true) &&
      (cityFilter ? item.city === cityFilter : true) &&
      (localityFilter ? item.locality === localityFilter : true)
    );
  
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        {/* Export CSV Button */}
        <Flex justify="space-between" mb={4}>
          <CSVLink data={filteredData} filename="tasks.csv">
            <Button colorScheme="blue">Export CSV</Button>
          </CSVLink>
        </Flex>
  
        {/* Filters */}
        <Flex gap={4} mb={4}>
          <Input placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select placeholder="Filter by State" onChange={(e) => setStateFilter(e.target.value)}>
            <option value="Delhi">Delhi</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="West Bengal">West Bengal</option>
          </Select>
          <Select placeholder="Filter by City" onChange={(e) => setCityFilter(e.target.value)}>
            <option value="New Delhi">New Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Kolkata">Kolkata</option>
          </Select>
          <Select placeholder="Filter by Locality" onChange={(e) => setLocalityFilter(e.target.value)}>
            <option value="Connaught Place">Connaught Place</option>
            <option value="Bandra">Bandra</option>
            <option value="Indiranagar">Indiranagar</option>
            <option value="Salt Lake">Salt Lake</option>
          </Select>
        </Flex>
  
        {/* Table */}
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Task</Th>
              <Th>State</Th>
              <Th>City</Th>
              <Th>Locality</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.id}</Td>
                  <Td>{item.task}</Td>
                  <Td>{item.state}</Td>
                  <Td>{item.city}</Td>
                  <Td>{item.locality}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5} textAlign="center">
                  No data available
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
  
        {/* Pagination */}
        <Flex mt={4} justifyContent="center" alignItems="center">
          <ButtonGroup>
            <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button>
              Page {currentPage} of {totalPages}
            </Button>
            <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
              Next
            </Button>
          </ButtonGroup>
        </Flex>
      </Box>
    );
  }
  