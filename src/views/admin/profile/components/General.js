// Chakra imports
import { SimpleGrid, Text, useColorModeValue, Input, Button } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React, { useEffect, useState } from "react";
import Information from "views/admin/profile/components/Information";

export default function GeneralInformation(props) {
  const { ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  // State Variables
  const [email, setEmail] = useState("Not Provided");
  const [userType, setUserType] = useState("Not Specified");
  const [adminInfo, setAdminInfo] = useState({
    name: "John Doe",
    organization: "Local Konnect",
    location: "Not Specified",
    contact: "Not Provided",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    if (user.email) setEmail(user.email);
    if (user.userType) setUserType(user.userType);

    const storedAdminInfo = JSON.parse(localStorage.getItem("adminInfo")) || {
      name: "John Doe",
      organization: "Local Konnect",
      location: "Not Specified",
      contact: "Not Provided",
    };

    setAdminInfo(storedAdminInfo);
  }, []);

  // Save to localStorage
  const handleSave = () => {
    localStorage.setItem("adminInfo", JSON.stringify(adminInfo));
    setIsEditing(false);
  };

  return (
    <Card mb={{ base: "0px", "2xl": "20px" }} {...rest}>
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="2xl"
        mt="10px"
        mb="4px"
      >
        General Information
      </Text>
      <Text color={textColorSecondary} fontSize="md" me="26px" mb="40px">
        Welcome to Local Konnect! Here’s your profile information.
      </Text>
      <SimpleGrid columns="2" gap="20px">
        {/* Non-editable fields */}
        <Information boxShadow={cardShadow} title="Email" value={email} />
        <Information boxShadow={cardShadow} title="User Type" value={userType} />

        {/* Editable Fields */}
        {isEditing ? (
          <>
            <Input
              placeholder="Name"
              value={adminInfo.name}
              onChange={(e) => setAdminInfo({ ...adminInfo, name: e.target.value })}
            />
            <Input
              placeholder="Organization"
              value={adminInfo.organization}
              onChange={(e) => setAdminInfo({ ...adminInfo, organization: e.target.value })}
            />
            <Input
              placeholder="Location"
              value={adminInfo.location}
              onChange={(e) => setAdminInfo({ ...adminInfo, location: e.target.value })}
            />
            <Input
              placeholder="Contact"
              value={adminInfo.contact}
              onChange={(e) => setAdminInfo({ ...adminInfo, contact: e.target.value })}
            />
            <Button colorScheme="blue" onClick={handleSave}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Information boxShadow={cardShadow} title="Name" value={adminInfo.name} />
            <Information boxShadow={cardShadow} title="Organization" value={adminInfo.organization} />
            <Information boxShadow={cardShadow} title="Location" value={adminInfo.location} />
            <Information boxShadow={cardShadow} title="Contact" value={adminInfo.contact} />
            <Button colorScheme="blue" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </>
        )}
      </SimpleGrid>
    </Card>
  );
}
