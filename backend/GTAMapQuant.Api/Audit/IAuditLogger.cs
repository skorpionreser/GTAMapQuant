using System.Security.Claims;

namespace GTAMapQuant.Api.Audit;

public interface IAuditLogger
{
    Task LogAsync(
        ClaimsPrincipal user,
        string action,
        string entityType,
        Guid entityId,
        string entityName,
        object data,
        CancellationToken cancellationToken);
}
