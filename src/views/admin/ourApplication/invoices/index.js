import { useEffect, useState } from "react";
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
import { CSVLink } from "react-csv";
import { _fetch } from "../../../../components/utils/apiUtils";
import API_ENDPOINTS from "../../../../components/utils/apiEndPoints";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Fetch invoices once from the backend
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await _fetch(API_ENDPOINTS.INVOICES);
        setInvoices(data);
        setFilteredInvoices(data); // Initially, all invoices are displayed
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

  // Apply frontend filtering
  useEffect(() => {
    let updatedInvoices = invoices;

    // Filter by search input (any text field)
    if (search) {
      updatedInvoices = updatedInvoices.filter((invoice) =>
        Object.values(invoice).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Filter by status
    if (statusFilter) {
      updatedInvoices = updatedInvoices.filter(
        (invoice) => invoice.status === statusFilter
      );
    }

    setFilteredInvoices(updatedInvoices);
    setCurrentPage(1); // Reset pagination on filter change
  }, [search, statusFilter, invoices]);

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredInvoices.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <Box p={5}>
      <Flex justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap">
        <Box fontSize="xl" fontWeight="bold">Invoice List</Box>
        <CSVLink data={filteredInvoices} filename="invoices.csv">
          <Button colorScheme="blue">Export CSV</Button>
        </CSVLink>
      </Flex>

      <Flex gap={4} mb={4}>
        <Input
          placeholder="Search by any field..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select placeholder="Filter by Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </Select>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Invoice No</Th>
            <Th>Customer</Th>
            <Th>Date</Th>
            <Th>Due Date</Th>
            <Th>Amount</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentRows.length > 0 ? (
            currentRows.map((invoice) => (
              <Tr key={invoice.id}>
                <Td>{invoice.invoiceNumber}</Td>
                <Td>{invoice.customer}</Td>
                <Td>{invoice.date}</Td>
                <Td>{invoice.dueDate}</Td>
                <Td>₹{invoice.amount}</Td>
                <Td color={
                  invoice.status === "Overdue" ? "red.500" : 
                  invoice.status === "Pending" ? "orange.500" : "green.500"
                }>
                  {invoice.status}
                </Td>
                <Td>
                  <Button size="sm" colorScheme="blue" mr={2}>View</Button>
                  <Button size="sm" colorScheme="green">Download</Button>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={7} textAlign="center">
                No invoices found
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
            Page {currentPage}
          </Button>
          <Button onClick={() => setCurrentPage((prev) => prev + 1)} disabled={indexOfLastRow >= filteredInvoices.length}>
            Next
          </Button>
        </ButtonGroup>
      </Flex>
    </Box>
  );
}
