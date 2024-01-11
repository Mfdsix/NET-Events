using System.ComponentModel.DataAnnotations;

namespace frontend.Models
{
    public class Event
    {
        public int Id { get; set; }
        [Required]
        public string? Title { get; set; }
        [Required]
        public string? Summary { get; set; }
        [Required]
        public string? Description { get; set; }

        public string? CreatedBy { get; set; }
    }
}

