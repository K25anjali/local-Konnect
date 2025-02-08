import {
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Checkbox,
  VStack,
  useToast,
} from '@chakra-ui/react';

import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { _create, _update } from 'components/utils/apiUtils';

const validationSchema = Yup.object({
  roleName: Yup.string().required('Role name is required'),
  description: Yup.string().required('Description is required'),
  permissions: Yup.array().min(1, 'At least one permission is required'),
});

const CreateRoleForm = ({
  isOpen,
  onClose,
  editedRole,
  setEditedRole,
  setRoles,
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
  const isEditing = !!editedRole;

  const handleSubmit = async (values) => {
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
        setRoles((prevRoles) => [...prevRoles, newRole]);
        toast({
          title: 'Role created.',
          description: 'A new role has been successfully created.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      onClose();
      setEditedRole(null);
    } catch (error) {
      console.error('Error saving role:', error);
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
        setEditedRole(null);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditing ? 'Edit Role' : 'Create New Role'}</ModalHeader>
        <Formik
          initialValues={{
            roleName: editedRole?.title || '',
            description: editedRole?.description || '',
            permissions: editedRole?.userPermissions || [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <ModalBody>
                <FormControl mb={4}>
                  <FormLabel>Role Name</FormLabel>
                  <Field as={Input} name="roleName" />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Description</FormLabel>
                  <Field as={Input} name="description" />
                </FormControl>
                <FormControl>
                  <FormLabel>Permissions</FormLabel>
                  <VStack align="start">
                    {permissions.map((perm) => (
                      <Checkbox
                        key={perm}
                        value={perm}
                        isChecked={values.permissions.includes(perm)}
                        onChange={() => {
                          const newPermissions = values.permissions.includes(
                            perm,
                          )
                            ? values.permissions.filter((p) => p !== perm)
                            : [...values.permissions, perm];
                          setFieldValue('permissions', newPermissions);
                        }}
                      >
                        {perm}
                      </Checkbox>
                    ))}
                  </VStack>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" type="submit">
                  {isEditing ? 'Update Role' : 'Create Role'}
                </Button>
                <Button
                  onClick={() => {
                    onClose();
                    setEditedRole(null);
                  }}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default CreateRoleForm;
