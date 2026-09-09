using GTAMapQuant.DAL.Data;
using Microsoft.AspNetCore.Mvc;
using GTAMapQuant.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace GTAMapQuant.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MapMarkersController : ControllerBase
{
    private readonly GtaMapDbContext _context;

    public MapMarkersController(GtaMapDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MapMarker>>> GetAll()
    {
        return await _context.MapMarkers.ToListAsync();
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<MapMarker>> GetById(Guid id)
    {
        var marker = await _context.MapMarkers.FindAsync(id);

        if (marker == null)
        {
            return NotFound();
        }
        return Ok(marker);
    }

    [HttpPost]
    public async Task<ActionResult<MapMarker>> Create(MapMarker marker)
    {
        var newMarker = new MapMarker
        {
            Id = Guid.NewGuid(),
            Name = marker.Name,
            Description = marker.Description,
            Category = marker.Category,
            X = marker.X,
            Y = marker.Y
        };

        _context.MapMarkers.Add(newMarker);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = newMarker.Id }, newMarker);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var toDelete = await _context.MapMarkers.FindAsync(id);

        if (toDelete == null)
        {
            return NotFound();
        }

        _context.MapMarkers.Remove(toDelete);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, MapMarker marker)
    {
        var toUpdate = await _context.MapMarkers.FindAsync(id);

        if (toUpdate == null)
        {
            return NotFound();
        }

        toUpdate.Name = marker.Name;
        toUpdate.Description = marker.Description;
        toUpdate.Category = marker.Category;
        toUpdate.X = marker.X;
        toUpdate.Y = marker.Y;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}
