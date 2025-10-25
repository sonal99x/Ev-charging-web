using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require authentication for all endpoints
    public class BookingsController : ControllerBase
    {
        private readonly BookingService _bookingService;

        public BookingsController(BookingService bookingService)
        {
            _bookingService = bookingService;
        }

        // Helper method to get user ID from JWT
        private string GetUserIdFromToken()
        {
            return User.FindFirst("id")?.Value ?? string.Empty;
        }

        // Helper method to get user role from JWT
        private string GetUserRoleFromToken()
        {
            return User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
        }

        // GET: api/bookings
        [HttpGet]
        public async Task<IActionResult> GetAllBookings()
        {
            try
            {
                var bookings = await _bookingService.GetAllBookingsAsync();
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/bookings/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookingById(string id)
        {
            try
            {
                var booking = await _bookingService.GetBookingByIdAsync(id);

                if (booking == null)
                    return NotFound(new { message = "Booking not found" });

                return Ok(booking);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/bookings/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetBookingsByUserId(string userId)
        {
            try
            {
                var bookings = await _bookingService.GetBookingsByUserIdAsync(userId);
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/bookings
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto createBookingDto)
        {
            try
            {
                var userId = GetUserIdFromToken();
                
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                // Override any userId from request body with authenticated user's ID for security
                createBookingDto.UserId = userId;

                var booking = await _bookingService.CreateBookingAsync(createBookingDto);
                return CreatedAtAction(nameof(GetBookingById), new { id = booking.Id }, booking);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // PUT: api/bookings/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(string id, [FromBody] UpdateBookingDto updateBookingDto)
        {
            try
            {
                var userId = GetUserIdFromToken();
                var userRole = GetUserRoleFromToken();

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var booking = await _bookingService.UpdateBookingAsync(id, updateBookingDto, userId, userRole);
                return Ok(booking);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/bookings/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelBooking(string id)
        {
            try
            {
                var userId = GetUserIdFromToken();
                var userRole = GetUserRoleFromToken();

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                await _bookingService.CancelBookingAsync(id, userId, userRole);
                return Ok(new { message = "Booking cancelled successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/bookings/{id}/canmodify
        [HttpGet("{id}/canmodify")]
        public async Task<IActionResult> CanModifyBooking(string id)
        {
            try
            {
                var userRole = GetUserRoleFromToken();
                var booking = await _bookingService.GetBookingByIdAsync(id);

                if (booking == null)
                    return NotFound(new { message = "Booking not found" });

                var canModify = Backend.Helpers.DateHelper.CanUserModifyBooking(booking.CreatedAt, userRole);
                var hoursRemaining = Backend.Helpers.DateHelper.GetHoursRemainingForModification(booking.CreatedAt);

                return Ok(new
                {
                    canModify = canModify,
                    hoursRemaining = hoursRemaining,
                    isSuperAdmin = userRole == "SuperAdmin"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}