import { registerInputSchema } from '@/lib/auth';

const validBase = {
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'abcde',
};

describe('registerInputSchema', () => {
  describe('valid payloads', () => {
    test('TC-U-001: accepts a valid payload that includes teamName and no teamId', () => {
      const result = registerInputSchema.safeParse({
        ...validBase,
        teamName: 'My Team',
      });
      expect(result.success).toBe(true);
    });

    test('TC-U-002: accepts a valid payload that includes teamId and no teamName', () => {
      const result = registerInputSchema.safeParse({
        ...validBase,
        teamId: 'team-123',
      });
      expect(result.success).toBe(true);
    });

    test('TC-U-003: accepts a valid payload where password is exactly 5 characters', () => {
      const result = registerInputSchema.safeParse({
        ...validBase,
        password: 'abcde',
        teamName: 'My Team',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('email validation', () => {
    test('TC-U-004: rejects a payload where email is an empty string', () => {
      const result = registerInputSchema.safeParse({
        ...validBase,
        email: '',
        teamName: 'My Team',
      });
      expect(result.success).toBe(false);
    });

    test('TC-U-005: rejects a payload where email is not a valid email format', () => {
      const result = registerInputSchema.safeParse({
        ...validBase,
        email: 'notanemail',
        teamName: 'My Team',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('name field validation', () => {
    test('TC-U-006: rejects a payload where firstName is an empty string', () => {
      const result = registerInputSchema.safeParse({
        ...validBase,
        firstName: '',
        teamName: 'My Team',
      });
      expect(result.success).toBe(false);
    });

    test('TC-U-007: rejects a payload where lastName is an empty string', () => {
      const result = registerInputSchema.safeParse({
        ...validBase,
        lastName: '',
        teamName: 'My Team',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('password validation', () => {
    test('TC-U-008: rejects a payload where password has fewer than 5 characters', () => {
      const result = registerInputSchema.safeParse({
        ...validBase,
        password: 'abcd',
        teamName: 'My Team',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('team field validation', () => {
    test('TC-U-009: rejects a payload where both teamName and teamId are absent', () => {
      const result = registerInputSchema.safeParse(validBase);
      expect(result.success).toBe(false);
    });

    test('TC-U-010: rejects a payload where both teamName and teamId are non-empty strings', () => {
      const result = registerInputSchema.safeParse({
        ...validBase,
        teamName: 'My Team',
        teamId: 'team-123',
      });
      expect(result.success).toBe(false);
    });

    test('TC-U-011: rejects a payload where teamName is an empty string when no teamId is provided', () => {
      const result = registerInputSchema.safeParse({
        ...validBase,
        teamName: '',
      });
      expect(result.success).toBe(false);
    });
  });
});
