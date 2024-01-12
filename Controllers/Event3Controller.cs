using frontend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace frontend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class Event3Controller : ControllerBase
     // can't use other name except weatherforecast / event* on my mac, dont know why
    {
        private readonly AppDbContext context;

        public Event3Controller(AppDbContext _context)
        {
            context = _context;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IResult> Get([FromQuery(Name = "event_id")] int? EventId, [FromQuery(Name = "is_owner")] int? isOwner)
        {
            var ctx = context.Registrations;
            if (EventId != null)
            {
                ctx.Where(data => data.EventId == EventId);
            }
            if (isOwner == 1)
            {
                ctx.Where(data => data.UserId == User.FindFirstValue(ClaimTypes.NameIdentifier));
            }

            return Results.Ok(ctx);
        }

        [HttpPost]
        public async Task<IResult> Post([FromBody] Registration registration)
        {
            if (ModelState.IsValid)
            {
                registration.UserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                context.Registrations.Add(registration);
                await context.SaveChangesAsync();

                return Results.Ok(registration);
            }

            return Results.UnprocessableEntity(ModelState);
        }

        [HttpDelete("{id}")]
        public async Task<IResult> Delete(int id)
        {
            var find = await context.Registrations.FindAsync(id);
            if (find == null)
            {
                return Results.NotFound();
            }

            context.Registrations.Remove(find);
            await context.SaveChangesAsync();
            return Results.Ok();
        }
    }


}

