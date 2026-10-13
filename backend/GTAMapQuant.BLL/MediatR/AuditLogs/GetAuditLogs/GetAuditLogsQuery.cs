using FluentResults;
using GTAMapQuant.BLL.DTO.AuditLogs;
using MediatR;

namespace GTAMapQuant.BLL.MediatR.AuditLogs.GetAuditLogs;

public record GetAuditLogsQuery : IRequest<Result<IEnumerable<AuditLogDto>>>;
