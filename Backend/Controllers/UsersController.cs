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
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        // Helper method to get user role from JWT
        private string GetUserRoleFromToken()
        {
            return User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
        }

        // Helper method to check if user is SuperAdmin
        private bool IsSuperAdmin()
        {
            return GetUserRoleFromToken() == "SuperAdmin";
        }

        // GET: api/users
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/users/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                
                if (user == null)
                    return NotFound(new { message = "User not found" });

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/users
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto createUserDto)
        {
            try
            {
                // Only SuperAdmin can create users
                if (!IsSuperAdmin())
                {
                    return StatusCode(403, new { message = "Only SuperAdmin can create users" });
                }

                var user = await _userService.CreateUserAsync(createUserDto);
                return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // PUT: api/users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto updateUserDto)
        {
            try
            {
                // Only SuperAdmin can update users
                if (!IsSuperAdmin())
                {
                    return StatusCode(403, new { message = "Only SuperAdmin can update users" });
                }

                var user = await _userService.UpdateUserAsync(id, updateUserDto);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                // Only SuperAdmin can delete users
                if (!IsSuperAdmin())
                {
                    return StatusCode(403, new { message = "Only SuperAdmin can delete users" });
                }

                await _userService.DeleteUserAsync(id);
                return Ok(new { message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // PATCH: api/users/{id}/password
        [HttpPatch("{id}/password")]
        public async Task<IActionResult> ChangePassword(string id, [FromBody] ChangePasswordDto changePasswordDto)
        {
            try
            {
                await _userService.ChangePasswordAsync(id, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);
                return Ok(new { message = "Password changed successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}