using Backend.Models;
using MongoDB.Driver;

namespace Backend.Data
{
    public class UserRepository
    {
        private readonly MongoDbContext _context;

        public UserRepository(MongoDbContext context)
        {
            _context = context;
        }

        // Get all users
        public async Task<List<User>> GetAllAsync()
        {
            return await _context.Users.Find(_ => true).ToListAsync();
        }

        // Get user by ID
        public async Task<User?> GetByIdAsync(string id)
        {
            return await _context.Users.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        // Get user by email
        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        // Create new user
        public async Task CreateAsync(User user)
        {
            await _context.Users.InsertOneAsync(user);
        }

        // Update user
        public async Task UpdateAsync(string id, User user)
        {
            user.UpdatedAt = DateTime.UtcNow;
            await _context.Users.ReplaceOneAsync(u => u.Id == id, user);
        }

        // Delete user
        public async Task DeleteAsync(string id)
        {
            await _context.Users.DeleteOneAsync(u => u.Id == id);
        }

        // Check if email exists
        public async Task<bool> EmailExistsAsync(string email)
        {
            var user = await GetByEmailAsync(email);
            return user != null;
        }
    }
}