using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly MongoDbContext _context;

        public SeedController(MongoDbContext context)
        {
            _context = context;
        }

        // POST: api/seed/stations
        [HttpPost("stations")]
        public async Task<IActionResult> SeedStations()
        {
            try
            {
                // Check if stations already exist
                var existingStations = await _context.Stations.Find(_ => true).CountDocumentsAsync();
                if (existingStations > 0)
                {
                    return Ok(new { message = $"Stations already exist ({existingStations} stations)" });
                }

                // Create default stations
                var stations = new List<Station>
                {
                    new Station
                    {
                        Name = "Downtown Charging Station",
                        Location = "123 Main Street, Downtown",
                        OperatorId = "000000000000000000000001",
                        PricePerHour = 50.00m,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Station
                    {
                        Name = "Airport Charging Station",
                        Location = "456 Airport Road, Terminal 1",
                        OperatorId = "000000000000000000000001",
                        PricePerHour = 60.00m,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Station
                    {
                        Name = "Mall Charging Station",
                        Location = "789 Shopping Plaza, Level P2",
                        OperatorId = "000000000000000000000001",
                        PricePerHour = 45.00m,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Station
                    {
                        Name = "Highway Charging Station",
                        Location = "321 Highway Exit 5",
                        OperatorId = "000000000000000000000001",
                        PricePerHour = 55.00m,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                await _context.Stations.InsertManyAsync(stations);

                return Ok(new { 
                    message = "Stations seeded successfully",
                    count = stations.Count,
                    stations = stations.Select(s => new { s.Id, s.Name, s.Location })
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
