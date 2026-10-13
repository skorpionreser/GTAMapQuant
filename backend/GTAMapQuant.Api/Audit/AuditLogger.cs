using System.Security.Claims;
using System.Text.Json;
using GTAMapQuant.DAL.Data;
using GTAMapQuant.DAL.Entities;

namespace GTAMapQuant.Api.Audit;

public sealed class AuditLogger : IAuditLogger
{
    private readonly GtaMapDbContext _context;

    public AuditLogger(GtaMapDbContext context)
    {
        _context = context;
    }

    public async Task LogAsync(
        ClaimsPrincipal user,
        string action,
        string entityType,
        Guid entityId,
        string entityName,
        object data,
        CancellationToken cancellationToken)
    {
        Guid? userId = Guid.TryParse(user.FindFirstValue(ClaimTypes.NameIdentifier), out var id)
            ? id
            : null;

        _context.AuditLogs.Add(new AuditLog
        {
            Id = Guid.NewGuid(),
            AdminUserId = userId,
            AdminLogin = user.Identity?.Name ?? "Unknown administrator",
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            EntityName = entityName,
            Data = JsonSerializer.Serialize(data),
            CreatedAtUtc = DateTime.UtcNow,
        });

        await _context.SaveChangesAsync(cancellationToken);
    }
}
