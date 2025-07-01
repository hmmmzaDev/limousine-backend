import request from 'supertest';
import { describe, expect, it, beforeAll, afterAll, beforeEach } from 'vitest';
import app from '../../app';
import { setupTestDB, cleanupTestDB, disconnectTestDB } from '../setup';
import { createTestCustomer, getAuthHeaders } from '../helpers/auth';

// Setup test database
setupTestDB();

describe('Customer Booking Routes', () => {
    describe('POST /customer/booking/submitRequest', () => {
        it('should submit a ride request successfully', async () => {
            const { customer, token } = await createTestCustomer();

            // Ensure customer is properly saved
            await new Promise(resolve => setTimeout(resolve, 100));

            const bookingData = {
                pickupLocation: '123 Main Street, Downtown',
                dropoffLocation: '456 Oak Avenue, Uptown',
                rideTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Tomorrow
            };

            const res = await request(app)
                .post('/customer/booking/submitRequest')
                .set(getAuthHeaders(token))
                .send(bookingData);

            if (res.statusCode !== 200) {
                console.log('Customer booking test failed:', res.statusCode, res.body);
            }

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data.pickupLocation).toBe(bookingData.pickupLocation);
            expect(res.body.data.dropoffLocation).toBe(bookingData.dropoffLocation);
            expect(res.body.data.status).toBe('Pending');
            // customerId might be populated object or string
            const customerIdValue = typeof res.body.data.customerId === 'object'
                ? res.body.data.customerId.id || res.body.data.customerId._id
                : res.body.data.customerId;
            expect(customerIdValue.toString()).toBe(customer._id.toString());
        });

        it('should require authentication', async () => {
            const bookingData = {
                pickupLocation: '123 Main Street, Downtown',
                dropoffLocation: '456 Oak Avenue, Uptown',
                rideTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            };

            const res = await request(app)
                .post('/customer/booking/submitRequest')
                .send(bookingData);

            expect(res.statusCode).toBe(401);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toContain('Access token is required');
        });

        it('should validate required fields', async () => {
            const { token } = await createTestCustomer();

            const res = await request(app)
                .post('/customer/booking/submitRequest')
                .set(getAuthHeaders(token))
                .send({
                    pickupLocation: '123 Main Street'
                    // Missing dropoffLocation and rideTime
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toContain('missed some inputs');
        });

        it('should reject past ride times', async () => {
            const { token } = await createTestCustomer();

            const bookingData = {
                pickupLocation: '123 Main Street, Downtown',
                dropoffLocation: '456 Oak Avenue, Uptown',
                rideTime: new Date(Date.now() - 60 * 60 * 1000).toISOString() // 1 hour ago
            };

            const res = await request(app)
                .post('/customer/booking/submitRequest')
                .set(getAuthHeaders(token))
                .send(bookingData);

            expect(res.statusCode).toBe(400);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toContain('Ride time must be in the future');
        });
    });

    describe('POST /customer/booking/acceptQuote', () => {
        it('should accept a ride quote successfully', async () => {
            // This test would require setting up a booking in 'Awaiting-Acceptance' status
            // Implementation depends on specific test requirements
        });

        it('should require authentication', async () => {
            const res = await request(app)
                .post('/customer/booking/acceptQuote')
                .send({ bookingId: 'some-booking-id' });

            expect(res.statusCode).toBe(401);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toContain('Access token is required');
        });

        it('should only allow customers to accept their own bookings', async () => {
            // Test for ownership validation
            // Implementation depends on specific test requirements
        });
    });

    describe('POST /customer/booking/cancel', () => {
        it('should cancel a booking successfully', async () => {
            // This test would require setting up a booking that can be cancelled
            // Implementation depends on specific test requirements
        });

        it('should require authentication', async () => {
            const res = await request(app)
                .post('/customer/booking/cancel')
                .send({ bookingId: 'some-booking-id' });

            expect(res.statusCode).toBe(401);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toContain('Access token is required');
        });

        it('should only allow customers to cancel their own bookings', async () => {
            // Test for ownership validation
            // Implementation depends on specific test requirements
        });

        it('should not allow cancelling completed bookings', async () => {
            // Test for business rule validation
            // Implementation depends on specific test requirements
        });
    });
});
