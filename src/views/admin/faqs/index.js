// Chakra imports
import {
    Box,
    SimpleGrid,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Text,
  } from "@chakra-ui/react";
  import React from "react";
  
  const FAQs = () => {
    const faqData = [
      {
        question: "What is this platform about?",
        answer: "This platform provides various tools and resources for users to manage their tasks efficiently."
      },
      {
        question: "How can I reset my password?",
        answer: "You can reset your password by clicking on 'Forgot Password' on the login page and following the instructions."
      },
      {
        question: "Is there a mobile version available?",
        answer: "Yes, our platform is fully responsive and can be accessed on mobile devices."
      },
      {
        question: "How do I contact customer support?",
        answer: "You can reach our support team via email at support@example.com or through our live chat feature."
      },
    ];
  
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap='20px'>
          <Accordion allowToggle>
            {faqData.map((faq, index) => (
              <AccordionItem key={index}>
                <h2>
                  <AccordionButton>
                    <Box flex='1' textAlign='left'>
                      {faq.question}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Text>{faq.answer}</Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </SimpleGrid>
      </Box>
    );
  };
  
  export default FAQs;
  