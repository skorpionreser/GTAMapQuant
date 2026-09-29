using System.ComponentModel.DataAnnotations;

namespace GTAMapQuant.DAL.Entities;

public class AdminUser
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Login { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public string Role { get; set; } = "Admin";
}
