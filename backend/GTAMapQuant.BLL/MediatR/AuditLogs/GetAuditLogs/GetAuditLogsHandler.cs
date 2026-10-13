using FluentResults;
using GTAMapQuant.BLL.DTO.AuditLogs;
using GTAMapQuant.DAL.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GTAMapQuant.BLL.MediatR.AuditLogs.GetAuditLogs;

public class GetAuditLogsHandler
    : IRequestHandler<GetAuditLogsQuery, Result<IEnumerable<AuditLogDto>>>
{
    private readonly GtaMapDbContext _context;

    public GetAuditLogsHandler(GtaMapDbContext context)
    {
        _context = context;
    }

    public async Task<Result<IEnumerable<AuditLogDto>>> Handle(
        GetAuditLogsQuery request,
        CancellationToken cancellationToken)
    {
        var logs = await _context.AuditLogs
            .AsNoTracking()
            .OrderByDescending(log => log.CreatedAtUtc)
            .Take(200)
            .Select(log => new AuditLogDto
            {
                Id = log.Id,
                AdminLogin = log.AdminLogin,
                Action = log.Action,
                EntityType = log.EntityType,
                EntityId = log.EntityId,
                EntityName = log.EntityName,
                Data = log.Data,
                CreatedAtUtc = log.CreatedAtUtc,
            })
            .ToListAsync(cancellationToken);

        return Result.Ok<IEnumerable<AuditLogDto>>(logs);
    }
}
