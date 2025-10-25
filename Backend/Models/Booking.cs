using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models
{
    public class Booking
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("userId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? UserId { get; set; }

        [BsonElement("stationId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? StationId { get; set; }

        [BsonElement("startTime")]
        public DateTime StartTime { get; set; }

        [BsonElement("endTime")]
        public DateTime EndTime { get; set; }

        [BsonElement("status")]
        public string Status { get; set; } = "Pending";

        [BsonElement("qrCode")]
        public string QrCode { get; set; } = string.Empty;

        [BsonElement("totalAmount")]
        public decimal TotalAmount { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}