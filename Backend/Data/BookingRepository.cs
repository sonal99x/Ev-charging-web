using Backend.Models;
using MongoDB.Driver;

namespace Backend.Data
{
    public class BookingRepository
    {
        private readonly MongoDbContext _context;

        public BookingRepository(MongoDbContext context)
        {
            _context = context;
        }

        // Get all bookings
        public async Task<List<Booking>> GetAllAsync()
        {
            return await _context.Bookings.Find(_ => true).ToListAsync();
        }

        // Get booking by ID
        public async Task<Booking?> GetByIdAsync(string id)
        {
            return await _context.Bookings.Find(b => b.Id == id).FirstOrDefaultAsync();
        }

        // Get bookings by user
        public async Task<List<Booking>> GetByUserIdAsync(string userId)
        {
            return await _context.Bookings.Find(b => b.UserId == userId).ToListAsync();
        }

        // Get bookings by station
        public async Task<List<Booking>> GetByStationIdAsync(string stationId)
        {
            return await _context.Bookings.Find(b => b.StationId == stationId).ToListAsync();
        }

        // Create new booking
        public async Task CreateAsync(Booking booking)
        {
            await _context.Bookings.InsertOneAsync(booking);
        }

        // Update booking
        public async Task UpdateAsync(string id, Booking booking)
        {
            booking.UpdatedAt = DateTime.UtcNow;
            await _context.Bookings.ReplaceOneAsync(b => b.Id == id, booking);
        }

        // Delete booking
        public async Task DeleteAsync(string id)
        {
            await _context.Bookings.DeleteOneAsync(b => b.Id == id);
        }

        // Check for conflicting bookings (same station, overlapping time)
        public async Task<bool> HasConflictAsync(string stationId, DateTime startTime, DateTime endTime, string? excludeBookingId = null)
        {
            var filter = Builders<Booking>.Filter.And(
                Builders<Booking>.Filter.Eq(b => b.StationId, stationId),
                Builders<Booking>.Filter.Ne(b => b.Status, "Cancelled"),
                Builders<Booking>.Filter.Or(
                    Builders<Booking>.Filter.And(
                        Builders<Booking>.Filter.Lte(b => b.StartTime, startTime),
                        Builders<Booking>.Filter.Gte(b => b.EndTime, startTime)
                    ),
                    Builders<Booking>.Filter.And(
                        Builders<Booking>.Filter.Lte(b => b.StartTime, endTime),
                        Builders<Booking>.Filter.Gte(b => b.EndTime, endTime)
                    ),
                    Builders<Booking>.Filter.And(
                        Builders<Booking>.Filter.Gte(b => b.StartTime, startTime),
                        Builders<Booking>.Filter.Lte(b => b.EndTime, endTime)
                    )
                )
            );

            if (!string.IsNullOrEmpty(excludeBookingId))
            {
                filter = Builders<Booking>.Filter.And(
                    filter,
                    Builders<Booking>.Filter.Ne(b => b.Id, excludeBookingId)
                );
            }

            var conflictingBooking = await _context.Bookings.Find(filter).FirstOrDefaultAsync();
            return conflictingBooking != null;
        }

        // Get bookings within date range
        public async Task<List<Booking>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var filter = Builders<Booking>.Filter.And(
                Builders<Booking>.Filter.Gte(b => b.StartTime, startDate),
                Builders<Booking>.Filter.Lte(b => b.EndTime, endDate)
            );

            return await _context.Bookings.Find(filter).ToListAsync();
        }
    }
}