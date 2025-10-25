using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require authentication
    public class AnalyticsController : ControllerBase
    {
        private readonly AnalyticsService _analyticsService;

        public AnalyticsController(AnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        // GET: api/analytics/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetBookingStats()
        {
            try
            {
                var stats = await _analyticsService.GetBookingStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/analytics/stats/daterange?startDate=2024-01-01&endDate=2024-12-31
        [HttpGet("stats/daterange")]
        public async Task<IActionResult> GetBookingStatsByDateRange(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            try
            {
                var stats = await _analyticsService.GetBookingStatsByDateRangeAsync(startDate, endDate);
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/analytics/revenue/station
        [HttpGet("revenue/station")]
        public async Task<IActionResult> GetRevenueByStation()
        {
            try
            {
                var revenue = await _analyticsService.GetRevenueByStationAsync();
                return Ok(revenue);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}