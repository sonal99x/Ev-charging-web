using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models
{
    public class Station
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("location")]
        public string Location { get; set; } = string.Empty;

        [BsonElement("operatorId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string OperatorId { get; set; } = string.Empty;

        [BsonElement("pricePerHour")]
        public decimal PricePerHour { get; set; }

        [BsonElement("isActive")]
        public bool IsActive { get; set; } = true;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}