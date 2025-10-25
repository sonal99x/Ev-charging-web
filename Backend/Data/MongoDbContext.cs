using MongoDB.Driver;
using Backend.Models;

namespace Backend.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IConfiguration configuration)
        {
            var connectionString = configuration["MongoDb:ConnectionString"];
            var databaseName = configuration["MongoDb:DatabaseName"];
            
            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(databaseName);
        }

        public IMongoCollection<T> GetCollection<T>(string name)
        {
            return _database.GetCollection<T>(name);
        }

        public IMongoCollection<User> Users => GetCollection<User>("Users");
        public IMongoCollection<Booking> Bookings => GetCollection<Booking>("Bookings");
        public IMongoCollection<Station> Stations => GetCollection<Station>("Stations");
    }
}