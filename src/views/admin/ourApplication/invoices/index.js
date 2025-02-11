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
  
  // Dummy Invoice Data
  const invoiceData = [
    { id: 1, invoiceNumber: "INV001", customer: "Akash Kumar", date: "2024-02-10", dueDate: "2024-02-20", amount: 5000, status: "Paid" },
    { id: 2, invoiceNumber: "INV002", customer: "Rahul Sharma", date: "2024-02-08", dueDate: "2024-02-18", amount: 7000, status: "Pending" },
    { id: 3, invoiceNumber: "INV003", customer: "Priya Singh", date: "2024-02-05", dueDate: "2024-02-15", amount: 9000, status: "Overdue" },
    { id: 4, invoiceNumber: "INV004", customer: "Suresh Mehta", date: "2024-02-03", dueDate: "2024-02-13", amount: 6500, status: "Paid" },
    { id: 5, invoiceNumber: "INV005", customer: "Anjali Verma", date: "2024-01-28", dueDate: "2024-02-07", amount: 8000, status: "Pending" },
  ];
  
  export default function InvoiceList() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 3;
  
    const filteredInvoices = invoiceData.filter((invoice) =>
      invoice.customer.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter ? invoice.status === statusFilter : true)
    );
  
    const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage);
    const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  
    return (
      <Box p={5}>
        {/* Export CSV Button */}
        <Flex justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap">
  <Box fontSize="xl" fontWeight="bold">Invoice List</Box>
  <CSVLink data={filteredInvoices} filename="invoices.csv">
    <Button colorScheme="blue">Export CSV</Button>
  </CSVLink>
</Flex>

  
        {/* Filters */}
        <Flex gap={4} mb={4}>
          <Input placeholder="Search by Customer Name..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select placeholder="Filter by Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </Select>
        </Flex>
  
        {/* Table */}
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Invoice #</Th>
              <Th>Customer</Th>
              <Th>Date</Th>
              <Th>Due Date</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedInvoices.length > 0 ? (
              paginatedInvoices.map((invoice) => (
                <Tr key={invoice.id}>
                  <Td>{invoice.invoiceNumber}</Td>
                  <Td>{invoice.customer}</Td>
                  <Td>{invoice.date}</Td>
                  <Td>{invoice.dueDate}</Td>
                  <Td>₹{invoice.amount}</Td>
                  <Td color={invoice.status === "Overdue" ? "red.500" : invoice.status === "Pending" ? "orange.500" : "green.500"}>
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
  