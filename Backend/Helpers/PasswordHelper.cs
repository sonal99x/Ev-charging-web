namespace Backend.Helpers
{
    public static class PasswordHelper
    {
        // Hash a password (convert "password123" to random encrypted string)
        public static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        // Check if password matches the hash
        public static bool VerifyPassword(string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
    }
}