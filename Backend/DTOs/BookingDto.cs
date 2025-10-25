namespace Backend.DTOs
{
    public class BookingDto
    {
        public string Id { get; set; } = string.Empty;
        public string? UserId { get; set; }
        public string? StationId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public string QrCode { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateBookingDto
    {
        public string? UserId { get; set; }
        public string? StationId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }

    public class UpdateBookingDto
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class BookingStatsDto
    {
        public int TotalBookings { get; set; }
        public int ConfirmedBookings { get; set; }
        public int CancelledBookings { get; set; }
        public int CompletedBookings { get; set; }
        public decimal TotalRevenue { get; set; }
        public Dictionary<string, int> BookingsByStatus { get; set; } = new();
        public Dictionary<string, decimal> RevenueByStation { get; set; } = new();
    }
}