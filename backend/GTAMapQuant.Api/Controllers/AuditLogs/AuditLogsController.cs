using GTAMapQuant.BLL.MediatR.AuditLogs.GetAuditLogs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GTAMapQuant.Api.Controllers.AuditLogs;

[Authorize(Roles = "Admin")]
public class AuditLogsController : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        return HandleResult(await Mediator.Send(new GetAuditLogsQuery(), cancellationToken));
    }
}
