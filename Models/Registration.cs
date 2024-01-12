using System.ComponentModel.DataAnnotations;

namespace frontend.Models
{
    public class Registration
    {
        public int Id { get; set; }
        [Required]
        public string? Name{ get; set; }
        [Required]
        public string? Email{ get; set; }
        public string? UserId { get; set; }
        public int? EventId { get; set; }
    }
}