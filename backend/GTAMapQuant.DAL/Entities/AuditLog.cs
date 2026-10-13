namespace GTAMapQuant.DAL.Entities;

public class AuditLog
{
    public Guid Id { get; set; }
    public Guid? AdminUserId { get; set; }
    public string AdminLogin { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
    public Guid EntityId { get; set; }
    public string EntityName { get; set; } = string.Empty;
    public string Data { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
}
