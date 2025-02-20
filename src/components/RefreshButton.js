import { IconButton } from "@chakra-ui/react";
import { MdRefresh } from "react-icons/md";
import { useLocation } from "react-router-dom";

const RefreshButton = () => {
  const location = useLocation();

  const handleRefresh = () => {
    window.location.href = location.pathname; // Page refresh karega bina full reload ke
  };

  return (
    <IconButton
      icon={<MdRefresh size={20} />}
      onClick={handleRefresh}
      colorScheme="blue"
      variant="ghost"
      aria-label="Refresh Page"
      size="sm"
      ml="4" // Heading se gap ke liye
    />
  );
};

export default RefreshButton;
