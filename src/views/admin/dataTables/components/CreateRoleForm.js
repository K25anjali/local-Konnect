import {
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Checkbox,
  VStack,
  useToast,
} from '@chakra-ui/react';

import React, { useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { _create, _update } from 'components/utils/apiUtils';

const validationSchema = Yup.object({
  title: Yup.string().required('Role name is required'),
  description: Yup.string().required('Description is required'),
  userPermissions: Yup.array().min(1, 'At least one permission is required'),
});

const CreateRoleForm = ({
  isOpen,
  onClose,
  setRoles,
  isEditing,
  editedRole,
  isPreview, // <-- Add this prop
}) => {
  const toast = useToast();

  const permissions = [
    'create',
    'read',
    'update',
    'delete',
    'block',
    'unblock',
  ];

  // Initial values for creating a new role
  const initialValues = {
    title: '',
    description: '',
    userPermissions: [],
  };

  // Set the initial values for editing a role
  useEffect(() => {
    if (isEditing && editedRole) {
      // If we are editing, set the form values to the edited role's values
      initialValues.title = editedRole?.title || '';
      initialValues.description = editedRole?.description || '';
      initialValues.userPermissions = editedRole?.userPermissions || [];
    }
  }, [isEditing, editedRole]);

  useEffect(() => {
    if (isPreview) {
      initialValues.title = editedRole?.title || '';
      initialValues.description = editedRole?.description || '';
      initialValues.userPermissions = editedRole?.userPermissions || [];
    }
  }, [isPreview]);

  const handleSubmit = async (values, { resetForm }) => {
    if (isPreview) return;

    try {
      if (isEditing) {
        await _update(`/api/roles/${editedRole._id}`, values);
        setRoles((prevRoles) =>
          prevRoles.map((role) =>
            role._id === editedRole._id ? { ...role, ...values } : role,
          ),
        );
        toast({
          title: 'Role updated.',
          description: 'The role has been successfully updated.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        const newRole = await _create('/api/roles', values);
        setRoles((prevRoles) => [...prevRoles, newRole.role]);
        toast({
          title: 'Role created.',
          description: 'A new role has been successfully created.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      resetForm(); // Reset the form after submission
      onClose();
    } catch (error) {
      toast({
        title: 'Operation failed.',
        description: 'Something went wrong. Try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isPreview
            ? 'Preview Role'
            : isEditing
            ? 'Edit Role'
            : 'Create New Role'}
        </ModalHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true} // <-- This makes sure that Formik will reinitialize when `initialValues` change
        >
          {({ values, setFieldValue, resetForm }) => (
            <Form>
              <ModalBody>
                <FormControl mb={4}>
                  <FormLabel>Role Name</FormLabel>
                  <Field as={Input} name="title" isReadOnly={isPreview} />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Description</FormLabel>
                  <Field as={Input} name="description" isReadOnly={isPreview} />
                </FormControl>
                <FormControl>
                  <FormLabel>Permissions</FormLabel>
                  <VStack align="start">
                    {permissions.map((perm) => (
                      <Checkbox
                        key={perm}
                        value={perm}
                        isChecked={values.userPermissions.includes(perm)}
                        onChange={() => {
                          if (isPreview) return;
                          const newPermissions =
                            values.userPermissions.includes(perm)
                              ? values.userPermissions.filter((p) => p !== perm)
                              : [...values.userPermissions, perm];
                          setFieldValue('userPermissions', newPermissions);
                        }}
                        isDisabled={isPreview} // Disable checkboxes in preview mode
                      >
                        {perm}
                      </Checkbox>
                    ))}
                  </VStack>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                {isPreview ? (
                  <Button
                    onClick={() => {
                      resetForm();
                      onClose();
                    }}
                  >
                    Close
                  </Button>
                ) : (
                  <>
                    <Button colorScheme="blue" type="submit">
                      {isEditing ? 'Update Role' : 'Create Role'}
                    </Button>
                    <Button
                      onClick={() => {
                        resetForm();
                        onClose();
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default CreateRoleForm;
