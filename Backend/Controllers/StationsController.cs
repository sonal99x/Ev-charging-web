using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StationsController : ControllerBase
    {
        private readonly MongoDbContext _context;

        public StationsController(MongoDbContext context)
        {
            _context = context;
        }

        // GET: api/stations
        [HttpGet]
        public async Task<IActionResult> GetStations()
        {
            try
            {
                var stations = await _context.Stations
                    .Find(_ => true)
                    .ToListAsync();
                
                return Ok(stations);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/stations/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStation(string id)
        {
            try
            {
                var station = await _context.Stations
                    .Find(s => s.Id == id)
                    .FirstOrDefaultAsync();

                if (station == null)
                {
                    return NotFound(new { message = "Station not found" });
                }

                return Ok(station);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/stations
        [HttpPost]
        public async Task<IActionResult> CreateStation([FromBody] Station station)
        {
            try
            {
                // Get userId from JWT token
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User ID not found in token" });
                }

                station.OperatorId = userId;
                station.CreatedAt = DateTime.UtcNow;

                await _context.Stations.InsertOneAsync(station);
                return CreatedAtAction(nameof(GetStation), new { id = station.Id }, station);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
