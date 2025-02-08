import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/layout/Logo.png";

function SignIn() {
  const navigate = useNavigate();
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClick = () => setShow(!show);

  // 🛑 Form Validation Schema (Yup)
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  // 🚀 Formik Initialization
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await axios.post(
          "https://localkonnectbackend.onrender.com/api/users/auth/login",
          {
            email: values.email,
            password: values.password,
          }
        );

        // ✅ If login is successful, store token & redirect
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate("/admin/default"); // Redirect to Dashboard
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mx={{ base: "auto", lg: "0px" }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Sign In
          </Heading>
          <Text mb="36px" ms="4px" color={textColorSecondary} fontSize="md">
            Enter your email and password to sign in!
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: "100%", md: "420px" }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: "auto", lg: "unset" }}
          me="auto"
          mb={{ base: "20px", md: "auto" }}
          as="form"
          onSubmit={formik.handleSubmit}
        >
          <Flex align="center" mb="25px">
            <HSeparator />
            <HSeparator />
          </Flex>

          {/* 📨 Email Field */}
          <FormControl isInvalid={formik.errors.email && formik.touched.email}>
            <FormLabel fontSize="sm" fontWeight="500" color={textColor} mb="8px">
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              name="email"
              variant="auth"
              fontSize="sm"
              type="email"
              placeholder="mail@domain.com"
              mb="24px"
              fontWeight="500"
              size="lg"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.email && formik.touched.email && (
              <Text color="red.500" fontSize="sm" mt="-20px" mb="20px">
                {formik.errors.email}
              </Text>
            )}
          </FormControl>

          {/* 🔑 Password Field */}
          <FormControl isInvalid={formik.errors.password && formik.touched.password}>
            <FormLabel fontSize="sm" fontWeight="500" color={textColor} mb="8px">
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size="md">
              <Input
                name="password"
                fontSize="sm"
                placeholder="Min. 8 characters"
                mb="24px"
                size="lg"
                type={show ? "text" : "password"}
                variant="auth"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputRightElement display="flex" alignItems="center" mt="4px">
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer" }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
            {formik.errors.password && formik.touched.password && (
              <Text color="red.500" fontSize="sm" mt="-20px" mb="20px">
                {formik.errors.password}
              </Text>
            )}
          </FormControl>

          {/* 🛑 Show API Error */}
          {errorMessage && (
            <Text color="red.500" fontSize="sm" mb="20px">
              {errorMessage}
            </Text>
          )}

          {/* 🔘 Sign In Button */}
          <Button
            fontSize="sm"
            variant="brand"
            fontWeight="500"
            w="100%"
            h="50"
            mb="24px"
            type="submit"
            isLoading={loading}
          >
            Sign In
          </Button>

          {/* 🔗 Forgot Password */}
          <Flex justifyContent="space-between" align="center" mb="24px">
            <FormControl display="flex" alignItems="center">
              <Checkbox id="remember-login" colorScheme="brandScheme" me="10px" />
              <FormLabel htmlFor="remember-login" mb="0" fontWeight="normal" color={textColor} fontSize="sm">
                Keep me logged in
              </FormLabel>
            </FormControl>
            <NavLink to="/auth/forgot-password">
              <Text color={textColorBrand} fontSize="sm" fontWeight="500">
                Forgot password?
              </Text>
            </NavLink>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
