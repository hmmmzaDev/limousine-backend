import request from 'supertest';
import { describe, expect, it, beforeAll, afterAll, beforeEach } from 'vitest';
import app from '../../app';
import { setupTestDB, cleanupTestDB, disconnectTestDB } from '../setup';
import { createTestAdminToken, createTestCustomer, createTestDriver, getAuthHeaders } from '../helpers/auth';

// Setup test database
setupTestDB();

describe('Admin Routes', () => {
    describe('Customer Management', () => {
        describe('POST /admin/customer/getAll', () => {
            it('should fetch all customers', async () => {
                const adminToken = createTestAdminToken();

                // Create some test customers with unique emails
                const timestamp = Date.now();
                await createTestCustomer({ email: `customer1-${timestamp}@test.com` });
                await createTestCustomer({ email: `customer2-${timestamp}@test.com` });

                // Add a small delay to ensure data is committed
                await new Promise(resolve => setTimeout(resolve, 100));

                const res = await request(app)
                    .post('/admin/customer/getAll')
                    .set(getAuthHeaders(adminToken))
                    .send({});

                expect(res.statusCode).toBe(200);
                expect(res.body.status).toBe('success');
                expect(Array.isArray(res.body.data)).toBe(true);
                expect(res.body.data).toHaveLength(2);
            });

            it('should require admin authentication', async () => {
                const { token } = await createTestCustomer(); // Customer token

                const res = await request(app)
                    .post('/admin/customer/getAll')
                    .set(getAuthHeaders(token))
                    .send({});

                expect(res.statusCode).toBe(403);
                expect(res.body.status).toBe('error');
                expect(res.body.message).toContain('Access denied');
            });
        });

        describe('POST /admin/customer/getById', () => {
            it('should fetch a customer by ID', async () => {
                const adminToken = createTestAdminToken();
                const { customer } = await createTestCustomer();

                const res = await request(app)
                    .post('/admin/customer/getById')
                    .set(getAuthHeaders(adminToken))
                    .send({ id: customer._id.toString() });

                expect(res.statusCode).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data.id).toBe(customer._id.toString());
                expect(res.body.data.email).toBe(customer.email);
            });

            it('should require valid customer ID', async () => {
                const adminToken = createTestAdminToken();

                const res = await request(app)
                    .post('/admin/customer/getById')
                    .set(getAuthHeaders(adminToken))
                    .send({ id: 'invalid-id' });

                expect(res.statusCode).toBe(404);
                expect(res.body.status).toBe('error');
            });
        });
    });

    describe('Driver Management', () => {
        describe('POST /admin/driver/addRecord', () => {
            it('should create a new driver', async () => {
                const adminToken = createTestAdminToken();

                const driverData = {
                    name: 'New Driver',
                    email: 'newdriver@test.com',
                    password: 'password123',
                    vehicleDetails: {
                        model: 'BMW 7 Series',
                        licensePlate: 'NEW-123'
                    },
                    status: 'available' as 'available' | 'on_trip' | 'offline'
                };

                const res = await request(app)
                    .post('/admin/driver/addRecord')
                    .set(getAuthHeaders(adminToken))
                    .send(driverData);

                expect(res.statusCode).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data.name).toBe(driverData.name);
                expect(res.body.data.email).toBe(driverData.email);
                expect(res.body.data.vehicleDetails).toEqual(driverData.vehicleDetails);
                expect(res.body.data).not.toHaveProperty('password');
            });

            it('should prevent duplicate driver emails', async () => {
                const adminToken = createTestAdminToken();
                await createTestDriver({ email: 'existing@test.com' });

                const driverData = {
                    name: 'Another Driver',
                    email: 'existing@test.com', // Same email
                    password: 'password123',
                    vehicleDetails: {
                        model: 'BMW 7 Series',
                        licensePlate: 'NEW-123'
                    }
                };

                const res = await request(app)
                    .post('/admin/driver/addRecord')
                    .set(getAuthHeaders(adminToken))
                    .send(driverData);

                expect(res.statusCode).toBe(400);
                expect(res.body.status).toBe('error');
                expect(res.body.message).toContain('Email already exists');
            });
        });

        describe('POST /admin/driver/getAll', () => {
            it('should fetch all drivers', async () => {
                const adminToken = createTestAdminToken();

                const timestamp = Date.now();
                await createTestDriver({ email: `driver1-${timestamp}@test.com` });
                await createTestDriver({ email: `driver2-${timestamp}@test.com` });

                // Add a small delay to ensure data is committed
                await new Promise(resolve => setTimeout(resolve, 100));

                const res = await request(app)
                    .post('/admin/driver/getAll')
                    .set(getAuthHeaders(adminToken))
                    .send({});

                expect(res.statusCode).toBe(200);
                expect(res.body.status).toBe('success');
                expect(Array.isArray(res.body.data)).toBe(true);
                expect(res.body.data).toHaveLength(2);
            });

            it('should filter drivers by status', async () => {
                const adminToken = createTestAdminToken();

                const timestamp = Date.now();
                await createTestDriver({ email: `available-${timestamp}@test.com`, status: 'available' });
                await createTestDriver({ email: `offline-${timestamp}@test.com`, status: 'offline' });

                // Add a small delay to ensure data is committed
                await new Promise(resolve => setTimeout(resolve, 100));

                const res = await request(app)
                    .post('/admin/driver/getAll')
                    .set(getAuthHeaders(adminToken))
                    .send({ status: 'available' });

                expect(res.statusCode).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data).toHaveLength(1);
                expect(res.body.data[0].status).toBe('available');
            });
        });
    });

    describe('Booking Management', () => {
        describe('POST /admin/booking/getAll', () => {
            it('should fetch all bookings', async () => {
                const adminToken = createTestAdminToken();

                // This test would require creating test bookings
                // Implementation depends on specific test requirements

                const res = await request(app)
                    .post('/admin/booking/getAll')
                    .set(getAuthHeaders(adminToken))
                    .send({});

                expect(res.statusCode).toBe(200);
                expect(res.body.status).toBe('success');
                expect(Array.isArray(res.body.data)).toBe(true);
            });
        });

        describe('POST /admin/booking/assignDriverAndSetPrice', () => {
            it('should assign driver and set price for a booking', async () => {
                // This test would require setting up a booking and driver
                // Implementation depends on specific test requirements
            });

            it('should validate booking status', async () => {
                // Test business rules for assigning drivers
                // Implementation depends on specific test requirements
            });
        });
    });
});
