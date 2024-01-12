using Microsoft.EntityFrameworkCore;

namespace frontend.Models
{
  public class AppDbContext: DbContext
  {
    public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
    {

    }

    public DbSet<Event> Events { get; set; }
    public DbSet<Registration> Registrations { get; set; }
  }
}