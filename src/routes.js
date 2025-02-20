import React from 'react';
import { Icon } from '@chakra-ui/react';
import {
  MdDashboard,
  MdAssignment,
  MdAdsClick,
  MdRateReview,
  MdContactPhone,
  MdHelp,
  MdEmail,
  MdLocationOn,
  MdReport,
  MdSettings,
  MdPayment,
 
  MdContacts,
  MdSms,
  MdBook,
} from 'react-icons/md';
import MainDashboard from 'views/admin/default';
import Bookings from 'views/admin/ourApplication/bookings'

import Invoices from 'views/admin/ourApplication/invoices'
import Categories from 'views/admin/ourApplication/categories'
import Community from 'views/admin/ourApplication/community'
import FAQS from 'views/admin/faqs'
const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard /> 
  },
  {
    name: 'Bookings',
    layout: '/admin',
    icon: <Icon as={MdBook} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      { name: 'Bookings', path: '/bookings', component: <Bookings />  },
     
    ],
  },
  {
    name: 'Our Application',
    layout: '/admin',
    icon: <Icon as={MdAssignment} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      
      { name: 'Invoices', path: '/invoices',component: <Invoices /> },
      { name: 'Categories', path: '/categories' ,component: <Categories />},
      { name: 'Community', path: '/community' ,component: <Community />},
      { name: 'Category Pricing', path: '/category-pricing' },
      { name: 'Category Attributes', path: '/category-attributes' },
    ],
  },
  {
    name: 'Promotions & Ads',
    layout: '/admin',
    icon: <Icon as={MdAdsClick} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      { name: 'Sponsored', path: '/sponsored' },
      { name: 'Coupons', path: '/coupons' },
      { name: 'Konnect Coin', path: '/connect-coin' },
      { name: 'Notification', path: '/notification' },
    ],
  },
  { name: 'Reviews', layout: '/admin', path: '/reviews', icon: <Icon as={MdRateReview} width="20px" height="20px" color="inherit" /> },
  {
    name: 'Contact',
    layout: '/admin',
    icon: <Icon as={MdContacts} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      { name: 'Vender Contacts', path: '/vender-contacts' },
      { name: 'Customer Contacts', path: '/customer-contacts' },
    
    ],
  },
  { name: 'FAQs', layout: '/admin', path: '/faqs', icon: <Icon as={MdHelp} width="20px" height="20px" color="inherit" /> ,component: <FAQS /> },
  { name: 'Newsletters', layout: '/admin', path: '/newsletters', icon: <Icon as={MdEmail} width="20px" height="20px" color="inherit" /> },
  { name: 'Location', layout: '/admin', path: '/location', icon: <Icon as={MdLocationOn} width="20px" height="20px" color="inherit" /> },
  { name: 'Reports', layout: '/admin', path: '/reports', icon: <Icon as={MdReport} width="20px" height="20px" color="inherit" /> },
  {
    name: 'Reports',
    layout: '/admin',
    icon: <Icon as={MdAdsClick} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      { name: 'Invoices', path: '/invoices' },
     
     
    ],
  },
  {
    name: 'Settings',
    layout: '/admin',
    icon: <Icon as={MdSettings} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      { name: 'Roles & Permissions', path: '/roles-permissions' },
      { name: 'My Dashboard', path: '/my-dashboard' },
    ],
  },
  {
    name: 'Transaction',
    layout: '/admin',
    icon: <Icon as={MdPayment} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      { name: 'Payment Gateway', path: '/payment-gateway' },
      { name: 'Completed Transactions', path: '/completed-transactions' },
      { name: 'Failed Transactions', path: '/failed-transactions' },
      { name: 'Pending Transactions', path: '/pending-transactions' },
      { name: 'Payout Request', path: '/payout-request' },
      { name: 'Refund Request', path: '/refund-request' },
    ],
  },
  {
    name: 'SMS Gateway',
    layout: '/admin',
    icon: <Icon as={MdSms} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      { name: 'SMS Gateway', path: '/sms-gateway' },
      { name: 'SMS logs', path: '/sms-logs' },
    ],
  },
];

export default routes;
