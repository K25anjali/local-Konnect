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

const CreateTeamForm = ({
  isOpen,
  onClose,
  setTeamMembers,
  isEditing,
  editedTeamMember,
  isPreview, // <-- Add this prop
}) => {
  const toast = useToast();

  // Initial values for creating a new role
  const initialValues = {
    name: '',
    email: '',
    phoneNumber: '',
    role: '',
  };

  // Set the initial values for editing a role
  useEffect(() => {
    if (isEditing && editedTeamMember) {
      initialValues.name = editedTeamMember?.name || '';
      initialValues.email = editedTeamMember?.description || '';
      initialValues.phone = editedTeamMember?.phone || '';
      initialValues.userType = editedTeamMember?.userType || '';
      initialValues.designation = editedTeamMember?.designation || '';
    }
  }, [isEditing, editedTeamMember]);

  useEffect(() => {
    if (isPreview) {
      initialValues.name = editedTeamMember?.title || '';
      initialValues.email = editedTeamMember?.description || '';
      initialValues.phoneNumber = editedTeamMember?.phoneNumber || '';
      initialValues.role = editedTeamMember?.role || '';
    }
  }, [isPreview]);

  const handleSubmit = async (values, { resetForm }) => {
    if (isPreview) return;

    try {
      if (isEditing) {
        await _update(`/api/roles/${editedTeamMember._id}`, values);
        setTeamMembers((prevTeamMembers) =>
          prevTeamMembers.map((teamMember) =>
            teamMember._id === editedTeamMember._id
              ? { ...teamMember, ...values }
              : teamMember,
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
        const newTeamMember = await _create('/api/admin-team/', values);
        setTeamMembers((prevTeam) => [...prevTeam, newTeamMember.team]);
        toast({
          title: 'Team member created.',
          description: 'A new role has been successfully created.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      resetForm();
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
            ? 'Preview Team Member'
            : isEditing
            ? 'Edit Team Member'
            : 'Create New Team Member'}
        </ModalHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true} // <-- This makes sure that Formik will reinitialize when `initialValues` change
        >
          {({ resetForm }) => (
            <Form>
              <ModalBody>
                <FormControl mb={4}>
                  <FormLabel>Name</FormLabel>
                  <Field as={Input} name="name" isReadOnly={isPreview} />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Email</FormLabel>
                  <Field as={Input} name="email" isReadOnly={isPreview} />
                </FormControl>
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Field as={Input} name="phone" isReadOnly={isPreview} />
                </FormControl>
                <FormControl>
                  <FormLabel>User Type</FormLabel>
                  <Field as={Input} name="userType" isReadOnly={isPreview} />
                </FormControl>
                <FormControl>
                  <FormLabel>Designation</FormLabel>
                  <Field as={Input} name="designation" isReadOnly={isPreview} />
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

export default CreateTeamForm;
