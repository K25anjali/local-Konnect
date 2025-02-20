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
    { id: 1, task: "Booking 1", state: "Delhi", city: "New Delhi", locality: "Connaught Place", status: "Active" },
    { id: 2, task: "Booking 2", state: "Maharashtra", city: "Mumbai", locality: "Bandra", status: "Completed" },
    { id: 3, task: "Booking 3", state: "Karnataka", city: "Bangalore", locality: "Indiranagar", status: "Pending" },
    { id: 4, task: "Booking 4", state: "West Bengal", city: "Kolkata", locality: "Salt Lake", status: "Scheduled" },
    { id: 5, task: "Booking 5", state: "Tamil Nadu", city: "Chennai", locality: "T Nagar", status: "Active" },
];

export default function BookingReports() {
    const [search, setSearch] = useState("");
    const [stateFilter, setStateFilter] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [localityFilter, setLocalityFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const filteredData = dummyData.filter((item) =>
        item.task.toLowerCase().includes(search.toLowerCase()) &&
        (stateFilter ? item.state === stateFilter : true) &&
        (cityFilter ? item.city === cityFilter : true) &&
        (localityFilter ? item.locality === localityFilter : true) &&
        (statusFilter ? item.status === statusFilter : true)
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <Flex justify="space-between" mb={4}>
                <CSVLink data={filteredData} filename="bookings.csv">
                    <Button colorScheme="blue">Export CSV</Button>
                </CSVLink>
            </Flex>

            <Flex gap={4} mb={4}>
                <Input placeholder="Search bookings..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
                <Select placeholder="Filter by Status" onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="Active">Active Bookings</option>
                    <option value="Completed">Completed Bookings</option>
                    <option value="Pending">Pending Bookings</option>
                    <option value="Scheduled">Scheduled Bookings</option>
                    <option value="Scheduled">Cancelled Bookings</option>
                </Select>
            </Flex>

            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Booking</Th>
                        <Th>State</Th>
                        <Th>City</Th>
                        <Th>Locality</Th>
                        <Th>Status</Th>
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
                                <Td>{item.status}</Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan={6} textAlign="center">
                                No data available
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>

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
