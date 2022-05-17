import React from 'react';
import type { NextPage } from 'next';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
} from '@fidesui/react';

import NavBar from '../../features/common/NavBar';
import NewUserForm from '../../features/user-management/NewUserForm';
import { assignToken, setUser } from '../../features/user/user.slice';
import { User } from '../../features/user/types';
import { getSession } from 'next-auth/react';
import { wrapper } from '../../app/store';

const CreateNewUser: NextPage<{ session: { user: User } }> = ({ session }) => (
  <div>
    <NavBar />
    <main>
      <Box px={9} py={10}>
        <Heading fontSize="2xl" fontWeight="semibold">
          User Management
          <Box mt={2} mb={7}>
            <Breadcrumb fontWeight="medium" fontSize="sm">
              <BreadcrumbItem>
                <BreadcrumbLink href="/user-management">
                  User Management
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <BreadcrumbLink href="#">Add New User</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box>
        </Heading>
        <NewUserForm />
      </Box>
    </main>
  </div>
);

export default CreateNewUser;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const session = await getSession(context);

    if (session && typeof session.accessToken !== 'undefined') {
      await store.dispatch(assignToken(session.accessToken));
      await store.dispatch(setUser(session.user));
      return { props: { session } };
    }

    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
);