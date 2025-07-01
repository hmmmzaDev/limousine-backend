import request from 'supertest';
import { describe, expect, it, beforeAll, afterAll, beforeEach } from 'vitest';
import app from '../../app';
import { setupTestDB, cleanupTestDB, disconnectTestDB } from '../setup';
import { createTestCustomer, createTestDriver } from '../helpers/auth';
import { CustomerService, DriverService } from '../../services';
import bcrypt from 'bcrypt';

// Setup test database
setupTestDB();

describe('Authentication Routes', () => {
    describe('Customer Authentication', () => {
        describe('POST /customer/profile/signup', () => {
            it('should create a new customer successfully', async () => {
                const timestamp = Date.now();
                const customerData = {
                    name: 'John Doe',
                    email: `john-${timestamp}-${Math.random().toString(36).substr(2, 5)}@example.com`,
                    password: 'strongpassword123'
                };

                const res = await request(app)
                    .post('/customer/profile/signup')
                    .send(customerData);

                expect(res.statusCode).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data).toHaveProperty('id');
                expect(res.body.data.name).toBe(customerData.name);
                expect(res.body.data.email).toBe(customerData.email);
                expect(res.body.data).not.toHaveProperty('password');
            });

            it('should prevent duplicate email registration', async () => {
                const timestamp = Date.now();
                const customerData = {
                    name: 'John Doe',
                    email: `john-dup-${timestamp}-${Math.random().toString(36).substr(2, 5)}@example.com`,
                    password: 'strongpassword123'
                };

                // Create customer first
                await request(app)
                    .post('/customer/profile/signup')
                    .send(customerData);

                // Try to create with same email
                const res = await request(app)
                    .post('/customer/profile/signup')
                    .send(customerData);

                expect(res.statusCode).toBe(400);
                expect(res.body.status).toBe('error');
                expect(res.body.message).toContain('Email already exists');
            });

            it('should validate required fields', async () => {
                const res = await request(app)
                    .post('/customer/profile/signup')
                    .send({
                        name: 'John Doe'
                        // Missing email and password
                    });

                expect(res.statusCode).toBe(400);
                expect(res.body.status).toBe('error');
                expect(res.body.message).toContain('missed some inputs');
            });
        });

        describe('POST /customer/profile/login', () => {
            it('should login customer with valid credentials', async () => {
                // Create a customer first
                const timestamp = Date.now();
                const customerData = {
                    name: 'John Doe',
                    email: `john-login-${timestamp}-${Math.random().toString(36).substr(2, 5)}@example.com`,
                    password: 'strongpassword123'
                };

                await request(app)
                    .post('/customer/profile/signup')
                    .send(customerData);

                // Login
                const res = await request(app)
                    .post('/customer/profile/login')
                    .send({
                        email: customerData.email,
                        password: customerData.password
                    });

                expect(res.statusCode).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data).toHaveProperty('token');
                expect(res.body.data).toHaveProperty('customer');
                expect(res.body.data.customer.email).toBe(customerData.email);
                expect(res.body.data.customer).not.toHaveProperty('password');
            });

            it('should reject login with invalid email', async () => {
                const res = await request(app)
                    .post('/customer/profile/login')
                    .send({
                        email: 'nonexistent@example.com',
                        password: 'somepassword'
                    });

                expect(res.statusCode).toBe(401);
                expect(res.body.status).toBe('error');
                expect(res.body.message).toBe('Invalid email or password');
            });

            it('should reject login with invalid password', async () => {
                // Create a customer first
                const timestamp = Date.now();
                const customerData = {
                    name: 'John Doe',
                    email: `john-wrong-${timestamp}-${Math.random().toString(36).substr(2, 5)}@example.com`,
                    password: 'strongpassword123'
                };

                await request(app)
                    .post('/customer/profile/signup')
                    .send(customerData);

                // Try login with wrong password
                const res = await request(app)
                    .post('/customer/profile/login')
                    .send({
                        email: customerData.email,
                        password: 'wrongpassword'
                    });

                expect(res.statusCode).toBe(401);
                expect(res.body.status).toBe('error');
                expect(res.body.message).toBe('Invalid email or password');
            });
        });
    });

    describe('Driver Authentication', () => {
        describe('POST /driver/profile/login', () => {
            it('should login driver with valid credentials', async () => {
                // Create a driver first using service (since drivers are created by admin)
                const timestamp = Date.now();
                const driverData = {
                    name: 'Jane Driver',
                    email: `jane-${timestamp}-${Math.random().toString(36).substr(2, 5)}@example.com`,
                    password: 'driverpassword123',
                    vehicleDetails: {
                        model: 'Mercedes S-Class',
                        licensePlate: `ABC-${timestamp}`
                    },
                    status: 'available' as 'available' | 'on_trip' | 'offline'
                };

                // Hash password
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(driverData.password, salt);

                await DriverService.create({
                    ...driverData,
                    password: hashedPassword
                });

                // Login
                const res = await request(app)
                    .post('/driver/profile/login')
                    .send({
                        email: driverData.email,
                        password: driverData.password
                    });

                expect(res.statusCode).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data).toHaveProperty('token');
                expect(res.body.data).toHaveProperty('driver');
                expect(res.body.data.driver.email).toBe(driverData.email);
                expect(res.body.data.driver).not.toHaveProperty('password');
                expect(res.body.data.driver.vehicleDetails).toEqual(driverData.vehicleDetails);
            });

            it('should reject login with invalid credentials', async () => {
                const res = await request(app)
                    .post('/driver/profile/login')
                    .send({
                        email: 'nonexistent@example.com',
                        password: 'somepassword'
                    });

                expect(res.statusCode).toBe(401);
                expect(res.body.status).toBe('error');
                expect(res.body.message).toBe('Invalid email or password');
            });
        });
    });
});
