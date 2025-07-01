import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { CustomerService, DriverService } from '../../services';

// Test JWT secret (ensure it matches the app's JWT secret)
const TEST_JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

// Generate JWT token for testing
export const generateTestToken = (payload: {
    userId: string;
    email: string;
    name: string;
    userType: 'customer' | 'driver';
    role: 'customer' | 'driver' | 'admin';
}) => {
    return jwt.sign(payload, TEST_JWT_SECRET, { expiresIn: '1h' });
};

// Create test customer and return token
export const createTestCustomer = async (customerData?: {
    name?: string;
    email?: string;
    password?: string;
}) => {
    const timestamp = Date.now();
    const defaultData = {
        name: 'Test Customer',
        email: `customer-${timestamp}-${Math.random().toString(36).substr(2, 5)}@test.com`, // Unique email
        password: 'testpassword123'
    };

    const data = { ...defaultData, ...customerData };

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(data.password, salt);

    const customer = await CustomerService.create({
        name: data.name,
        email: data.email,
        password: hashedPassword
    });

    const token = generateTestToken({
        userId: customer._id.toString(),
        email: customer.email,
        name: customer.name,
        userType: 'customer',
        role: 'customer'
    });

    return { customer, token };
};

// Create test driver and return token
export const createTestDriver = async (driverData?: {
    name?: string;
    email?: string;
    password?: string;
    vehicleDetails?: { model: string; licensePlate: string };
    status?: 'available' | 'on_trip' | 'offline';
}) => {
    const timestamp = Date.now();
    const defaultData = {
        name: 'Test Driver',
        email: `driver-${timestamp}-${Math.random().toString(36).substr(2, 5)}@test.com`, // Unique email
        password: 'testpassword123',
        vehicleDetails: { model: 'Mercedes S-Class', licensePlate: `TEST-${timestamp}` },
        status: 'available' as 'available' | 'on_trip' | 'offline'
    };

    const data = { ...defaultData, ...driverData };

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(data.password, salt);

    const driver = await DriverService.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        vehicleDetails: data.vehicleDetails,
        status: data.status
    });

    const token = generateTestToken({
        userId: driver._id.toString(),
        email: driver.email,
        name: driver.name,
        userType: 'driver',
        role: 'driver'
    });

    return { driver, token };
};

// Create test admin token
// Note: Since we don't have admin users in DB, we create a fake but valid admin token
export const createTestAdminToken = () => {
    return generateTestToken({
        userId: '507f1f77bcf86cd799439011', // Valid ObjectId format
        email: 'admin@test.com',
        name: 'Test Admin',
        userType: 'customer', // Admin doesn't have a separate type in our system
        role: 'admin'
    });
};

// Authorization headers for requests
export const getAuthHeaders = (token: string) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
});
