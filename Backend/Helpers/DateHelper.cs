namespace Backend.Helpers
{
    public static class DateHelper
    {
        // Check if booking is within 7 days advance
        public static bool IsWithin7Days(DateTime bookingDate)
        {
            var maxDate = DateTime.UtcNow.AddDays(7);
            return bookingDate <= maxDate;
        }

        // Check if booking can be cancelled (within 12 hours of creation)
        public static bool CanCancelOrModify(DateTime bookingCreatedAt)
        {
            var hoursSinceCreation = (DateTime.UtcNow - bookingCreatedAt).TotalHours;
            return hoursSinceCreation <= 12;
        }

        // Check if user has permission to modify/delete (12-hour rule for regular users)
        public static bool CanUserModifyBooking(DateTime bookingCreatedAt, string userRole)
        {
            // SuperAdmin can always modify
            if (userRole == "SuperAdmin")
                return true;

            // Regular users can only modify within 12 hours of creation
            return CanCancelOrModify(bookingCreatedAt);
        }

        // Check if booking date is in the future
        public static bool IsFutureDate(DateTime date)
        {
            return date > DateTime.UtcNow;
        }

        // Calculate hours between two dates
        public static double CalculateHours(DateTime startTime, DateTime endTime)
        {
            var duration = endTime - startTime;
            return duration.TotalHours;
        }

        // Get hours remaining for cancellation/modification
        public static double GetHoursRemainingForModification(DateTime bookingCreatedAt)
        {
            var hoursSinceCreation = (DateTime.UtcNow - bookingCreatedAt).TotalHours;
            var hoursRemaining = 12 - hoursSinceCreation;
            return hoursRemaining > 0 ? hoursRemaining : 0;
        }
    }
}