using frontend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace frontend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class EventController : ControllerBase
    {
        private readonly AppDbContext context;

        public EventController(AppDbContext _context)
        {
            context = _context;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IResult> Get([FromQuery(Name = "is_owner")] int IsOwner)
        {
            var ctx = context.Events;

            if (IsOwner == 1)
            {
                ctx.Where(data => data.CreatedBy == User.FindFirstValue(ClaimTypes.NameIdentifier));
            }
            return Results.Ok(await ctx.ToListAsync());
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IResult> GetDetail(int id)
        {
            var find = await context.Events.FindAsync(id);
            if (find == null)
            {
                return Results.NotFound();
            }

            return Results.Ok(find);
        }

        [HttpPost]
        public async Task<IResult> Post([FromBody] Event @event)
        {
            if (ModelState.IsValid)
            {
                @event.CreatedBy = User.FindFirstValue(ClaimTypes.NameIdentifier);
                context.Events.Add(@event);
                await context.SaveChangesAsync();

                return Results.Ok(@event);
            }

            return Results.UnprocessableEntity(ModelState);
        }

        [HttpPut("{id}")]
        public async Task<IResult> Put(int id, [FromBody] Event @event)
        {
            var find = await context.Events.FindAsync(id);
            if(find == null)
            {
                return Results.NotFound();
            }

            if (ModelState.IsValid)
            {
                find.Title = @event.Title;
                find.Summary= @event.Summary;
                find.Description = @event.Description;
                await context.SaveChangesAsync();

                return Results.Ok(@event);
            }

            return Results.UnprocessableEntity(ModelState);
        }

        [HttpDelete("{id}")]
        public async Task<IResult> Delete(int id)
        {
            var find = await context.Events.FindAsync(id);
            if (find == null)
            {
                return Results.NotFound();
            }

            context.Events.Remove(find);
            await context.SaveChangesAsync();
            return Results.Ok();
        }
    }


}

